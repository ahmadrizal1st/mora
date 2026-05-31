import { Chart } from '@/shared/components/ui/Chart'

export function SubscriptionDistributionChart() {
  const chartData = {
    type: 'donut' as const,
    height: 16,
    series: [
      { name: 'Streaming', data: [450000], color: 'warning' },
      { name: 'Utilities', data: [350000], color: 'primary' },
      { name: 'Music', data: [55000], color: 'success' },
      { name: 'Cloud', data: [150000], color: 'info' },
    ],
    donutLabel: 'Total',
    donutValue: 'Rp 1jt',
    extend: {
      legend: { position: 'bottom', fontSize: '10px', fontWeight: 600 },
    },
  }

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-4">
        <h4 className="fw-bold text-secondary small text-uppercase mb-4 text-center">
          Cost Distribution
        </h4>
        <div className="mb-2">
          <Chart chartId="subsDonut" chartData={chartData as any} />
        </div>
      </div>
    </div>
  )
}
