// config must load first: it reads .env before anything else uses process.env.
import { config } from './config.js';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { initDb } from './db.js';
import { authRouter } from './routes/auth.js';
import { checkinsRouter } from './routes/checkins.js';
import { exercisesRouter } from './routes/exercises.js';

const app = express();
app.set('trust proxy', 1); // Render and Vercel sit in front of the app
app.use(cors({ origin: config.frontendUrl }));
app.use(express.json({ limit: '50kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/checkins', checkinsRouter);
app.use('/api/exercises', exercisesRouter);

app.use((_req, res) => res.status(404).json({ error: 'Not found.' }));

// Express 5 sends errors thrown in async routes here.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on our side. Please try again.' });
});

initDb()
  .then(() => {
    app.listen(config.port, () => console.log(`NeuroNetworks API on http://localhost:${config.port}`));
  })
  .catch((err) => {
    console.error('Could not connect to the database. Check DATABASE_URL in .env.\n', err);
    process.exit(1);
  });
