// src/components/cards/StatCard.tsx
import { Icon } from '../ui/Icon'
import { Trending } from '../ui/Trending'

interface StatCardProps {
  title?: string
  value?: string | number
  icon?: string
  iconColor?: string
  trendValue?: number
  description?: string
  className?: string
}

export function StatCard({
  title = 'Statistic',
  value = '0',
  icon,
  iconColor,
  trendValue,
  description,
  className,
}: StatCardProps) {
  return (
    <div className={`card${className ? ` ${className}` : ''}`}>
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col">
            <h4 className="subheader mb-1">{title}</h4>
            <div className="h3 m-0">{value}</div>
            {description && <div className="text-secondary mt-1">{description}</div>}
          </div>
          <div className="col-auto">
            {icon && (
              <span className={`avatar avatar-lg ${iconColor ? `bg-${iconColor}-lt` : ''}`}>
                <Icon icon={icon} color={iconColor} />
              </span>
            )}
          </div>
        </div>
        {trendValue !== undefined && (
          <div className="mt-3 d-flex align-items-baseline">
            <div className="me-auto">
              <Trending value={trendValue} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}