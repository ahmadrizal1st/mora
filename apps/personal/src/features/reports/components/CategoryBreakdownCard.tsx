import { Chart } from '@/shared/components/ui/Chart'

interface CategoryBreakdownCardProps {
  title?: string
  dateFrom?: string
  dateTo?: string
  type?: 'expense' | 'income'
}

const ACCOUNT_DATA = {
  expense: [
    { name: 'GoPay', value: 1850000, color: '#00AED6' },
    { name: 'BCA', value: 960000, color: '#0066AE' },
    { name: 'Cash', value: 320000, color: '#6c757d' },
  ],
  income: [
    { name: 'BCA', value: 5200000, color: '#0066AE' },
    { name: 'GoPay', value: 800000, color: '#00AED6' },
  ],
}

const CATEGORY_DATA = {
  expense: [
    { name: 'Makanan & Minuman', value: 1200000, color: '#ef4444' },
    { name: 'Transportasi', value: 750000, color: '#f59e0b' },
    { name: 'Tagihan', value: 650000, color: '#3b82f6' },
    { name: 'Belanja', value: 400000, color: '#8b5cf6' },
    { name: 'Lainnya', value: 130000, color: '#64748b' },
  ],
  income: [
    { name: 'Gaji', value: 5000000, color: '#22c55e' },
    { name: 'Freelance', value: 1000000, color: '#3b82f6' },
  ],
}

export function CategoryBreakdownCard({ title = 'Kategori', type = 'expense' }: CategoryBreakdownCardProps) {
  const isAccount = title === 'Dompet'
  const data = isAccount ? ACCOUNT_DATA[type] : CATEGORY_DATA[type]
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const fmt = (val: number) => val.toLocaleString('id-ID')
  const fmtShort = (val: number): string => {
    if (val >= 1_000_000_000_000) return (val / 1_000_000_000_000).toFixed(1).replace('.', ',') + 'T'
    if (val >= 1_000_000_000) return (val / 1_000_000_000).toFixed(1).replace('.', ',') + 'M'
    if (val >= 1_000_000) return (val / 1_000_000).toFixed(1).replace('.', ',') + 'JT'
    if (val >= 1_000) return (val / 1_000).toFixed(0) + 'K'
    return val.toString()
  }

  const chartId = `report-donut-${title.toLowerCase()}-${type}`

  return (
    <div className="card shadow-sm border-0 rounded-4 h-100">
      <div className="card-body p-4">
        {/* Header */}
        <div
          className="fw-bold mb-3"
          style={{ fontSize: '11px', letterSpacing: '1px', color: '#94a3b8', textTransform: 'uppercase' }}
        >
          {title}
        </div>

        <div className="d-flex align-items-center gap-3">
          {/* Donut Chart */}
          <div style={{ width: '150px', flexShrink: 0 }}>
            <Chart
              key={chartId}
              chartId={chartId}
              chartData={{
                type: 'donut',
                height: 18,
                series: data.map(d => ({ name: d.name, data: [d.value], color: d.color })),
                legend: false,
                datalabels: false,
                donutLabel: 'Total',
                donutValue: fmtShort(total),
                extend: {
                  stroke: { width: 2, colors: ['#fff'] },
                },
              }}
            />
          </div>

          {/* Legend Items */}
          <div className="flex-grow-1 d-flex flex-column" style={{ gap: '8px' }}>
            {data.map((item) => {
              const pct = total > 0 ? ((item.value / total) * 100) : 0
              const pctDisplay = pct.toFixed(1)
              return (
                <div key={item.name}>
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <div className="d-flex align-items-center gap-2 overflow-hidden">
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '2px',
                          backgroundColor: item.color,
                          flexShrink: 0,
                          display: 'inline-block',
                        }}
                      />
                      <span
                        className="text-truncate"
                        style={{ fontSize: '12px', color: '#475569', fontWeight: 500, maxWidth: '90px' }}
                      >
                        {item.name}
                      </span>
                    </div>
                    <div className="d-flex align-items-baseline gap-1 flex-shrink-0">
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>
                        {fmt(item.value)}
                      </span>
                      <span style={{ fontSize: '10px', color: '#94a3b8' }}>{pctDisplay}%</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: '3px', backgroundColor: '#f1f5f9', borderRadius: '99px' }}>
                    <div
                      style={{
                        height: '3px',
                        width: `${pct}%`,
                        backgroundColor: item.color,
                        borderRadius: '99px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
