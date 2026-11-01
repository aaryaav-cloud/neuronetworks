import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Alert, TextField } from '../components/Fields';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState('');

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim()) return setError('Enter your email address, like name@gmail.com.');
    setBusy(true);
    try {
      const res = await api.forgot(email);
      setDevLink(res.devResetLink || '');
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="stack">
        <div className="heading">
          <span className="eyebrow">Step 1 of 2</span>
          <h2>Check your email</h2>
          <p className="muted">
            If an account uses <strong className="break">{email.trim()}</strong>, we sent it a link to choose a new
            password. The link works for 30 minutes.
          </p>
          <p className="muted">Don't see it? Look in your spam or junk folder.</p>
        </div>
        {devLink && (
          <Alert kind="success">
            Testing mode (no email service set up yet): <a href={devLink}>open your reset link</a>
          </Alert>
        )}
        <Link to="/signin" className="btn-secondary">Back to sign in</Link>
      </div>
    );
  }

  return (
    <form className="stack" onSubmit={onSubmit} noValidate>
      <div className="heading">
        <span className="eyebrow">Step 1 of 2</span>
        <h2>Reset your password</h2>
        <p className="muted">Enter the email you signed up with. We'll send you a link to choose a new password.</p>
      </div>
      <TextField
        id="email" label="Email" type="email" autoComplete="email" placeholder="you@gmail.com"
        value={email} onChange={(e) => setEmail(e.target.value)}
      />
      {error && <Alert kind="error">{error}</Alert>}
      <button type="submit" className="btn-primary" disabled={busy}>
        {busy ? 'Sending…' : 'Send reset link'}
      </button>
      <p className="center">
        <Link to="/signin" className="strong-link">Back to sign in</Link>
      </p>
    </form>
  );
}
