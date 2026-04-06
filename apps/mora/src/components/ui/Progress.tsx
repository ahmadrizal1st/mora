import { clsx } from 'clsx'

export interface ProgressProps {
  value?: number | string
  values?: number[]
  color?: string
  colors?: string[]
  size?: 'xs' | 'sm' | 'lg' | 'xl'
  striped?: boolean
  animated?: boolean
  showValue?: boolean
  indeterminate?: boolean
  id?: string
  width?: string
  thin?: boolean
  className?: string
  'aria-label'?: string
}

export function Progress({
  value = 38,
  values,
  color,
  colors = ['blue', 'red', 'green', 'yellow', 'dark'],
  size,
  striped,
  animated,
  showValue,
  indeterminate,
  id,
  width,
  thin,
  className,
  'aria-label': ariaLabel,
}: ProgressProps) {
  const percentage = typeof value === 'string' ? parseInt(value.replace('%', ''), 10) : value

  const classes = clsx(
    'progress',
    size && `progress-${size}`,
    thin && 'progress-sm',
    className
  )

  const getBarClasses = (barColor?: string) => clsx(
    'progress-bar',
    barColor && `bg-${barColor}`,
    striped && 'progress-bar-striped',
    animated && 'progress-bar-animated',
    indeterminate && 'progress-bar-indeterminate'
  )

  return (
    <div
      className={classes}
      style={width ? { width } : undefined}
      id={id}
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel || (showValue ? undefined : `${percentage}% Complete`)}
    >
      {indeterminate ? (
        <div className={getBarClasses(color)} />
      ) : values ? (
        values.map((v, i) => (
          <div
            key={i}
            className={getBarClasses(colors[i % colors.length])}
            style={{ width: `${v}%` }}
            role="progressbar"
            aria-valuenow={v}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        ))
      ) : (
        <div
          className={getBarClasses(color)}
          style={{ width: `${percentage}%` }}
        >
          {showValue ? `${percentage}%` : (
            <span className="visually-hidden">{percentage}% Complete</span>
          )}
        </div>
      )}
    </div>
  )
}
