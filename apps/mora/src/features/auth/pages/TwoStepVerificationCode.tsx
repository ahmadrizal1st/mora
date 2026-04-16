// src/features/auth/pages/TwoStepVerificationCode.tsx
import { useRef, useState } from 'react'
import SingleLayout from '@/shared/layouts/SingleLayout'
import { useVerify2FAMutation } from '../hooks/useVerify2FAMutation'
import { AxiosError } from 'axios'

export default function TwoStepVerificationCode() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [error, setError] = useState<string | null>(null)
  const verifyMutation = useVerify2FAMutation()

  const handleInput = (index: number, e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    if (input.value.length === input.maxLength && index + 1 < 6) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.currentTarget.value.length === 0 && e.key === 'Backspace' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Collect code from all inputs
    const code = inputRefs.current.map(input => input?.value || '').join('')

    if (code.length < 6) {
      setError('Please enter the full 6-digit verification code.')
      return
    }

    verifyMutation.mutate({ code }, {
      onError: (err: AxiosError<{ message?: string }>) => {
        setError(err.response?.data?.message || 'Verification failed. Please check the code.')
      }
    })
  }

  return (
    <SingleLayout>
      <form
        className="card card-md"
        onSubmit={handleSubmit}
        autoComplete="off"
        noValidate
      >
        <div className="card-body">
          <h2 className="card-title card-title-lg text-center mb-4">Authenticate Your Account</h2>

          <p className="my-4 text-center">
            Please confirm your account by entering the authorization code sent to your device.
          </p>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="my-5">
            <div className="row g-4">
              {[0, 1].map((group) => (
                <div key={group} className="col">
                  <div className="row g-2">
                    {[0, 1, 2].map((i) => {
                      const idx = group * 3 + i
                      return (
                        <div key={i} className="col">
                          <input
                            ref={(el) => { if (el) inputRefs.current[idx] = el }}
                            type="text"
                            className="form-control form-control-lg text-center px-3 py-3"
                            maxLength={1}
                            inputMode="numeric"
                            pattern="[0-9]*"
                            onInput={(e) => handleInput(idx, e)}
                            onKeyDown={(e) => handleKeyDown(idx, e)}
                            required
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="my-4">
            <label className="form-check">
              <input type="checkbox" className="form-check-input" />
              <span className="form-check-label">Don't ask for codes again on this device</span>
            </label>
          </div>

          <div className="form-footer">
            <div className="btn-list flex-nowrap">
              <a href="/2-step-verification" className="btn w-100">Cancel</a>
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={verifyMutation.isPending}
              >
                {verifyMutation.isPending ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        </div>
      </form>

      <div className="text-center text-secondary mt-3">
        It may take a minute to receive your code. Haven't received it?{' '}
        <a href="#" onClick={(e) => e.preventDefault()}>Resend a new code.</a>
      </div>
    </SingleLayout>
  )
}
