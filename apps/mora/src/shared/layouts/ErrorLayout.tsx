// src/layouts/ErrorLayout.tsx
import { Empty } from '../components/ui/Empty'

interface ErrorInfo {
  title?: string
  description?: string
  illustration?: string
  header?: string
}

interface ErrorLayoutProps {
  errorCode?: string
  errors?: Record<string, ErrorInfo>
}

export default function ErrorLayout({ errorCode, errors = {} }: ErrorLayoutProps) {
  const error = errorCode ? errors[errorCode] : undefined
  const header = error?.header || 'Oops… You just found an error page'

  return (
    <div className="page page-center border-top-wide border-primary">
      <div className="container-tight py-4">
        <Empty
          illustration={error?.illustration}
          iconText={error?.title}
          title={header}
          subtitle={error?.description}
          buttonIcon="arrow-left"
          buttonText="Take me home"
        />
      </div>
    </div>
  )
}