// src/shared/components/cards/charts/SummaryChartCard.tsx
import { clsx } from 'clsx'
import { Trending } from '../../ui/Trending'
import { Chart } from '../../ui/Chart'
import type { ChartSerie, ChartData } from '../../ui/Chart'

interface SummaryChartCardProps {
  title?: string
  value?: string
  trendValue?: number
  description?: string
  series?: ChartSerie[]
  categories?: string[]
  type?: ChartData['type']
  chartId?: string
  className?: string
  style?: React.CSSProperties
  actions?: React.ReactNode
}

const DEFAULT_SERIES = [{ name: 'Data', data: [37, 35, 44, 28, 36, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46, 39, 62, 51, 35, 41, 67] }]

export function SummaryChartCard({
  title = 'Summary',
  value = '0',
  trendValue = 0,
  series = DEFAULT_SERIES,
  categories,
  type = 'bar',
  chartId = 'summary-chart',
  className,
  style,
  actions,
}: SummaryChartCardProps) {
  return (
    <div className={clsx('card', className)} style={{ ...style, overflow: 'visible' }}>
      <div className="card-body" style={{ overflow: 'visible' }}>
        <div className="d-flex align-items-center">
          <div className="subheader">{title}</div>
          <div className="ms-auto lh-1">
            {actions}
          </div>
        </div>
        <div className="d-flex align-items-baseline mb-3">
          <div className="h1 me-2">{value}</div>
          <div className="me-auto">
            <Trending value={trendValue} />
          </div>
        </div>
        <Chart
          chartId={chartId}
          chartData={{
            type: type,
            sparkline: true,
            datetime: !categories,
            series: series,
            categories: categories,
            color: "primary"
          }}
          size="sm"
        />
      </div>
    </div>
  )
}
