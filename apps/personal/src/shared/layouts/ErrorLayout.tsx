import { Empty } from '../components/ui/Empty'

interface ErrorInfo {
  title?: string
  description?: string
  illustration?: string
  header?: string
  to?: string
}

const defaultErrors: Record<string, ErrorInfo> = {
  '404': {
    title: '404',
    header: 'Oops… You just found an error page',
    description: 'We are sorry but the page you are looking for was not found',
    illustration: 'not-found',
  },
  '500': {
    title: '500',
    header: 'Oops… You just found an error page',
    description: 'We are sorry but our server encountered an internal error',
    illustration: '500',
  },
  '403': {
    title: '403',
    header: 'Oops… Access Forbidden',
    description: 'We are sorry but you do not have permission to access this page',
    illustration: '403',
  },
  '429': {
    title: '429',
    header: 'Oops… Too Many Requests',
    description: 'We are sorry but you have made too many requests. Please try again later',
    illustration: 'fatal-error',
  },
  'maintenance': {
    header: 'Under Maintenance',
    description: 'We are sorry but the site is currently under maintenance. Please check back later',
    illustration: 'computer-fix',
  }
}

interface ErrorLayoutProps {
  errorCode?: string
  type?: '404' | '500' | 'maintenance' | '403' | '429'
  errors?: Record<string, ErrorInfo>
  title?: string
  header?: string
  subtitle?: string
  illustration?: string
  to?: string
}

export default function ErrorLayout({ 
  errorCode, 
  type,
  errors = {}, 
  title,
  header,
  subtitle,
  illustration,
  to = '/'
}: ErrorLayoutProps) {
  const finalType = type || (errorCode as string) || '404'
  const errorConfig = { ...defaultErrors, ...errors }[finalType] || defaultErrors['404']

  const finalHeader = header || errorConfig.header || 'Oops… You just found an error page'
  const finalIllustration = illustration || errorConfig.illustration
  const finalTitle = title || errorConfig.title
  const finalSubtitle = subtitle || errorConfig.description

  return (
    <div className="page page-center border-top-wide border-primary">
      <div className="container-tight py-4">
        <Empty
          illustration={finalIllustration}
          iconText={finalTitle}
          title={finalHeader}
          subtitle={finalSubtitle}
          buttonIcon="arrow-left"
          buttonText="Take me home"
          to={to}
        />
      </div>
    </div>
  )
}