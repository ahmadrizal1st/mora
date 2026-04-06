import { clsx } from 'clsx'
import { Icon } from './Icon'

export interface RibbonProps {
  text?: string
  color?: string
  top?: boolean
  left?: boolean
  bottom?: boolean
  bookmark?: boolean
  icon?: string
  iconFilled?: boolean
  className?: string
}

export function Ribbon({
  text,
  color,
  top,
  left,
  bottom,
  bookmark,
  icon = 'star',
  iconFilled,
  className,
}: RibbonProps) {
  const classes = clsx(
    'ribbon',
    top && 'ribbon-top',
    left && 'ribbon-start',
    bottom && 'ribbon-bottom',
    bookmark && 'ribbon-bookmark',
    color && `bg-${color}`,
    className
  )

  return (
    <div className={classes}>
      {text ? text : <Icon icon={icon} filled={iconFilled} />}
    </div>
  )
}
