// src/components/cards/charts/ActiveUsersCard.tsx
import { Trending } from '../../ui/Trending'
import { Chart } from '../../ui/Chart'
import type { ChartSerie, ChartData } from '../../ui/Chart'
import { DropdownDays } from '../../ui/DropdownDays'

interface ActiveUsersCardProps {
  title?: string
  value?: string
  trendValue?: number
  description?: string
  series?: ChartSerie[]
  type?: ChartData['type']
  chartId?: string
}

const DEFAULT_SERIES = [{ name: 'Profits', data: [37, 35, 44, 28, 36, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46, 39, 62, 51, 35, 41, 67] }]

export function ActiveUsersCard2({ 
  title = 'Active Users',
  value = '25,782', 
  trendValue = -1,
  series = [{ name: 'Active', data: [78], color: 'primary' }],
  type = 'radialBar',
  chartId = 'active-users-2'
}: ActiveUsersCardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="subheader">{title}</div>
        <div className="d-flex align-items-baseline mb-2">
          <div className="h1 mb-0 me-2">{value}</div>
          <div className="me-auto">
            <Trending value={trendValue} />
          </div>
        </div>
        <Chart
          chartId={chartId}
          chartData={{
            type: type,
            sparkline: true,
            lineCap: 'butt',
            series: series
          }}
          height={14}
        />
      </div>
    </div>
  )
}

export function ActiveUsersCard({ 
  title = 'Active subscriptions',
  value = '2,986', 
  trendValue = 4,
  series = DEFAULT_SERIES,
  type = 'bar',
  chartId = 'active-users'
}: ActiveUsersCardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className="subheader">{title}</div>
          <div className="ms-auto lh-1">
            <DropdownDays id={chartId} label={`Select time range for ${title}`} />
          </div>
        </div>
        <div className="d-flex align-items-baseline">
          <div className="h1 mb-3 me-2">{value}</div>
          <div className="me-auto">
            <Trending value={trendValue} />
          </div>
        </div>
        <Chart
          chartId={chartId}
          chartData={{
            type: type,
            sparkline: true,
            datetime: true,
            series: series,
            color: "primary"
          }}
          size="sm"
        />
      </div>
    </div>
  )
}