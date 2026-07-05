import { useMemo, useState } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import { Chart } from '@/shared/components/ui/Chart'
import { useCredits } from '../hooks/useCredits'

const COLORS = ['#206bc4', '#4299e1', '#2fb344', '#f76707', '#f59f00', '#d63939']

export function CreditStrategyChart() {
  const { data: credits = [], isLoading } = useCredits()
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([])

  const { chartData, legendData, debtFreeDate, totalMonths } = useMemo(() => {
    const validCredits = credits.filter(c => c.credit && c.credit.total_amount > 0)
    
    if (validCredits.length === 0) {
      return { chartData: null, legendData: [], debtFreeDate: null, totalMonths: 0 }
    }

    // State array for simulation
    const debts = validCredits.map((c, i) => ({
      name: c.name,
      balance: c.credit!.total_amount,
      initialBalance: c.credit!.total_amount,
      rate: c.credit!.interest_rate || 0,
      payment: c.credit!.installment_amount || c.credit!.minimum_payment || (c.credit!.total_amount * 0.1), // fallback to 10%
      color: COLORS[i % COLORS.length],
      history: [] as number[]
    }))

    const maxMonths = 120 // simulate up to 10 years
    let currentMonth = 0
    let allPaid = false

    // Initial state (Month 0)
    debts.forEach(d => d.history.push(d.balance))

    while (!allPaid && currentMonth < maxMonths) {
      currentMonth++
      let remainingTotal = 0

      debts.forEach(d => {
        if (d.balance > 0) {
          // Add monthly interest
          const interest = d.balance * (d.rate / 100 / 12)
          d.balance += interest
          
          // Subtract payment
          d.balance -= d.payment
          if (d.balance < 0) d.balance = 0
        }
        remainingTotal += d.balance
        d.history.push(d.balance)
      })

      if (remainingTotal === 0) {
        allPaid = true
      }
    }

    const series = debts
      .filter(d => !hiddenSeries.includes(d.name))
      .map(d => ({
        name: d.name,
        data: d.history,
        color: d.color
      }))

    const now = new Date()
    const freeDate = new Date(now.getFullYear(), now.getMonth() + currentMonth, 1)

    const chartData = {
      type: 'line' as const,
      height: 22, // roughly 350px
      series,
      datetime: true,
      startDate: now.toISOString(),
      extend: {
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' as const, width: 2 },
        fill: { type: 'solid', opacity: 1 },
        xaxis: {
          type: 'datetime',
          tooltip: { enabled: false },
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: {
            style: { colors: '#94a3b8', fontSize: '11px' }
          }
        },
        yaxis: {
          show: false, // Hide Y-axis labels like in the screenshot, rely on tooltips
          min: 0,
        },
        grid: {
          show: true,
          borderColor: '#f1f5f9',
          strokeDashArray: 4,
          padding: { top: 0, right: 0, bottom: 0, left: 10 }
        },
        legend: { show: false }, // We build a custom legend on the right
        tooltip: {
          shared: true,
          intersect: false,
          x: { format: 'MMM yyyy' },
          y: {
            formatter: (val: number) => formatCurrency(Math.round(val))
          }
        },
        colors: debts.map(d => d.color)
      }
    }

    return {
      chartData,
      legendData: debts.map(d => ({
        name: d.name,
        color: d.color,
        balance: d.initialBalance
      })),
      debtFreeDate: freeDate,
      totalMonths: currentMonth
    }
  }, [credits, hiddenSeries])

  if (isLoading) return null

  const formatter = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' })
  const dateStr = debtFreeDate ? formatter.format(debtFreeDate) : '-'

  const fmt = (val: number) => formatCurrency(val).replace('Rp', '').trim()

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden d-none d-lg-block">
      <div className="row g-0">
        <div className={chartData ? "col-12 col-lg-8 col-xl-9 p-4 pe-lg-0 d-flex flex-column" : "col-12 p-4 d-flex flex-column"}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="card-title fw-bold text-dark mb-0" style={{ fontSize: '15px' }}>
              Proyeksi Pelunasan
            </h3>
            {totalMonths > 0 && totalMonths < 120 ? (
              <div className="text-end d-lg-none">
                 <div className="text-muted small">Target Lunas</div>
                 <div className="fw-bold text-dark">{dateStr}</div>
              </div>
            ) : null}
          </div>

          {!chartData ? (
            <div className="text-center py-5 d-flex flex-column justify-content-center align-items-center flex-grow-1 my-3 w-100">
              <Icon icon="chart-line" size={32} stroke={1.5} className="text-secondary opacity-50 mb-3" />
              <div className="fw-bold text-body mb-1" style={{ fontSize: '14px' }}>Belum Ada Proyeksi</div>
              <div className="text-secondary" style={{ fontSize: '12px', lineHeight: '1.5' }}>Tambahkan kredit untuk melihat proyeksi pelunasan.</div>
            </div>
          ) : (
            <div className="flex-grow-1 position-relative" style={{ minHeight: '300px' }}>
              <Chart
                key="credit-strategy-chart"
                chartId="credit-strategy-chart"
                chartData={chartData} />
            </div>
          )}
        </div>

        {/* Right Side: Info / Legend */}
        {chartData && (
          <div className="col-12 col-lg-4 col-xl-3 bg-light border-start border-light d-flex flex-column p-4">
            <h4 className="fw-bold text-dark mb-4" style={{ fontSize: '14px' }}>Rincian Strategi</h4>
            
            <div className="mb-4">
              <div className="text-secondary small mb-1">Total Utang & Beban</div>
              <div className="fw-bold text-dark" style={{ fontSize: '18px' }}>
                Rp {fmt(totalMonths > 0 ? (legendData.reduce((s, d) => s + d.balance, 0)) : 0)}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-secondary small mb-1">Estimasi Bebas Utang</div>
              <div className="fw-bold text-primary" style={{ fontSize: '18px' }}>
                {dateStr}
              </div>
            </div>

            <div className="flex-grow-1 overflow-y-auto pe-2 scrollbar-hide hide-scrollbar">
              <div className="d-flex flex-column gap-3">
                {legendData.map(ld => {
                  return (
                    <div key={ld.name} className="d-flex align-items-center gap-2">
                      <span
                        className="rounded-circle flex-shrink-0"
                        style={{ width: '8px', height: '8px', backgroundColor: ld.color }}
                      />
                      <div className="flex-grow-1 min-w-0">
                        <div className="text-truncate fw-medium text-dark" style={{ fontSize: '12px' }}>
                          {ld.name}
                        </div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          Rp {fmt(ld.balance)} sisa
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
