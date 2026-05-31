import { Chart } from '@/shared/components/ui/Chart'
import chartsData from '@/shared/data/charts.json'
import { Icon } from '@/shared/components/ui/Icon'
import { formatCurrency } from '@/shared/utils/currencyUtils'

interface NetWorthGrowthCardProps {
  currentNetWorth: number
}

export function NetWorthGrowthCard({ currentNetWorth }: NetWorthGrowthCardProps) {
  const cashflowData = (chartsData as Record<string, unknown>)['visual-cashflow'] as Record<
    string,
    unknown
  >

  const customGrowthData = {
    ...cashflowData,
    type: 'area',
    sparkline: true,
    height: 8,
    strokeWidth: [2],
    series: [
      {
        name: 'Growth',
        color: 'primary',
        data: [
          10, 12, 11, 12, 15, 12, 11, 10, 14, 18, 14, 16, 12, 14, 45, 25, 10, 18, 12, 10, 12, 10,
          25, 60, 30, 25, 22, 20, 35, 40, 52, 55, 65, 70, 75, 95, 100, 110, 105, 95, 88, 105, 130,
          145,
        ],
      },
    ],
  }

  return (
    <div className="card shadow-sm border-0 h-100 overflow-hidden">
      <div className="card-body p-0 d-flex flex-column h-100">
        <div className="p-4 pb-0">
          <div className="text-secondary mb-3" style={{ fontSize: '1rem' }}>
            Tren Arus Kas
          </div>

          <div className="d-flex align-items-center mb-4">
            <div className="me-3 d-flex align-items-center justify-content-center">
              <svg width="42" height="42" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--tblr-border-color, #e6e8e9)"
                  strokeWidth="3"
                />
                <path
                  strokeDasharray="100, 100"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--tblr-primary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div>
              <div className="fw-medium text-dark mb-1">
                Total Pemasukan Bulan Ini: {formatCurrency(currentNetWorth)}
              </div>
              <div className="text-muted small d-flex align-items-center gap-1">
                <span className="text-success fw-bold d-flex align-items-center gap-1">
                  <Icon icon="trending-up" size="xs" /> Naik
                </span>
                Tren Keuangan Bulanan
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto">
          <Chart chartId="visual-asset-growth" chartData={customGrowthData as any} />
        </div>
      </div>
    </div>
  )
}
