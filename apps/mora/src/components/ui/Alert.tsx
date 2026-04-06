import { clsx } from 'clsx'
import { Icon } from './Icon'

export interface AlertProps {
  type?: 'success' | 'warning' | 'danger' | 'info'
  icon?: string
  title?: string
  description?: string
  list?: string[]
  action?: string
  link?: string
  important?: boolean
  minor?: boolean
  showClose?: boolean
  avatar?: boolean
  buttons?: boolean
  className?: string
}

const defaultIcons: Record<string, string> = {
  success: 'check',
  warning: 'alert-triangle',
  danger: 'alert-circle',
  info: 'info-circle',
}

export function Alert({
  type = 'success',
  icon,
  title = 'This is a custom alert box!',
  description,
  list,
  action,
  link,
  important,
  minor,
  showClose,
  avatar,
  buttons,
  className,
}: AlertProps) {
  const resolvedIcon = icon || defaultIcons[type]

  const classes = clsx(
    'alert',
    important ? 'alert-important' : minor && 'alert-minor',
    `alert-${type}`,
    showClose && 'alert-dismissible',
    avatar && 'alert-avatar',
    className
  )

  return (
    <div className={classes} role="alert">
      <div className="alert-icon">
        <Icon icon={resolvedIcon} className="alert-icon" />
      </div>

      {description || list ? (
        <div>
          <h4 className="alert-heading">{title}</h4>
          <div className="alert-description">
            {description}
            {list && (
              <ul className="alert-list">
                {list.map((item, i) => <li key={i}>{item}</li>)}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <>
          {title}
          {action && <a href="#" className="alert-action">{action}</a>}
          {link && <a href="#" className="alert-link">{link}</a>}
        </>
      )}

      {buttons && (
        <div className="btn-list">
          <a href="#" className={clsx('btn', `btn-${type}`)}>Okay</a>
          <a href="#" className="btn">Cancel</a>
        </div>
      )}

      {showClose && (
        <a className="btn-close" data-bs-dismiss="alert" aria-label="close" />
      )}
    </div>
  )
}