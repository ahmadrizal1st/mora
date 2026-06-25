import { Chart } from '@/shared/components/ui/Chart'
import { Icon } from '@/shared/components/ui/Icon'
import { useBudgets } from '../../hooks/usePlanning'

export function BudgetDistributionChart() {
  const { data: budgetData } = useBudgets()
  const totalBudget = budgetData?.totalBudget || 0

  const colors = ['#4E5D78', '#7c6fff', '#FF8A65', '#E24B4A', '#4FC3F7', '#D4E157']

  const chartData = {
    type: 'donut' as const,
    height: 18,
    series: [
      { name: 'Other', data: [totalBudget * 0.2], color: colors[0] },
      { name: 'Bills', data: [totalBudget * 0.25], color: colors[1] },
      { name: 'Entertainment', data: [totalBudget * 0.15], color: colors[2] },
      { name: 'Health', data: [totalBudget * 0.1], color: colors[3] },
      { name: 'Education', data: [totalBudget * 0.2], color: colors[4] },
      { name: 'Clothes', data: [totalBudget * 0.1], color: colors[5] },
    ],
    extend: {
      stroke: {
        show: true,
        width: 6,
        colors: ['var(--tblr-bg-surface)'],
      },
      legend: {
        show: true,
        position: 'right',
        fontSize: '11px',
        fontWeight: 600,
        fontFamily: 'inherit',
        markers: { radius: 4, width: 10, height: 10 },
        itemMargin: { vertical: 4 },
      },
      dataLabels: { enabled: false },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--tblr-secondary)',
                offsetY: -5,
              },
              value: {
                show: true,
                fontSize: '18px',
                fontWeight: 800,
                color: 'var(--tblr-body-color)',
                offsetY: 10,
                formatter: (val: string) =>
                  `${Math.round(Number(val) / 1000).toLocaleString()}.000`,
              },
              total: {
                show: true,
                label: 'Total Budget',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--tblr-secondary)',
                formatter: () => {
                  return 'Rp ' + Math.round(totalBudget / 1000).toLocaleString() + '.000'
                },
              },
            },
          },
        },
      },
    },
  }

  return (
    <div className="card shadow-sm border-0" style={{ borderRadius: '16px' }}>
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h4
            className="fw-bold m-0 text-secondary text-uppercase small"
            style={{ letterSpacing: '0.025em' }}
          >
            Allocation
          </h4>
          <span className="badge bg-secondary-lt text-secondary border-0">100% Total</span>
        </div>
        <div className="flex-fill d-flex align-items-center justify-content-center mt-n3">
          <div style={{ width: '100%' }}>
            <Chart chartId="budgetDistributionDonut" chartData={chartData as any} />
          </div>
        </div>
      </div>
    </div>
  )
}
