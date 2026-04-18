import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInFormData } from './SignInForm.schema';
export type { SignInFormData };
import { Icon } from '@/shared/components/ui/Icon';

interface SignInFormProps {
  onSubmit: (data: SignInFormData) => void;
  forgotPasswordHref?: string;
  isLoading?: boolean;
  fieldErrors?: Record<string, string[]>;
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return (
    <p className="field-error-msg mt-1 text-danger small">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="me-1">
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
  fieldErrors, // backend errors mapped from API
}: SignInFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '', remember: false },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate>
      {/* Email */}
      <div className="mb-3">
        <label className="form-label">Email address</label>
        <input
          type="email"
          className={`form-control ${errors.email || fieldErrors?.email ? 'is-invalid' : ''}`}
          placeholder="your@email.com"
          disabled={isLoading}
          {...register('email')}
        />
        <FieldError messages={errors.email ? [errors.email.message!] : fieldErrors?.email} />
      </div>

      {/* Password */}
      <div className="mb-2">
        <label className="form-label">
          Password
          <span className="form-label-description">
            <Link to={forgotPasswordHref as any}>I forgot password</Link>
          </span>
        </label>
        <div className={`input-group input-group-flat ${errors.password || fieldErrors?.password ? 'is-invalid' : ''}`}>
          <input
            type={showPassword ? 'text' : 'password'}
            className={`form-control ${errors.password || fieldErrors?.password ? 'is-invalid' : ''}`}
            placeholder="Your password"
            disabled={isLoading}
            {...register('password')}
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
        <FieldError messages={errors.password ? [errors.password.message!] : fieldErrors?.password} />
      </div>

      {/* Remember me */}
      <div className="mb-2">
        <label className="form-check">
          <input type="checkbox" className="form-check-input" disabled={isLoading} {...register('remember')} />
          <span className="form-check-label">Remember me on this device</span>
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

