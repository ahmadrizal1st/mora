import { GoogleLogin } from '@react-oauth/google'
import { Icon } from '../ui/Icon'
import { SignInForm } from '../forms/SignInForm'
 
interface SignInCardProps {
  title?: string
  subtitle?: string
  showHeader?: boolean
  onSubmit?: (e: React.FormEvent, data: any) => void
  onGoogleSuccess?: (credentialResponse: any) => void
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
  
          <SignInForm onSubmit={onSubmit} isLoading={isLoading} fieldErrors={fieldErrors} />
        </div>
  
        <div className="hr-text">or</div>
  
        <div className="card-body">
          <div className="d-flex justify-content-center">
            <GoogleLogin
              onSuccess={onGoogleSuccess}
              onError={onGoogleError}
              useOneTap
              theme="outline"
              size="large"
              width="100%"
            />
          </div>
        </div>
      </div>

      {subtitle && (
        <div className="text-center text-secondary mt-3">
          {subtitle}
        </div>
      )}
    </>
  )
}