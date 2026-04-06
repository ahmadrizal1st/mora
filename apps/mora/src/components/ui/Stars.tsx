import { clsx } from 'clsx'
import { Icon } from './Icon'

export interface StarsProps {
  count?: number
  rate?: number
  icon?: string
  color?: string
  filled?: boolean
  className?: string
}

export function Stars({
  count = 5,
  rate = 4,
  icon = 'star',
  color = 'yellow',
  filled,
  className,
}: StarsProps) {
  return (
    <div className={clsx('stars', className)}>
      {Array.from({ length: count }, (_, i) => {
        const active = i + 1 <= rate
        return (
          <span key={i} className={clsx('star', active && `text-${color}`)}>
            <Icon icon={icon} filled={filled && active} />
          </span>
        )
      })}
    </div>
  )
}
