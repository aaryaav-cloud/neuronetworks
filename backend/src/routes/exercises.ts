import { Router } from 'express';
import { pool } from '../db.js';
import { requireAuth } from '../middleware.js';

export const exercisesRouter = Router();
exercisesRouter.use(requireAuth);

// The full card library, with the symptoms each card is matched to.
exercisesRouter.get('/', async (_req, res) => {
  const { rows } = await pool.query(
    `SELECT e.id, e.name, e.kind, e.effort, e.need, e.setup, e.steps, e.benefits, e.tips, e.timer,
            COALESCE(
              json_agg(json_build_object('symptom', s.id, 'symptomTitle', s.title, 'level', es.level, 'reason', es.reason)
                       ORDER BY s.id) FILTER (WHERE s.id IS NOT NULL),
              '[]'
            ) AS symptoms
     FROM exercises e
     LEFT JOIN exercise_symptoms es ON es.exercise_id = e.id
     LEFT JOIN symptoms s ON s.id = es.symptom_id
     GROUP BY e.id
     ORDER BY e.id`,
  );
  res.json({ exercises: rows });
});

exercisesRouter.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) return res.status(404).json({ error: 'Exercise not found.' });
  const { rows } = await pool.query(
    'SELECT id, name, kind, effort, need, setup, steps, benefits, tips, timer FROM exercises WHERE id = $1',
    [id],
  );
  if (!rows[0]) return res.status(404).json({ error: 'Exercise not found.' });
  res.json({ exercise: rows[0] });
});
