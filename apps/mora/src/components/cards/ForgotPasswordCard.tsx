// src/components/cards/ForgotPasswordCard.tsx

interface ForgotPasswordCardProps {
  title?: string
  onSubmit?: (e: React.FormEvent) => void
}

export function ForgotPasswordCard({
  title = 'Forgot password',
  onSubmit,
}: ForgotPasswordCardProps) {
  return (
    <div className="card card-md">
      <div className="card-body">
        <h2 className="card-title text-center mb-4">{title}</h2>

        <p className="text-secondary mb-4">
          Enter your email address and your password will be reset and emailed to you.
        </p>

        <form onSubmit={onSubmit} autoComplete="off" noValidate>
          <div className="mb-3">
            <label className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              placeholder="your@email.com"
              autoComplete="off"
            />
          </div>

          <div className="form-footer">
            <button type="submit" className="btn btn-primary w-100">
              Send me reset password link
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}