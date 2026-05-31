import { clsx } from 'clsx'
import { Trending, Chart } from '../../ui'
import type { ChartSerie, ChartData } from '../../ui/Chart'

interface ComparisonChartCardProps {
  title?: string
  value?: string
  trendValue?: number
  conversionRateLabel?: string
  progressValue?: number
  progressColor?: string
  dropdownId?: string
  series?: ChartSerie[]
  categories?: string[]
  type?: ChartData['type']
  chartId?: string
  className?: string
  style?: React.CSSProperties
  actions?: React.ReactNode
}

export function ComparisonChartCard({
  title = 'Comparison',
  value = '0',
  trendValue = 0,
  series,
  categories,
  chartId = 'comparison-chart',
  className,
  style,
  actions,
}: ComparisonChartCardProps) {
  return (
    <div className={clsx('card', className)} style={{ ...style, overflow: 'visible' }}>
      <div className="card-body" style={{ overflow: 'visible' }}>
        <div className="d-flex align-items-center">
          <div className="subheader">{title}</div>
          <div className="ms-auto lh-1">{actions}</div>
        </div>
        <div className="d-flex align-items-baseline mt-3">
          <div className="h1 mb-2 me-2">{value}</div>
          <div className="me-auto">
            <Trending value={trendValue} />
          </div>
        </div>

        {series && (
          <Chart
            chartId={chartId}
            chartData={{
              type: 'line',
              sparkline: true,
              stacked: false,
              datetime: !categories,
              series: series,
              categories: categories,
              strokeWidth: [2, 2],
              strokeDash: [0, 5],
            }}
            size="sm"
            className="mb-1"
          />
        )}
      </div>
    </div>
  )
}
