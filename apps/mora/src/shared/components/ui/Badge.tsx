import { clsx } from 'clsx'
import { Icon } from './Icon'

interface BadgeProps {
  children?: React.ReactNode
  text?: string
  color?: string
  light?: boolean
  outline?: boolean
  pill?: boolean
  scale?: string
  icon?: string
  addon?: string
  addonColor?: string
  className?: string
}

export function Badge({
  children,
  text,
  color,
  light,
  outline,
  pill,
  scale,
  icon,
  addon,
  addonColor,
  className,
}: BadgeProps) {
  const classes = clsx(
    'badge',
    scale && `badge-${scale}`,
    outline && 'badge-outline',
    pill && 'badge-pill',
    color && `bg-${color}${light ? '-lt' : ''}`,
    color && !outline && `text-${color}${light ? '-lt' : ''}-fg`,
    className
  )

  const content = children || text

  return (
    <span className={classes}>
      {icon && <Icon icon={icon} className={clsx(content && 'me-1')} />}
      {content}
      {addon && (
        <span className={clsx('badge-addon', addonColor && `bg-${addonColor}`)}>
          {addon}
        </span>
      )}
    </span>
  )
}