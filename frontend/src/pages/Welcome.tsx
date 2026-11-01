import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, type Checkin } from '../api';
import { useAuth } from '../auth';
import { Alert } from '../components/Fields';
import { MOODS, SYMPTOMS } from '../symptoms';

function firstName(name: string): string {
  const first = name.trim().split(/\s+/)[0] || 'friend';
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

export default function Welcome() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<Checkin | null>(null);

  useEffect(() => {
    api.checkins().then(({ checkins }) => setLast(checkins[0] ?? null)).catch(() => {});
  }, []);

  if (!user) return null;
  const name = firstName(user.name);

  function toggle(id: string) {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  }

  async function save() {
    setError('');
    if (!rating) return setError('Tap a number from 1 to 10 to tell us how you feel today.');
    setBusy(true);
    try {
      const { checkin, plan } = await api.saveCheckin(rating, picked);
      navigate('/recommended', { state: { checkin, plan } });
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <div className="stack stack-lg">
      <div className="welcome-top">
        <span className="avatar" aria-hidden="true">{name.charAt(0)}</span>
        <button type="button" className="btn-outline" onClick={signOut}>Sign out</button>
      </div>

      <div className="heading">
        <h2 className="welcome-title">Welcome, {name}!</h2>
        <p className="question">How do you feel today?</p>
        {last && (
          <p className="muted small">
            Last check-in: {formatDay(last.createdAt)}, you rated {last.rating} out of 10.{' '}
            <Link to="/recommended" className="strong-link">See those exercises</Link>
          </p>
        )}
      </div>

      <fieldset className="group">
        <legend className="muted">Tap a number from 1 to 10.</legend>
        <div className="ratings">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className={rating === n ? 'rating on' : 'rating'}
              aria-pressed={rating === n}
              aria-label={`${n} out of 10, ${MOODS[n]}`}
              onClick={() => { setRating(n); setError(''); }}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="scale-ends">
          <span>1 · Very bad</span>
          <span>10 · Great</span>
        </div>
        {rating > 0 && (
          <p className="rating-text" role="status">You chose {rating} out of 10: {MOODS[rating]}.</p>
        )}
      </fieldset>

      <fieldset className="group">
        <legend className="group-title">Describe your pain</legend>
        <p className="muted small">Choose any that match how you feel. You can pick more than one.</p>
        <div className="symptoms">
          {SYMPTOMS.map((s) => {
            const on = picked.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                className={on ? 'symptom on' : 'symptom'}
                aria-pressed={on}
                onClick={() => toggle(s.id)}
              >
                <span className="check" aria-hidden="true">{on ? '✓' : ''}</span>
                <span className="symptom-text">
                  <span className="symptom-title">{s.title}</span>
                  <span className="symptom-hint">{s.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {error && <Alert kind="error">{error}</Alert>}
      <button type="button" className="btn-primary" onClick={save} disabled={busy}>
        {busy ? 'Finding your exercises…' : 'Save and see my exercises'}
      </button>
    </div>
  );
}
