// src/components/cards/SignUpCard.tsx
import React, { useState } from 'react'
import { Icon } from '../ui/Icon'

interface SignUpCardProps {
  title?: string
  onSubmit?: (e: React.FormEvent, data: any) => void
  isLoading?: boolean
  error?: string | null
  fieldErrors?: Record<string, string[]>
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
          <div className="alert alert-danger mb-4" role="alert">
            <div className="d-flex">
              <div>
                <Icon icon="alert-circle" className="me-2" />
              </div>
              <div>
                {error}
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" noValidate>
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
            {fieldErrors?.name && (
              <div className="invalid-feedback d-block">{fieldErrors.name[0]}</div>
            )}
          </div>

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
            {fieldErrors?.email && (
              <div className="invalid-feedback d-block">{fieldErrors.email[0]}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <div className="input-group input-group-flat">
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
            {fieldErrors?.password && (
              <div className="invalid-feedback d-block">{fieldErrors.password[0]}</div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <div className="input-group input-group-flat">
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
            {fieldErrors?.password_confirmation && (
              <div className="invalid-feedback d-block">{fieldErrors.password_confirmation[0]}</div>
            )}
          </div>

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
        <a href="/sign-in" tabIndex={-1}>Sign in</a>
      </div>
    </>
  )
}