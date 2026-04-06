import { clsx } from 'clsx'
import { Icon } from './Icon'

interface ShapeProps {
  icon: string
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
  rounded?: boolean
}

export function Shape({ icon, size, color, className, rounded }: ShapeProps) {
  const classes = clsx(
    'shape',
    size && `shape-${size}`,
    color && `shape-${color}`,
    rounded && 'rounded-circle',
    className
  )

  return (
    <div className={classes}>
      <Icon icon={icon} />
    </div>
  )
}
