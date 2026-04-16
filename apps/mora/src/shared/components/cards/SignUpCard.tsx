import React, { useState } from 'react'
import { Icon } from '../ui/Icon'
import { ErrorAlert } from '../ui/ErrorAlert'
import { type RegisterCredentials } from '@/features/auth'

interface SignUpCardProps {
  title?: string
  onSubmit?: (e: React.FormEvent, data: RegisterCredentials) => void
  isLoading?: boolean
  error?: string | null
  fieldErrors?: Record<string, string[]>
}

/** Inline field-level error message with icon */
function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null
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
  )
}

export function SignUpCard({
  title = 'Create new account',
  onSubmit,
  isLoading = false,
  error,
  fieldErrors,
}: SignUpCardProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [agree, setAgree] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(e, {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
    }
  }

  return (
    <>
      <div className="card card-md">
        <div className="card-body">
          <h2 className="h2 text-center mb-4">{title}</h2>

          {error && (
            <ErrorAlert message={error} fieldErrors={fieldErrors} />
          )}

          <form onSubmit={handleSubmit} autoComplete="off" noValidate>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className={`form-control ${fieldErrors?.name ? 'is-invalid' : ''}`}
                placeholder="Enter name"
                autoComplete="off"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
              <FieldError messages={fieldErrors?.name} />
            </div>

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
            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className={`input-group input-group-flat ${fieldErrors?.password ? 'is-invalid' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${fieldErrors?.password ? 'is-invalid' : ''}`}
                  placeholder="Password"
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
                      e.preventDefault()
                      setShowPassword(!showPassword)
                    }}
                  >
                    <Icon icon={showPassword ? 'eye-off' : 'eye'} />
                  </a>
                </span>
              </div>
              <FieldError messages={fieldErrors?.password} />
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <div className={`input-group input-group-flat ${fieldErrors?.password_confirmation ? 'is-invalid' : ''}`}>
                <input
                  type={showPasswordConfirmation ? 'text' : 'password'}
                  className={`form-control ${fieldErrors?.password_confirmation ? 'is-invalid' : ''}`}
                  placeholder="Confirm password"
                  autoComplete="off"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <span className="input-group-text">
                  <a
                    href="#"
                    className="link-secondary"
                    title={showPasswordConfirmation ? 'Hide password' : 'Show password'}
                    onClick={(e) => {
                      e.preventDefault()
                      setShowPasswordConfirmation(!showPasswordConfirmation)
                    }}
                  >
                    <Icon icon={showPasswordConfirmation ? 'eye-off' : 'eye'} />
                  </a>
                </span>
              </div>
              <FieldError messages={fieldErrors?.password_confirmation} />
            </div>

            {/* Agree */}
            <div className="mb-3">
              <label className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  disabled={isLoading}
                />
                <span className="form-check-label">
                  Agree to the{' '}
                  <a href="#" tabIndex={-1}>terms and policy</a>.
                </span>
              </label>
            </div>

            <div className="form-footer">
              <button type="submit" className="btn btn-primary w-100" disabled={isLoading || !agree}>
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating account...
                  </>
                ) : (
                  'Create new account'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="text-center text-secondary mt-3">
        Already have an account?{' '}
        <a href="/sign-in" className="fw-medium">Sign in</a>
      </div>
    </>
  )
}