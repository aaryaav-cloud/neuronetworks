import { Router } from 'express';
import { pool } from '../db.js';
import { DECK_GUIDANCE } from '../data/exercises.js';
import { requireAuth, type AuthedRequest } from '../middleware.js';
import { buildPlan } from '../recommend.js';
import { isSymptomId } from '../symptoms.js';

export const checkinsRouter = Router();
checkinsRouter.use(requireAuth);

// Save today's check-in (a 1–10 rating and any number of symptoms) and
// return the exercise plan built from it.
checkinsRouter.post('/', async (req: AuthedRequest, res) => {
  const rating = Number(req.body?.rating);
  const symptoms: unknown = req.body?.symptoms ?? [];

  if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
    return res.status(400).json({ error: 'Choose a number from 1 to 10.' });
  }
  if (!Array.isArray(symptoms) || !symptoms.every(isSymptomId)) {
    return res.status(400).json({ error: 'One of the symptoms was not recognized. Refresh the page and try again.' });
  }

  const unique = [...new Set(symptoms)];
  const plan = buildPlan(rating, unique);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO checkins (user_id, rating, symptoms) VALUES ($1, $2, $3)
       RETURNING id, rating, symptoms, created_at AS "createdAt"`,
      [req.userId, rating, unique],
    );
    const checkin = rows[0];
    for (const [i, ex] of plan.exercises.entries()) {
      await client.query(
        'INSERT INTO checkin_exercises (checkin_id, exercise_id, position) VALUES ($1, $2, $3)',
        [checkin.id, ex.id, i + 1],
      );
    }
    await client.query('COMMIT');
    res.status(201).json({ checkin, plan: { ...plan, guidance: DECK_GUIDANCE } });
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

// The plan for the person's most recent check-in, so the Recommended
// exercises page still works after a refresh or a later visit.
checkinsRouter.get('/latest/plan', async (req: AuthedRequest, res) => {
  const { rows } = await pool.query(
    `SELECT id, rating, symptoms, created_at AS "createdAt"
     FROM checkins WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
    [req.userId],
  );
  const checkin = rows[0];
  if (!checkin) return res.status(404).json({ error: 'Do a check-in first to get your recommended exercises.' });
  const symptoms = (checkin.symptoms as unknown[]).filter(isSymptomId);
  const plan = buildPlan(checkin.rating, symptoms);
  res.json({ checkin, plan: { ...plan, guidance: DECK_GUIDANCE } });
});

// The person's recent check-ins, newest first, with the exercises each suggested.
checkinsRouter.get('/', async (req: AuthedRequest, res) => {
  const { rows } = await pool.query(
    `SELECT c.id, c.rating, c.symptoms, c.created_at AS "createdAt",
            COALESCE(
              json_agg(json_build_object('id', e.id, 'name', e.name) ORDER BY ce.position)
                FILTER (WHERE e.id IS NOT NULL),
              '[]'
            ) AS exercises
     FROM checkins c
     LEFT JOIN checkin_exercises ce ON ce.checkin_id = c.id
     LEFT JOIN exercises e ON e.id = ce.exercise_id
     WHERE c.user_id = $1
     GROUP BY c.id
     ORDER BY c.created_at DESC
     LIMIT 30`,
    [req.userId],
  );
  res.json({ checkins: rows });
});
