import { clsx } from 'clsx'
import { Icon } from './Icon'
import { Button } from './Button'

export interface EmptyProps {
  icon?: string
  iconText?: string
  illustration?: string
  title?: string
  subtitle?: string
  buttonText?: string
  buttonIcon?: string
  illustrationSize?: number
  bordered?: boolean
  className?: string
}

export function Empty({
  icon = 'mood-sad',
  iconText,
  illustration,
  title = 'No results found',
  subtitle = "Try adjusting your search or filter to find what you're looking for.",
  buttonText = 'Search again',
  buttonIcon = 'search',
  illustrationSize = 300,
  bordered,
  className,
}: EmptyProps) {
  const theme = document.documentElement.getAttribute('data-bs-theme') || 'light'

  const classes = clsx('empty', bordered && 'empty-bordered', className)

  return (
    <div className={classes}>
      {illustration ? (
        <div className="empty-img">
          <img
            src={`/static/illustrations/${theme}/${illustration}.png`}
            style={{ width: illustrationSize, maxWidth: '100%', height: 'auto' }}
            alt=""
          />
        </div>
      ) : iconText ? (
        <div className="empty-header">{iconText}</div>
      ) : (
        <div className="empty-icon">
          <Icon icon={icon} />
        </div>
      )}

      <p className="empty-title">{title}</p>
      <p className="empty-subtitle text-secondary">{subtitle}</p>

      <div className="empty-action">
        <Button text={buttonText} color="primary" icon={buttonIcon} href="." />
      </div>
    </div>
  )
}