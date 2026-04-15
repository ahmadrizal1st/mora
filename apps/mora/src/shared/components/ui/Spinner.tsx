import { clsx } from 'clsx'

interface SpinnerProps {
  type?: 'border' | 'grow'
  color?: string
  size?: string
  className?: string
  element?: 'div' | 'span'
}

export function Spinner({
  type = 'border',
  color,
  size,
  className,
  element: El = 'div',
}: SpinnerProps) {
  const classes = clsx(
    `spinner-${type}`,
    color && `text-${color}`,
    size && `spinner-${type}-${size}`,
    className
  )

  return <El className={classes} role="status" />
}