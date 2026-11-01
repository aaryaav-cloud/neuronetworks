import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config.js';
import { pool } from '../db.js';
import { sendResetEmail } from '../email.js';
import { requireAuth, signToken, type AuthedRequest } from '../middleware.js';

export const authRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESET_MINUTES = 30;

// Slows down password guessing and reset-email spam.
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many tries. Please wait a few minutes and try again.' },
});

function cleanEmail(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function publicUser(row: { id: number; name: string; email: string }) {
  return { id: row.id, name: row.name, email: row.email };
}

function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

authRouter.post('/signup', limiter, async (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const email = cleanEmail(req.body?.email);
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!name) return res.status(400).json({ error: 'Enter your first name.' });
  if (name.length > 60) return res.status(400).json({ error: 'Please use a shorter name (60 characters or fewer).' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Enter your email address, like name@gmail.com.' });
  if (password.length < 8) return res.status(400).json({ error: 'Choose a password with at least 8 characters.' });

  const existing = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
  if (existing.rowCount) {
    return res.status(409).json({ error: 'An account with this email already exists. Sign in instead.' });
  }

  const hash = await bcrypt.hash(password, 12);
  const { rows } = await pool.query(
    'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
    [name, email, hash],
  );
  const user = rows[0];
  res.status(201).json({ token: signToken(user.id), user: publicUser(user) });
});

authRouter.post('/login', limiter, async (req, res) => {
  const email = cleanEmail(req.body?.email);
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Enter your email address, like name@gmail.com.' });
  if (!password) return res.status(400).json({ error: 'Enter your password.' });

  const { rows } = await pool.query('SELECT id, name, email, password_hash FROM users WHERE email = $1', [email]);
  const user = rows[0];
  const ok = user ? await bcrypt.compare(password, user.password_hash) : false;
  if (!user || !ok) {
    return res.status(401).json({ error: "That email and password don't match. Try again, or reset your password." });
  }
  res.json({ token: signToken(user.id), user: publicUser(user) });
});

authRouter.get('/me', requireAuth, async (req: AuthedRequest, res) => {
  const { rows } = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [req.userId]);
  if (!rows[0]) return res.status(401).json({ error: 'Please sign in again.' });
  res.json({ user: publicUser(rows[0]) });
});

// Step 1: the person enters their email. If an account exists we email a
// one-time link. The reply is the same either way, so nobody can use this
// form to find out who has an account.
authRouter.post('/forgot', limiter, async (req, res) => {
  const email = cleanEmail(req.body?.email);
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Enter your email address, like name@gmail.com.' });

  const { rows } = await pool.query('SELECT id, name, email FROM users WHERE email = $1', [email]);
  const user = rows[0];
  let devResetLink: string | undefined;

  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    await pool.query('DELETE FROM password_resets WHERE user_id = $1', [user.id]);
    await pool.query(
      `INSERT INTO password_resets (user_id, token_hash, expires_at)
       VALUES ($1, $2, now() + make_interval(mins => $3))`,
      [user.id, hashToken(token), RESET_MINUTES],
    );
    const link = `${config.frontendUrl}/reset-password?token=${token}`;
    try {
      await sendResetEmail(user.email, user.name, link);
    } catch (err) {
      console.error('Could not send reset email:', err);
      return res.status(502).json({ error: "We couldn't send the email right now. Please try again in a few minutes." });
    }
    // Local testing only: hand the link back when no email service is set up.
    if (!config.isProduction && !config.resendApiKey) devResetLink = link;
  }

  res.json({ ok: true, ...(devResetLink ? { devResetLink } : {}) });
});

// Step 2: the person opens the link and chooses a new password.
authRouter.post('/reset', limiter, async (req, res) => {
  const token = typeof req.body?.token === 'string' ? req.body.token : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!token) return res.status(400).json({ error: 'This reset link is incomplete. Request a new one.' });
  if (password.length < 8) return res.status(400).json({ error: 'Choose a password with at least 8 characters.' });

  const { rows } = await pool.query(
    `SELECT id, user_id FROM password_resets
     WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now()`,
    [hashToken(token)],
  );
  const reset = rows[0];
  if (!reset) {
    return res.status(400).json({ error: 'This reset link has expired or was already used. Request a new one.' });
  }

  const hash = await bcrypt.hash(password, 12);
  await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, reset.user_id]);
  await pool.query('UPDATE password_resets SET used_at = now() WHERE id = $1', [reset.id]);
  res.json({ ok: true });
});
