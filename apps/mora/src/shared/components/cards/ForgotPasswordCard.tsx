// src/shared/components/cards/ForgotPasswordCard.tsx
import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'

interface ForgotPasswordCardProps {
  title?: string
  onSubmit?: (email: string) => void
  isLoading?: boolean
  error?: string | null
  success?: boolean
}

export function ForgotPasswordCard({
  title = 'Forgot password',
  onSubmit,
  isLoading,
  error,
  success
}: ForgotPasswordCardProps) {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(email)
  }

  return (
    <div className="card card-md">
      <div className="card-body">
        <h2 className="card-title text-center mb-4">{title}</h2>

        {success ? (
          <div className="text-center">
            <div className="mb-4">
              <p className="text-secondary">
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.
              </p>
            </div>
            <Link to="/sign-in" className="btn btn-primary w-100">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <p className="text-secondary mb-4">
              Enter your email address and your password will be reset and emailed to you.
            </p>

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} autoComplete="off" noValidate>
              <div className="mb-3">
                <label className="form-label">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="your@email.com"
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-footer">
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send me reset password link'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}