import { useMemo } from 'react'
import { Chart } from '@/shared/components/ui/Chart'
import { Icon } from '@/shared/components/ui/Icon'
import { useCredits } from '../hooks/useCredits'

const fmt = (val: number) => val.toLocaleString('id-ID')
const fmtShort = (val: number): string => {
  if (val >= 1_000_000_000_000) return (val / 1_000_000_000_000).toFixed(1).replace('.', ',') + 'T'
  if (val >= 1_000_000_000) return (val / 1_000_000_000).toFixed(1).replace('.', ',') + 'M'
  if (val >= 1_000_000) return (val / 1_000_000).toFixed(1).replace('.', ',') + 'JT'
  if (val >= 1_000) return (val / 1_000).toFixed(0) + 'K'
  return val.toString()
}

interface BreakdownItem {
  name: string
  value: number
  color: string
}

function CreditDonutBreakdown({ title, data }: { title: string; data: BreakdownItem[] }) {
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const chartId = `credit-donut-${title.toLowerCase().replace(/\s+/g, '-')}`

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

        {data.length === 0 ? (
          <div className="text-center py-5 d-flex flex-column justify-content-center align-items-center flex-grow-1 w-100">
            <Icon icon="chart-donut-3" size={32} stroke={1.5} className="text-secondary opacity-50 mb-3" />
            <div className="fw-bold text-body mb-1" style={{ fontSize: '14px' }}>Belum Ada Komposisi</div>
            <div className="text-secondary" style={{ fontSize: '12px', lineHeight: '1.5' }}>Tambahkan profil kredit Anda.</div>
          </div>
        ) : (
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
                  }
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
        )}
      </div>
    </div>
  )
}

export function CreditCompositionChart() {
  const { data: credits = [], isLoading } = useCredits()

  const { hutangData, bebanData } = useMemo(() => {
    let ktaH = 0, kprH = 0, ccH = 0, plH = 0
    let ktaB = 0, kprB = 0, ccB = 0, plB = 0

    credits.forEach((c) => {
      const hutang = c.credit?.total_amount || 0
      const beban = c.credit?.installment_amount || 0
      const type = c.credit?.credit_type || ''
      if (type === 'kta') { ktaH += hutang; ktaB += beban }
      else if (type === 'kpr') { kprH += hutang; kprB += beban }
      else if (type === 'credit_card') { ccH += hutang; ccB += beban }
      else if (type === 'paylater') { plH += hutang; plB += beban }
    })

    const buildData = (kta: number, kpr: number, cc: number, pl: number) => {
      const arr = []
      if (kta > 0) arr.push({ name: 'Pinjaman Tunai', value: kta, color: '#0066AE' }) // blue
      if (kpr > 0) arr.push({ name: 'Cicilan Rumah', value: kpr, color: '#f59e0b' }) // amber
      if (cc > 0) arr.push({ name: 'Kartu Kredit', value: cc, color: '#00AED6' }) // cyan
      if (pl > 0) arr.push({ name: 'Paylater', value: pl, color: '#22c55e' }) // green
      return arr.sort((a, b) => b.value - a.value) // Sort descending
    }

    return {
      hutangData: buildData(ktaH, kprH, ccH, plH),
      bebanData: buildData(ktaB, kprB, ccB, plB),
    }
  }, [credits])

  if (isLoading) return null

  return (
    <div className="d-flex flex-column flex-lg-row gap-3">
      <div className="flex-fill" style={{ minWidth: 0, flex: 1 }}>
        <CreditDonutBreakdown title="KOMPOSISI HUTANG" data={hutangData} />
      </div>
      <div className="flex-fill" style={{ minWidth: 0, flex: 1 }}>
        <CreditDonutBreakdown title="BEBAN BULANAN" data={bebanData} />
      </div>
    </div>
  )
}
