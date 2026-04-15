import { clsx } from 'clsx'
import { Progress } from './Progress'
import { Flag } from './Flag'

export interface ProgressBgProps {
  value?: number | string
  color?: string
  text?: string
  flag?: string
  showValue?: boolean
  className?: string
}

export function ProgressBg({ 
  value = 0, 
  color = 'primary-lt', 
  text, 
  flag,
  showValue,
  className 
}: ProgressBgProps) {
  const percentage = typeof value === 'string' ? parseInt(value.replace('%', ''), 10) : value

  return (
    <div className={clsx('progressbg', className)}>
      <Progress value={percentage} color={color} className="progressbg-progress" />
      {text && (
        <div className="progressbg-text">
          {flag && <Flag flag={flag} className="me-2" size="xs" />}
          {text}
        </div>
      )}
      {showValue && <div className="progressbg-value">{percentage}%</div>}
    </div>
  )
}

export interface ProgressDescriptionProps {
  label?: string
  value?: number | string
  color?: string
  description?: string
  size?: 'xs' | 'sm' | 'lg' | 'xl'
  className?: string
}

export function ProgressDescription({
  label = 'Label',
  value = 60,
  color = 'blue',
  description,
  size = 'sm',
  className,
}: ProgressDescriptionProps) {
  const percentage = typeof value === 'string' ? parseInt(value.replace('%', ''), 10) : value

  return (
    <div className={className}>
      <div className="d-flex mb-1 align-items-center lh-1">
        <div className="fs-5 fw-semibold m-0">{label}</div>
        {description && (
          <div className="fs-6 text-secondary ms-2">{description}</div>
        )}
        <span className="ms-auto fs-6 strong">{percentage}%</span>
      </div>
      <Progress size={size} value={percentage} color={color} />
    </div>
  )
}

export interface ProgressStepsProps {
  count?: number
  labels?: string[]
  active?: number
  color?: string
  className?: string
  id?: string
  'aria-label'?: string
}

export function ProgressSteps({
  count = 3,
  labels = [],
  active = 1,
  color = 'primary',
  className,
  id,
  'aria-label': ariaLabel,
}: ProgressStepsProps) {
  const stepCount = labels.length > 0 ? labels.length : count
  const stepsAr = Array.from({ length: stepCount }, (_, i) => i + 1)

  return (
    <div 
      className={clsx('progress progress-steps', className)}
      id={id}
      aria-label={ariaLabel}
    >
      {stepsAr.map((n, i) => {
        const label = labels[i] || `Step ${n}`
        return (
          <div
            key={i}
            className={clsx('progress-bar', n <= active && `bg-${color}`)}
            aria-current={n === active ? 'step' : undefined}
            role="progressbar"
            style={{ width: `${100 / stepCount}%` }}
          >
            <span className="visually-hidden">{label}</span>
          </div>
        )
      })}
    </div>
  )
}
