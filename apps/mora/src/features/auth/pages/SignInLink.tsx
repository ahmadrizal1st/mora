// src/features/auth/pages/SignInLink.tsx
import { useState } from 'react'
import SingleLayout from '@/shared/layouts/SingleLayout'
import { useMagicLinkMutation } from '../hooks/useMagicLinkMutation'
import { AxiosError } from 'axios'

export default function SignInLink() {
  const [email, setEmail] = useState('')
  const [isSent, setIsSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const magicLinkMutation = useMagicLinkMutation()

  const handleSendLink = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    magicLinkMutation.mutate({ email }, {
      onSuccess: () => {
        setIsSent(true)
      },
      onError: (err: AxiosError<{ message?: string }>) => {
        setError(err.response?.data?.message || 'Failed to send magic link.')
      }
    })
  }

  if (isSent) {
    return (
      <SingleLayout>
        <div className="text-center">
          <div className="my-5">
            <h2 className="h1">Check your inbox</h2>
            <p className="fs-h3 text-secondary">
              We've sent you a magic link to <strong>{email}</strong>.<br />
              Please click the link to confirm your address.
            </p>
          </div>
          <div className="text-center text-secondary mt-3">
            Can't see the email? Please check the spam folder.<br />
            Wrong email? Please <a href="#" onClick={() => setIsSent(false)}>re-enter your address</a>.
          </div>
        </div>
      </SingleLayout>
    )
  }

  return (
    <SingleLayout>
      <div className="card card-md">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">Sign in with magic link</h2>
          <p className="text-secondary mb-4 text-center">
            Enter your email address and we'll send you a link to sign in instantly.
          </p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSendLink} autoComplete="off" noValidate>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-footer">
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={magicLinkMutation.isPending}
              >
                {magicLinkMutation.isPending ? 'Sending...' : 'Send magic link'}
              </button>
            </div>
          </form>

          <div className="text-center text-secondary mt-4">
            Forget it, <a href="/sign-in">send me back</a> to the sign in screen.
          </div>
        </div>
      </div>
    </SingleLayout>
  )
}
