import { Chart } from '@/shared/components/ui/Chart'
import { formatCurrency } from '@/shared/utils/currencyUtils'

const getSubCategory = (subName: string): string => {
  const name = subName.toLowerCase()
  if (
    name.includes('netflix') ||
    name.includes('spotify') ||
    name.includes('youtube') ||
    name.includes('disney') ||
    name.includes('hbo')
  )
    return 'Hiburan'
  if (
    name.includes('indihome') ||
    name.includes('internet') ||
    name.includes('zoom') ||
    name.includes('slack') ||
    name.includes('canva') ||
    name.includes('figma')
  )
    return 'Kerja'
  if (
    name.includes('pln') ||
    name.includes('token') ||
    name.includes('listrik') ||
    name.includes('air') ||
    name.includes('pdam')
  )
    return 'Lainnya'
  return 'Lainnya'
}

export function SubscriptionDistributionChart({
  subscriptions = []
}: {
  subscriptions?: any[]
}) {
  // Group by categories
  const categoriesMap: Record<string, { amount: number; color: string }> = {
    Hiburan: { amount: 0, color: 'warning' },
    Kerja: { amount: 0, color: 'primary' },
    Edukasi: { amount: 0, color: 'success' },
    Lainnya: { amount: 0, color: 'info' },
  }

  let total = 0
  subscriptions.forEach((sub) => {
    const cat = getSubCategory(sub.name)
    const amount = Number(sub.amount || 0)
    total += amount
    if (categoriesMap[cat]) {
      categoriesMap[cat].amount += amount
    } else {
      categoriesMap['Lainnya'].amount += amount
    }
  })

  const series = Object.entries(categoriesMap)
    .filter(([_, data]) => data.amount > 0)
    .map(([name, data]) => ({
      name,
      data: [data.amount],
      color: data.color
    }))

  const hasData = total > 0

  const chartData = {
    type: 'donut' as const,
    height: 16,
    series: series,
    donutLabel: 'Total',
    donutValue: formatCurrency(total),
    extend: {
      legend: { position: 'bottom', fontSize: '10px', fontWeight: 600 },
    },
  }

  return (
    <div className="card shadow-none border" style={{ borderRadius: '12px' }}>
      <div className="card-body p-3 d-flex flex-column">
        <h4 className="fw-bold text-secondary small text-uppercase mb-4 text-center">
          Cost Distribution
        </h4>
        {hasData ? (
          <div className="mb-2 flex-grow-1 d-flex align-items-center justify-content-center">
            <div className="w-100">
              <Chart chartId="subsDonut" chartData={chartData as any} />
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column align-items-center justify-content-center flex-grow-1 text-secondary py-5">
            <i className="ti ti-credit-card-off fs-1 mb-2 opacity-30"></i>
            <p className="m-0 small text-muted">Belum ada data langganan</p>
          </div>
        )}
      </div>
    </div>
  )
}
