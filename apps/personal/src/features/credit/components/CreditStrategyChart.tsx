import { useMemo, useState } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
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
            formatter: (val: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(Math.round(val))
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

  if (isLoading || !chartData) return null

  const formatter = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' })
  const dateStr = debtFreeDate ? formatter.format(debtFreeDate) : '-'

  const fmt = (val: number) => new Intl.NumberFormat('id-ID').format(val)

  return (
    <div className="card border-0 shadow-sm rounded-4 overflow-hidden d-none d-lg-block">
      <div className="row g-0">
        {/* Left Side: Chart */}
        <div className="col-12 col-lg-8 col-xl-9 p-4 pe-lg-0 d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="card-title fw-bold text-dark mb-0" style={{ fontSize: '15px' }}>
              Proyeksi Pelunasan
            </h3>
            {totalMonths < 120 ? (
              <div className="text-end d-lg-none">
                 <div className="text-muted small">Target Lunas</div>
                 <div className="fw-bold text-dark">{dateStr}</div>
              </div>
            ) : null}
          </div>
          
          <div className="flex-grow-1 d-flex flex-column justify-content-end" style={{ marginLeft: '-10px', minHeight: '300px' }}>
            <Chart chartId="credit-strategy-projection" chartData={chartData} />
          </div>
        </div>

        {/* Right Side: Custom Legends (matches the screenshot) */}
        <div 
          className="col-12 col-lg-4 col-xl-3 border-start-lg bg-body-tertiary bg-opacity-50 d-none d-lg-flex flex-column" 
          style={{ maxHeight: '450px' }}
        >
          <div className="p-4 pb-3 border-bottom flex-shrink-0 d-none d-lg-block">
            <div className="d-flex align-items-center justify-content-between">
              <div className="text-muted" style={{ fontSize: '12px' }}>Target Lunas</div>
              <div className="fw-bold text-dark" style={{ fontSize: '13px' }}>
                {totalMonths < 120 ? dateStr : '> 10 Tahun'}
              </div>
            </div>
          </div>

          <div className="p-3 flex-grow-1 overflow-auto" style={{ scrollbarWidth: 'thin' }}>
            <div className="text-muted small mb-2 d-lg-none">Klik pada legenda untuk menyembunyikan/menampilkan grafik</div>
            <div className="d-flex flex-column gap-2">
              {legendData.map((leg, idx) => {
                const isHidden = hiddenSeries.includes(leg.name)
                return (
                  <div 
                    key={idx} 
                    className={idx !== legendData.length - 1 ? "border-bottom pb-2 cursor-pointer" : "cursor-pointer"}
                    onClick={() => {
                      setHiddenSeries(prev => 
                        prev.includes(leg.name) 
                          ? prev.filter(n => n !== leg.name) 
                          : [...prev, leg.name]
                      )
                    }}
                    style={{ opacity: isHidden ? 0.4 : 1, transition: 'opacity 0.2s' }}
                  >
                    <div className="d-flex align-items-center gap-2 mb-0">
                      <span 
                        className="rounded-circle" 
                        style={{ width: '8px', height: '8px', backgroundColor: isHidden ? '#cbd5e1' : leg.color, flexShrink: 0 }} 
                      />
                      <span className="text-muted fw-medium text-truncate" style={{ fontSize: '11px' }}>
                        {leg.name}
                      </span>
                    </div>
                    <div className="fw-bold text-dark mt-1" style={{ fontSize: '14px', paddingLeft: '16px' }}>
                      {fmt(leg.balance)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
