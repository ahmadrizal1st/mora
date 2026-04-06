import { Icon } from '../ui/Icon'
import { SignInForm } from '../forms/SignInForm'

interface SignInCardProps {
  title?: string
  subtitle?: string
  showHeader?: boolean
  onSubmit?: (e: React.FormEvent, data: any) => void
  isLoading?: boolean
  error?: string | null
  fieldErrors?: Record<string, string[]>
}

export function SignInCard({
  title = 'Login to your account',
  subtitle,
  showHeader,
  onSubmit,
  isLoading,
  error,
  fieldErrors,
}: SignInCardProps) {
  return (
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
        <div className="row g-2">
          <div className="col-12 col-sm-6">
            <a href="#" className="btn w-100">
              <Icon icon="brand-github" className="me-2" />
              Login with Github
            </a>
          </div>
          <div className="col-12 col-sm-6">
            <a href="#" className="btn w-100">
              <Icon icon="brand-x" className="me-2 text-x" />
              Login with X
            </a>
          </div>
        </div>
      </div>

      {subtitle && (
        <div className="text-center text-secondary mt-3">
          {subtitle}
        </div>
      )}
    </div>
  )
}