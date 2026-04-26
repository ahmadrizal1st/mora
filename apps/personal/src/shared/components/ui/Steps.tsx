import { clsx } from 'clsx'

export interface StepItem {
  label?: string
  href?: string
  tooltip?: string
}

export interface StepsProps {
  count?: number
  active?: number
  items?: StepItem[]
  numbers?: boolean
  color?: string
  size?: string
  showTooltip?: boolean
  showTitle?: boolean
  className?: string
}

export function Steps({
  count = 4,
  active = 3,
  items,
  numbers,
  color,
  size,
  showTooltip,
  showTitle,
  className,
}: StepsProps) {
  const stepsClass = clsx(
    'steps',
    numbers && 'steps-counter',
    color && `steps-${color}`,
    size && `steps-${size}`,
    className
  )

  const total = items ? items.length : count

  return (
    <div className={stepsClass}>
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1
        const isActive = step === active
        const item = items?.[i]
        const isClickable = step <= active

        const linkClass = clsx('step-item', isActive && 'active')
        const tooltipProps = showTooltip
          ? { 'data-bs-toggle': 'tooltip', title: item?.tooltip ?? `Step ${step} description` }
          : {}

        if (isClickable) {
          return (
            <a
              key={step}
              href={item?.href ?? '#'}
              className={linkClass}
              {...tooltipProps}
            >
              {showTitle && (item?.label ?? `Step ${step}`)}
            </a>
          )
        }

        return (
          <span key={step} className={linkClass} {...tooltipProps}>
            {showTitle && (item?.label ?? `Step ${step}`)}
          </span>
        )
      })}
    </div>
  )
}
