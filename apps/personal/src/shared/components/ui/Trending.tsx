import { clsx } from 'clsx'
import { Icon } from './Icon'

interface TrendingProps {
  value?: number
  className?: string
  isBadge?: boolean
}

export function Trending({ value = 0, className, isBadge }: TrendingProps) {
  const isPositive = value > 0
  const isZero = value === 0
  const color = isPositive ? 'success' : isZero ? 'secondary' : 'danger'
  const icon = isPositive ? 'arrow-up' : isZero ? 'minus' : 'arrow-down'

  const classes = clsx(
    isBadge
      ? `badge bg-${color}-lt border-0 py-1 px-2 fw-bold`
      : `text-${color} d-inline-flex align-items-center lh-1`,
    className
  )

  const content = (
    <>
      <Icon icon={icon} className={isBadge ? 'me-1' : 'ms-1'} size="xs" />
      <span>
        {isPositive ? '+' : ''}
        {value}%
      </span>
    </>
  )

  if (isBadge) {
    return <span className={classes}>{content}</span>
  }

  return <span className={classes}>{content}</span>
}
