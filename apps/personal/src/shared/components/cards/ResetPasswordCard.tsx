import React from 'react'

interface ResetPasswordCardProps {
  onSubmit?: (password: string, passwordConfirmation: string) => void
  isLoading?: boolean
  error?: string | null
}

export function ResetPasswordCard({ onSubmit, isLoading, error }: ResetPasswordCardProps) {
  const [password, setPassword] = React.useState('')
  const [passwordConfirmation, setPasswordConfirmation] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.(password, passwordConfirmation)
  }

  return (
    <div className="card card-md">
      <div className="card-body">
        <h2 className="card-title text-center mb-4">Reset password</h2>

        <p className="text-secondary mb-4">Please enter your new password below.</p>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} autoComplete="off" noValidate>
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm new password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          <div className="form-footer">
            <button type="submit" className="btn btn-primary w-100" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
