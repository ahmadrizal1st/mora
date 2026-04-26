import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import { Icon } from './Icon'

export interface TimelineItemProps {
  time: string
  title: string
  description?: string
  active?: boolean
  icon?: string
  iconBg?: string
  children?: ReactNode
}

export function TimelineItem({
  time,
  title,
  description,
  active,
  icon,
  iconBg,
  children,
}: TimelineItemProps) {
  const bgClass = iconBg ? `bg-${iconBg}-lt` : active ? 'bg-primary-lt' : undefined

  return (
    <li className="timeline-event">
      <div className={clsx('timeline-event-icon', bgClass)}>
        {icon ? (
          <Icon icon={icon} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          </svg>
        )}
      </div>
      <div className="card timeline-event-card">
        <div className="card-body">
          <div className="text-secondary float-end">{time}</div>
          <h4>{title}</h4>
          {description && <p className="text-secondary">{description}</p>}
          {children}
        </div>
      </div>
    </li>
  )
}

export interface TimelineProps {
  children: ReactNode
  className?: string
  simple?: boolean
}

export function Timeline({ children, className, simple }: TimelineProps) {
  const classes = clsx('timeline', simple && 'timeline-simple', className)

  return <ul className={classes}>{children}</ul>
}
