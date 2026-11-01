import { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../auth';
import { Alert, PasswordField, TextField } from '../components/Fields';

export default function SignIn() {
  const { signIn } = useAuth();
  const location = useLocation();
  const notice = (location.state as { notice?: string } | null)?.notice;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim()) return setError('Enter your email address, like name@gmail.com.');
    if (!password) return setError('Enter your password.');
    setBusy(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <form className="stack" onSubmit={onSubmit} noValidate>
      <div className="heading">
        <h2>Welcome back</h2>
        <p className="muted">Sign in to continue your exercises.</p>
      </div>
      {notice && <Alert kind="success">{notice}</Alert>}
      <TextField
        id="email" label="Email" type="email" autoComplete="email" placeholder="you@gmail.com"
        value={email} onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordField
        id="password" label="Password" autoComplete="current-password"
        value={password} onChange={(e) => setPassword(e.target.value)}
        aside={<Link to="/forgot-password" className="small-link">Forgot password?</Link>}
      />
      {error && <Alert kind="error">{error}</Alert>}
      <button type="submit" className="btn-primary" disabled={busy}>
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="center muted">
        New to NeuroNetworks? <Link to="/signup" className="strong-link">Create an account</Link>
      </p>
    </form>
  );
}
