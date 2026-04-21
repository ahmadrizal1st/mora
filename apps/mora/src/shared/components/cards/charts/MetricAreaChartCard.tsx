// src/shared/components/cards/charts/MetricAreaChartCard.tsx
import { clsx } from 'clsx'
import { Trending } from '../../ui/Trending'
import { Chart } from '../../ui/Chart'
import type { ChartSerie } from '../../ui/Chart'

interface MetricAreaChartCardProps {
  title?: string
  value?: string
  trendValue?: number
  series?: ChartSerie[]
  categories?: string[]
  color?: string
  chartId?: string
  className?: string
  style?: React.CSSProperties
  actions?: React.ReactNode
}

const DEFAULT_SERIES = [{ name: 'Data', data: [37, 35, 44, 28, 36, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46, 39, 62, 51, 35, 41, 67] }]

export function MetricAreaChartCard({
  title = 'Metric',
  value = '0',
  trendValue = 0,
  series = DEFAULT_SERIES,
  categories,
  color = 'primary',
  chartId = 'metric-area-bg',
  className,
  style,
  actions,
}: MetricAreaChartCardProps) {
  return (
    <div className={clsx('card', className)} style={{ ...style, overflow: 'visible' }}>
      <div className="card-body" style={{ overflow: 'visible' }}>
        <div className="d-flex align-items-center">
          <div className="subheader">{title}</div>
          <div className="ms-auto lh-1">
            {actions}
          </div>
        </div>
        <div className="d-flex align-items-baseline">
          <div className="h1 mb-0 me-2">{value}</div>
          <div className="me-auto">
            <Trending value={trendValue} />
          </div>
        </div>
      </div>
      <Chart
        chartId={chartId}
        chartData={{
          type: "area",
          sparkline: true,
          datetime: !categories,
          series: series,
          categories: categories,
          color: color
        }}
        height={2.5}
        class="card-img-bottom"
      />
    </div>
  )
}
