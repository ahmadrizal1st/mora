import { Empty } from '../ui/Empty'

interface ErrorLayoutProps {
  errorCode?: string
  title?: string
  subtitle?: string
  illustration?: string
  header?: string
}

export function ErrorLayout({ 
  errorCode, 
  title, 
  subtitle, 
  illustration, 
  header = 'Oops… You just found an error page' 
}: ErrorLayoutProps) {
  return (
    <div className="page page-center border-top-wide border-primary">
      <div className="container-tight py-4">
        <Empty
          illustration={illustration}
          iconText={errorCode || title}
          title={header}
          subtitle={subtitle}
          buttonIcon="arrow-left"
          buttonText="Take me home"
          to="/"
        />
      </div>
    </div>
  )
}
