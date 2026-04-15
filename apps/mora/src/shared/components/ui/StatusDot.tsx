import { clsx } from 'clsx'

export interface StatusDotProps {
  color?: string
  animated?: boolean
  className?: string
}

export function StatusDot({ color, animated, className }: StatusDotProps) {
  const classes = clsx(
    'status-dot',
    color && `status-${color}`,
    animated && 'status-dot-animated',
    className
  )

  return <span className={classes} />
}

export interface StatusIndicatorProps {
  color?: string
  animated?: boolean
  className?: string
}

export function StatusIndicator({ color, animated, className }: StatusIndicatorProps) {
  const classes = clsx(
    'status-indicator',
    color && `status-${color}`,
    animated && 'status-indicator-animated',
    className
  )

  return (
    <span className={classes}>
      <span className="status-indicator-circle" />
      <span className="status-indicator-circle" />
      <span className="status-indicator-circle" />
    </span>
  )
}
