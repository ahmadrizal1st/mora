// src/components/cards/SmallStats.tsx
import { useId } from 'react'
import { Avatar } from '../ui/Avatar'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'
import { Trending } from '../ui/Trending'
import { ChartSparkline } from '../ui/ChartSparkline'

interface Person {
  id?: number
  full_name?: string
  photo?: string
  job_title?: string
}

interface SmallStatsProps {
  id?: string
  // Layout
  lt?: boolean
  chartPosition?: 'left' | 'right'
  // Chart
  chartType?: 'line' | 'bar' | 'donut'
  chartData?: string
  // Icon
  icon?: string
  smallIcon?: string
  color?: string
  // Content
  title?: string
  description?: string
  descriptionValue?: string
  descriptionValueColor?: string
  trending?: number
  button?: string
  // Person
  person?: Person
  className?: string
}

export function SmallStats({
  id,
  lt,
  chartPosition = 'right',
  chartType = 'line',
  chartData,
  icon,
  smallIcon,
  color = 'primary',
  title = '1700',
  description = 'Users',
  descriptionValue,
  descriptionValueColor = 'green',
  trending,
  button,
  person,
  className,
}: SmallStatsProps) {
  const generatedId = useId()
  const resolvedChartId = id || `chart-${generatedId.replace(/:/g, '')}`
  const showChartLeft = chartData && chartPosition === 'left'
  const showChartRight = chartData && chartPosition === 'right'
  const hasPerson = !!person

  const cardClass = [
    'card',
    'card-sm',
    className,
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClass}>
      <div className="card-body">
        <div className="row align-items-center">
          {icon ? (
            <div className="col-auto">
              <span className={`avatar avatar-square ${color ? `bg-${color}${lt ? '-lt' : ' text-white'}` : ''}`}>
                <Icon icon={icon} />
              </span>
            </div>
          ) : hasPerson ? (
            <div className="col-auto">
              <Avatar person={person} />
            </div>
          ) : showChartLeft ? (
            <div className="col-auto">
              <ChartSparkline
                id={resolvedChartId}
                type={chartType}
                color={color}
                data={chartData ? chartData.split(',').map(n => parseFloat(n.trim())) : []}
                height={2.5}
                small={true}
              />
            </div>
          ) : null}

          {/* Middle: text content */}
          <div className="col">
            <div className="fw-medium">
              {title}
              {smallIcon && (
                <Icon icon={smallIcon} color={color} className="icon-sm ms-1" />
              )}
              {descriptionValue && (
                <span className={`float-end fw-medium text-${descriptionValueColor}`}>
                  {descriptionValue}
                </span>
              )}
            </div>
            <div className="text-secondary">
              {description}
            </div>
          </div>

          {/* Right: chart OR trending OR button */}
          {showChartRight && (
            <div className="col-auto">
              <ChartSparkline
                id={resolvedChartId}
                type={chartType}
                color={color}
                data={chartData ? chartData.split(',').map(n => parseFloat(n.trim())) : []}
                height={2.5}
                small={true}
              />
            </div>
          )}

          {trending !== undefined && (
            <div className="col-auto">
              <Trending value={trending} />
            </div>
          )}

          {button && (
            <div className="col-auto">
              <Button text={button} size="sm" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}