import { useState, type InputHTMLAttributes, type ReactNode } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  hint?: string;
}

export function TextField({ id, label, hint, ...input }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-describedby={hint ? `${id}-hint` : undefined} {...input} />
      {hint && <span id={`${id}-hint`} className="field-hint">{hint}</span>}
    </div>
  );
}

// A password box with a Show / Hide button. `aside` sits next to the label
// (used for the "Forgot password?" link).
export function PasswordField({ id, label, hint, aside, ...input }: FieldProps & { aside?: ReactNode }) {
  const [show, setShow] = useState(false);
  return (
    <div className="field">
      <div className="field-row">
        <label htmlFor={id}>{label}</label>
        {aside}
      </div>
      <div className="password-wrap">
        <input id={id} type={show ? 'text' : 'password'} aria-describedby={hint ? `${id}-hint` : undefined} {...input} />
        <button
          type="button"
          className="show-toggle"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
          aria-pressed={show}
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      {hint && <span id={`${id}-hint`} className="field-hint">{hint}</span>}
    </div>
  );
}

export function Alert({ kind, children }: { kind: 'error' | 'success'; children: ReactNode }) {
  return (
    <p className={`alert alert-${kind}`} role={kind === 'error' ? 'alert' : 'status'}>
      {children}
    </p>
  );
}
