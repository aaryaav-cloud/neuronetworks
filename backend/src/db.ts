import pg from 'pg';
import { config } from './config.js';
import { EXERCISES } from './data/exercises.js';
import { SYMPTOM_MAP } from './data/symptomMap.js';
import { SYMPTOM_TITLES } from './symptoms.js';

export const pool = new pg.Pool({ connectionString: config.databaseUrl });

// Creates the tables on startup if they don't exist yet, then loads the
// exercise cards and the symptom map into them.
export async function initDb(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id            SERIAL PRIMARY KEY,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS password_resets (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token_hash  TEXT NOT NULL UNIQUE,
      expires_at  TIMESTAMPTZ NOT NULL,
      used_at     TIMESTAMPTZ
    );

    CREATE TABLE IF NOT EXISTS checkins (
      id          SERIAL PRIMARY KEY,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      rating      SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 10),
      symptoms    TEXT[] NOT NULL DEFAULT '{}',
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS checkins_user_created ON checkins (user_id, created_at DESC);

    -- The 12 symptoms patients can pick.
    CREATE TABLE IF NOT EXISTS symptoms (
      id     TEXT PRIMARY KEY,
      title  TEXT NOT NULL
    );

    -- One row per exercise card. id = the number printed on the card.
    CREATE TABLE IF NOT EXISTS exercises (
      id        INTEGER PRIMARY KEY,
      name      TEXT NOT NULL,
      kind      TEXT NOT NULL CHECK (kind IN ('stretch', 'range', 'strength', 'core')),
      effort    SMALLINT NOT NULL CHECK (effort BETWEEN 1 AND 3),
      need      TEXT NOT NULL,
      setup     TEXT NOT NULL,
      steps     JSONB NOT NULL,
      benefits  JSONB NOT NULL,
      tips      JSONB NOT NULL
    );
    ALTER TABLE exercises ADD COLUMN IF NOT EXISTS timer JSONB;

    -- How each card's benefits line up with each symptom.
    CREATE TABLE IF NOT EXISTS exercise_symptoms (
      exercise_id  INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
      symptom_id   TEXT NOT NULL REFERENCES symptoms(id) ON DELETE CASCADE,
      level        TEXT NOT NULL CHECK (level IN ('direct', 'related', 'caution')),
      reason       TEXT NOT NULL,
      PRIMARY KEY (exercise_id, symptom_id)
    );

    -- Which exercises each check-in suggested, in order.
    CREATE TABLE IF NOT EXISTS checkin_exercises (
      checkin_id   INTEGER NOT NULL REFERENCES checkins(id) ON DELETE CASCADE,
      exercise_id  INTEGER NOT NULL REFERENCES exercises(id),
      position     SMALLINT NOT NULL,
      PRIMARY KEY (checkin_id, exercise_id)
    );
  `);

  await seedExercises();
}

// Loads (or refreshes) the cards and the symptom map from src/data.
// Safe to run on every start: it updates rows in place.
async function seedExercises(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const [id, title] of Object.entries(SYMPTOM_TITLES)) {
      await client.query(
        `INSERT INTO symptoms (id, title) VALUES ($1, $2)
         ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title`,
        [id, title],
      );
    }

    for (const e of EXERCISES) {
      await client.query(
        `INSERT INTO exercises (id, name, kind, effort, need, setup, steps, benefits, tips, timer)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name, kind = EXCLUDED.kind, effort = EXCLUDED.effort,
           need = EXCLUDED.need, setup = EXCLUDED.setup, steps = EXCLUDED.steps,
           benefits = EXCLUDED.benefits, tips = EXCLUDED.tips, timer = EXCLUDED.timer`,
        [e.id, e.name, e.kind, e.effort, e.need, e.setup,
         JSON.stringify(e.steps), JSON.stringify(e.benefits), JSON.stringify(e.tips), JSON.stringify(e.timer)],
      );
    }

    await client.query('DELETE FROM exercise_symptoms');
    for (const m of SYMPTOM_MAP) {
      await client.query(
        'INSERT INTO exercise_symptoms (exercise_id, symptom_id, level, reason) VALUES ($1, $2, $3, $4)',
        [m.exercise, m.symptom, m.level, m.reason],
      );
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
