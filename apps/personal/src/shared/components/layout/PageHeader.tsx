import { clsx } from 'clsx'
import { Icon } from '../ui/Icon'

interface PageHeaderProps {
  title?: string
  pretitle?: React.ReactNode
  description?: string
  icon?: string
  className?: string
  containerClass?: string
  actions?: React.ReactNode
  showBackButton?: boolean
}

export function PageHeader({
  title,
  pretitle,
  description,
  icon,
  className,
  containerClass,
  actions,
  showBackButton,
}: PageHeaderProps) {
  if (!title) return null

  return (
    <div className={clsx('page-header', 'd-print-none', className)}>
      <div className={clsx('container-xl', containerClass)}>
        <div className="row g-2 align-items-center">
          <div className="col">
            {pretitle && <div className="page-pretitle">{pretitle}</div>}
            <h1 className="page-title">
              {showBackButton && (
                <a
                  href="#"
                  className="text-reset me-2 d-md-none"
                  onClick={(e) => {
                    e.preventDefault()
                    window.history.back()
                  }}
                  aria-label="Go back"
                >
                  <Icon icon="arrow-left" />
                </a>
              )}
              {icon && (
                <span
                  className={clsx(
                    'text-reset me-2',
                    icon === 'arrow-left' && !showBackButton && 'd-md-none'
                  )}
                >
                  <Icon icon={icon} />
                </span>
              )}
              {title}
            </h1>
            {description && <div className="text-secondary mt-1">{description}</div>}
          </div>
          {actions && <div className="col-auto ms-auto d-print-none">{actions}</div>}
        </div>
      </div>
    </div>
  )
}
