import { Link } from '@tanstack/react-router'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { SignInForm, type SignInFormData } from '@/features/auth/components/SignInForm'
import { ErrorAlert } from '../ui/ErrorAlert'

interface SignInCardProps {
  title?: string
  subtitle?: string
  showHeader?: boolean
  onSubmit?: (data: SignInFormData) => void
  onGoogleSuccess?: (credentialResponse: CredentialResponse) => void
  onGoogleError?: () => void
  isLoading?: boolean
  error?: string | null
  fieldErrors?: Record<string, string[]>
}

export function SignInCard({
  title = 'Login to your account',
  subtitle,
  showHeader,
  onSubmit,
  onGoogleSuccess = () => {},
  onGoogleError,
  isLoading,
  error,
  fieldErrors,
}: SignInCardProps) {
  return (
    <>
      <div className="card card-md">
        {showHeader && (
          <div className="card-header">
            <h2 className="card-title">{title}</h2>
          </div>
        )}
        <div className="card-body">
          {!showHeader && <h2 className="h2 text-center mb-4">{title}</h2>}

          {error && (
            <ErrorAlert message={error} fieldErrors={fieldErrors} />
          )}

          <SignInForm 
            onSubmit={(data) => onSubmit?.(data)} 
            isLoading={isLoading} 
            fieldErrors={fieldErrors} 
          />
        </div>

        <div className="hr-text">or</div>

        <div className="card-body">
          <div className="d-flex justify-content-center">
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={onGoogleError}
              theme="outline"
              size="large"
            />
          </div>
          </div>
        </div>
      </div>

      <div className="text-center text-secondary mt-3">
        {subtitle ? (
          subtitle
        ) : (
          <>
            Don't have an account?{' '}
            <Link to="/sign-up" className="fw-medium">Sign up</Link>
          </>
        )}
      </div>
    </>
  )
}