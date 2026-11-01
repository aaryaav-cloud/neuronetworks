import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth';
import { Alert, PasswordField, TextField } from '../components/Fields';

export default function SignUp() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Enter your first name.');
    if (!email.trim()) return setError('Enter your email address, like name@gmail.com.');
    if (password.length < 8) return setError('Choose a password with at least 8 characters.');
    setBusy(true);
    try {
      await signUp(name, email, password);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <form className="stack" onSubmit={onSubmit} noValidate>
      <div className="heading">
        <h2>Create your account</h2>
        <p className="muted">A parent or caregiver can set this up for you.</p>
      </div>
      <TextField
        id="name" label="First name" autoComplete="given-name" placeholder="Maya" maxLength={60}
        value={name} onChange={(e) => setName(e.target.value)}
      />
      <TextField
        id="email" label="Email" type="email" autoComplete="email" placeholder="you@gmail.com"
        value={email} onChange={(e) => setEmail(e.target.value)}
      />
      <PasswordField
        id="password" label="Password" autoComplete="new-password" hint="At least 8 characters."
        value={password} onChange={(e) => setPassword(e.target.value)}
      />
      {error && <Alert kind="error">{error}</Alert>}
      <button type="submit" className="btn-primary" disabled={busy}>
        {busy ? 'Creating your account…' : 'Create account'}
      </button>
      <p className="center muted">
        Already have an account? <Link to="/signin" className="strong-link">Sign in</Link>
      </p>
    </form>
  );
}
