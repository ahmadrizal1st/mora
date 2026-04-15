import React, { useState } from 'react';
import { Icon } from '@/shared/components/ui/Icon';

interface SignInFormProps {
  onSubmit?: (e: React.FormEvent, data: any) => void;
  forgotPasswordHref?: string;
  isLoading?: boolean;
  fieldErrors?: Record<string, string[]>;
}

/** Inline field-level error message with icon */
function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p className="field-error-msg">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {messages[0]}
    </p>
  );
}

export function SignInForm({
  onSubmit,
  forgotPasswordHref = '/forgot-password',
  isLoading = false,
  fieldErrors
}: SignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e, { email, password });
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off" noValidate>
      {/* Email */}
      <div className="mb-3">
        <label className="form-label">Email address</label>
        <input
          type="email"
          className={`form-control ${fieldErrors?.email ? 'is-invalid' : ''}`}
          placeholder="your@email.com"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />
        <FieldError messages={fieldErrors?.email} />
      </div>

      {/* Password */}
      <div className="mb-2">
        <label className="form-label">
          Password
          <span className="form-label-description">
            <a href={forgotPasswordHref}>I forgot password</a>
          </span>
        </label>
        <div className={`input-group input-group-flat ${fieldErrors?.password ? 'is-invalid' : ''}`}>
          <input
            type={showPassword ? 'text' : 'password'}
            className={`form-control ${fieldErrors?.password ? 'is-invalid' : ''}`}
            placeholder="Your password"
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          <span className="input-group-text">
            <a
              href="#"
              className="link-secondary"
              title={showPassword ? 'Hide password' : 'Show password'}
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
            >
              <Icon icon={showPassword ? 'eye-off' : 'eye'} />
            </a>
          </span>
        </div>
        <FieldError messages={fieldErrors?.password} />
      </div>

      {/* Remember me */}
      <div className="mb-2">
        <label className="form-check">
          <input type="checkbox" className="form-check-input" disabled={isLoading} />
          <span className="form-check-label">
            Remember me on this device
          </span>
        </label>
      </div>

      <div className="form-footer">
        <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </button>
      </div>
    </form>
  );
}
