import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../auth';
import { Alert, PasswordField } from '../components/Fields';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) return setError('Choose a password with at least 8 characters.');
    if (password !== password2) return setError("The two passwords don't match. Type them again.");
    setBusy(true);
    try {
      await api.reset(token, password);
      if (user) signOut();
      navigate('/signin', { replace: true, state: { notice: 'Your password is updated. Sign in with your new password.' } });
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  if (!token) {
    return (
      <div className="stack">
        <div className="heading">
          <h2>This link is incomplete</h2>
          <p className="muted">Open the link from your email again, or ask for a new one.</p>
        </div>
        <Link to="/forgot-password" className="btn-primary">Send a new link</Link>
      </div>
    );
  }

  return (
    <form className="stack" onSubmit={onSubmit} noValidate>
      <div className="heading">
        <span className="eyebrow">Step 2 of 2</span>
        <h2>Create a new password</h2>
      </div>
      <PasswordField
        id="new-password" label="New password" autoComplete="new-password" hint="At least 8 characters."
        value={password} onChange={(e) => setPassword(e.target.value)}
      />
      <PasswordField
        id="new-password-2" label="Type it again" autoComplete="new-password"
        value={password2} onChange={(e) => setPassword2(e.target.value)}
      />
      {error && <Alert kind="error">{error}</Alert>}
      <button type="submit" className="btn-primary" disabled={busy}>
        {busy ? 'Saving…' : 'Save new password'}
      </button>
      <p className="center">
        <Link to="/forgot-password" className="strong-link">Need a new link?</Link>
      </p>
    </form>
  );
}
