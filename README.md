# NeuroNetworks

Guided therapy exercises for brachial plexus injury patients. Patients sign up, check in with how they feel (1–10) and which kinds of pain they have, and (next) get exercises matched to those symptoms.

```
neuronetworks/
  backend/    Express + TypeScript API, Postgres, password-reset emails
  frontend/   React + TypeScript + Vite
```

## Run it on your computer

You need Node.js 20 or newer and a Postgres database (a free Neon database works).

**1. Backend** (terminal 1)

```bash
cd backend
cp .env.example .env      # then open .env and fill in DATABASE_URL and JWT_SECRET
npm install
npm run dev
```

You should see `NeuroNetworks API on http://localhost:4000`. The tables are created automatically the first time it starts.

**2. Frontend** (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

### Testing "Forgot password" without email

If `RESEND_API_KEY` is empty, no email is sent. The reset link is printed in the backend terminal, and the "Check your email" screen shows a testing link you can click. Both go away once you add a Resend key.

## What the API does

| Method | Path | What it does |
| --- | --- | --- |
| POST | `/api/auth/signup` | Create an account (name, email, password). Returns a login token. |
| POST | `/api/auth/login` | Sign in. Returns a login token. |
| GET | `/api/auth/me` | The signed-in person's name and email. |
| POST | `/api/auth/forgot` | Email a one-time reset link (works for 30 minutes). |
| POST | `/api/auth/reset` | Set a new password using the link's token. |
| POST | `/api/checkins` | Save today's rating (1–10) and symptoms. |
| GET | `/api/checkins` | The last 30 check-ins, newest first. |

Passwords are hashed with bcrypt. Reset tokens are stored only as a SHA-256 hash and can be used once. Login, sign-up and reset routes are rate-limited.

## Database tables

- `users`: id, name, email, password_hash, created_at
- `password_resets`: one-time reset tokens (hashed) with an expiry
- `checkins`: user_id, rating (1–10), symptoms (list of ids), created_at

## Adding a symptom

Add it in both places, using the same id:
- `backend/src/symptoms.ts`
- `frontend/src/symptoms.ts`

## Deploying (same setup as Ticker & Tell)

**Backend on Render**
- Root directory: `backend`
- Build command: `npm install --include=dev && npm run build`
- Start command: `npm start`
- Environment: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL` (your Vercel URL), `RESEND_API_KEY`, `EMAIL_FROM`, `NODE_ENV=production`

**Frontend on Vercel**
- Root directory: `frontend`
- Edit `frontend/vercel.json` and replace `YOUR-RENDER-SERVICE` with your Render service name.

**Resend**: to email patients other than yourself, verify a domain in Resend and set `EMAIL_FROM` to an address on it.
