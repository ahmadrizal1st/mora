import { clsx } from 'clsx'
import { Trending, Progress, DropdownDays } from '../../ui'

interface SalesCardProps {
  title?: string
  value?: string
  trendValue?: number
  conversionRateLabel?: string
  progressValue?: number
  progressColor?: string
  dropdownId?: string
  className?: string
  style?: React.CSSProperties
}

export function SalesCard({
  title = 'Sales',
  value = '75%',
  trendValue = 7,
  conversionRateLabel = 'Conversion rate',
  progressValue = 75,
  progressColor = 'primary',
  dropdownId = 'sales',
  className,
  style,
}: SalesCardProps) {
  return (
    <div className={clsx('card', className)} style={style}>
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className="subheader">{title}</div>
          <div className="ms-auto lh-1">
            <DropdownDays id={dropdownId} label={`Select time range for ${title.toLowerCase()} data`} />
          </div>
        </div>
        <div className="h1 mb-3">{value}</div>
        <div className="d-flex mb-2">
          <div>{conversionRateLabel}</div>
          <div className="ms-auto">
            <Trending value={trendValue} />
          </div>
        </div>
        <Progress value={progressValue} color={progressColor} size="sm" />
      </div>
    </div>
  )
}