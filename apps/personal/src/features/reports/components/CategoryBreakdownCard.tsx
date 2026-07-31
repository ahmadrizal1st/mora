import { useMemo } from 'react'
import { Chart } from '@/shared/components/ui/Chart'
import { useTransactions } from '@/features/transaction/hooks/useTransactions'

interface CategoryBreakdownCardProps {
  title?: string
  dateFrom?: string
  dateTo?: string
  type?: 'expense' | 'income'
}

export function CategoryBreakdownCard({ title = 'Kategori', type = 'expense', dateFrom, dateTo }: CategoryBreakdownCardProps) {
  const isAccount = title === 'Dompet'
  
  const { data: txData, isLoading } = useTransactions({
    type,
    date_from: dateFrom,
    date_to: dateTo,
    per_page: 500,
  })

  const data = useMemo(() => {
    if (!txData?.data) return []
    const summary: Record<string, { name: string; value: number; color: string }> = {}

    txData.data.forEach(tx => {
      const key = isAccount ? tx.account_id : tx.category_id
      if (!key) return
      
      if (!summary[key]) {
        const item = isAccount ? tx.account : tx.category
        summary[key] = {
          name: item?.name || 'Lainnya',
          value: 0,
          color: item?.color || '#cbd5e1'
        }
      }
      summary[key].value += tx.amount
    })

    const sorted = Object.values(summary).sort((a, b) => b.value - a.value)
    return sorted
  }, [txData, isAccount])
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

        <div className="d-flex align-items-center gap-3" style={{ minHeight: '150px' }}>
          {isLoading ? (
            <div className="w-100 d-flex justify-content-center align-items-center">
              <div className="spinner-border spinner-border-sm text-secondary" />
            </div>
          ) : data.length === 0 ? (
            <div className="w-100 text-center text-muted" style={{ fontSize: '13px' }}>
              Belum ada transaksi
            </div>
          ) : (
            <>
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
          <div className="flex-grow-1 d-flex flex-column pe-1 custom-scrollbar" style={{ gap: '8px', maxHeight: '150px', overflowY: 'auto' }}>
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
                        className="text-truncate text-secondary"
                        style={{ fontSize: '12px', fontWeight: 500, maxWidth: '90px' }}
                      >
                        {item.name}
                      </span>
                    </div>
                    <div className="d-flex align-items-baseline gap-1 flex-shrink-0">
                      <span className="text-body" style={{ fontSize: '12px', fontWeight: 700 }}>
                        {fmt(item.value)}
                      </span>
                      <span className="text-muted" style={{ fontSize: '10px' }}>{pctDisplay}%</span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div style={{ height: '3px', backgroundColor: 'var(--tblr-border-color)', borderRadius: '99px' }}>
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
