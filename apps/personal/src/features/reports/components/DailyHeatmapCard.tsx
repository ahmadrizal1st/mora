import { useState, useMemo } from 'react'
import { useTransactions } from '@/features/transaction/hooks/useTransactions'
import { Chart } from '@/shared/components/ui/Chart'
import { Icon } from '@/shared/components/ui/Icon'

interface DailyHeatmapCardProps {
  dateFrom?: string
  dateTo?: string
  type?: 'expense' | 'income'
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  // 0=Sun, 1=Mon, ... 6=Sat. We want Mon=0
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

const DAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

function getHeatColor(amount: number, max: number, type: 'expense' | 'income'): string {
  if (amount === 0) return 'transparent'
  const ratio = Math.min(amount / max, 1)
  
  // Base RGB for expense (red) and income (green)
  const rgb = type === 'expense' ? '239,68,68' : '34,197,94'
  
  if (ratio < 0.25) return `rgba(${rgb},0.15)`
  if (ratio < 0.50) return `rgba(${rgb},0.35)`
  if (ratio < 0.75) return `rgba(${rgb},0.65)`
  return `rgba(${rgb},0.90)`
}

function getTextColor(amount: number, max: number): string {
  if (amount === 0) return '#888'
  const ratio = Math.min(amount / max, 1)
  return ratio >= 0.65 ? '#fff' : '#333'
}

export function DailyHeatmapCard({ type = 'expense' }: DailyHeatmapCardProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const [viewType, setViewType] = useState<'list' | 'calendar' | 'chart'>('calendar')
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc')

  const monthStart = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-01`
  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const monthEnd = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`

  const { data: txData, isLoading } = useTransactions({
    type: type,
    date_from: monthStart,
    date_to: monthEnd,
    per_page: 500,
    sort_by: 'tx_date',
    sort_dir: 'asc', // We always fetch asc and aggregate, then sort the aggregated array if needed
  })

  // Aggregate spending per day
  const dailyTotals = useMemo(() => {
    const totals: Record<number, number> = {}
    ;(txData?.data || []).forEach(tx => {
      const day = new Date(tx.tx_date).getDate()
      totals[day] = (totals[day] || 0) + tx.amount
    })
    return totals
  }, [txData])

  const maxAmount = Math.max(...Object.values(dailyTotals), 1)
  const firstOffset = getFirstDayOfMonth(viewYear, viewMonth)

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const formatK = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}Jt`
    if (val >= 1000) return `${Math.round(val / 1000)}K`
    return val.toString()
  }

  const formatCurrency = (val: number) => {
    return val.toLocaleString('id-ID')
  }

  const primaryColor = type === 'expense' ? '#ef4444' : '#22c55e'

  const renderCalendar = () => (
    <div className="bg-surface-secondary rounded-4 p-3 flex-grow-1 d-flex flex-column justify-content-center">
      {/* Month nav */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button
          className="btn btn-icon btn-sm btn-light rounded-circle"
          onClick={prevMonth}
        >
          <Icon icon="chevron-left" size={16} />
        </button>
        <span className="fw-bold" style={{ fontSize: '14px' }}>
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          className="btn btn-icon btn-sm btn-light rounded-circle"
          onClick={nextMonth}
        >
          <Icon icon="chevron-right" size={16} />
        </button>
      </div>

      {/* Day headers */}
      <div className="d-grid mb-1" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
        {DAY_LABELS.map(d => (
          <div key={d} className="text-center text-secondary fw-semibold" style={{ fontSize: '10px' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="d-grid" style={{ gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
        {/* Empty offset cells */}
        {Array.from({ length: firstOffset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const amount = dailyTotals[day] || 0
          const bgColor = getHeatColor(amount, maxAmount, type)
          const color = getTextColor(amount, maxAmount)
          const isToday = viewYear === today.getFullYear() && viewMonth === today.getMonth() && day === today.getDate()

          return (
            <div
              key={day}
              className="rounded-2 d-flex flex-column align-items-center justify-content-center"
              style={{
                height: '40px',
                backgroundColor: bgColor,
                border: isToday ? '2px solid var(--tblr-primary)' : '1px solid transparent',
                cursor: amount > 0 ? 'pointer' : 'default',
                transition: 'opacity 0.15s',
              }}
              title={amount > 0 ? `${day} - ${type === 'expense' ? 'Pengeluaran' : 'Pemasukan'}: Rp ${amount.toLocaleString('id-ID')}` : ''}
            >
              <span style={{ fontSize: '11px', fontWeight: 600, color }}>{day}</span>
              {amount > 0 && (
                <span style={{ fontSize: '8px', color, lineHeight: 1 }}>
                  {type === 'expense' ? '-' : '+'}{formatK(amount)}
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="d-flex justify-content-end align-items-center mt-3 gap-1">
        <span className="text-secondary me-1" style={{ fontSize: '10px' }}>Rendah</span>
        {[0.15, 0.35, 0.65, 0.90].map((op, i) => (
          <div
            key={i}
            className="rounded-1"
            style={{ width: '14px', height: '14px', backgroundColor: type === 'expense' ? `rgba(239,68,68,${op})` : `rgba(34,197,94,${op})` }}
          />
        ))}
        <span className="text-secondary ms-1" style={{ fontSize: '10px' }}>Tinggi</span>
      </div>
    </div>
  )

  const renderList = () => {
    const daysWithData = Object.keys(dailyTotals).map(Number).filter(d => dailyTotals[d] > 0)
    if (sortOrder === 'desc') daysWithData.reverse()

    return (
      <div className="bg-surface-secondary rounded-4 p-0 flex-grow-1 overflow-auto" style={{ maxHeight: '400px' }}>
        {daysWithData.length === 0 ? (
          <div className="text-center text-secondary py-5" style={{ fontSize: '13px' }}>
            Tidak ada {type === 'expense' ? 'pengeluaran' : 'pemasukan'} di bulan ini.
          </div>
        ) : (
          <div>
            {daysWithData.map((day, i) => {
              const amount = dailyTotals[day]
              const dateObj = new Date(viewYear, viewMonth, day)
              const dateStr = dateObj.toLocaleDateString('id-ID', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })
              return (
                <div key={day} className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom" style={{ borderBottomColor: i < daysWithData.length - 1 ? 'var(--tblr-border-color)' : 'transparent' }}>
                  <div className="fw-medium text-body" style={{ fontSize: '13px' }}>{dateStr}</div>
                  <div className="fw-bold" style={{ color: primaryColor, fontSize: '14px' }}>
                    {type === 'expense' ? '-' : '+'}{formatCurrency(amount)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const renderChart = () => {
    const categories = Array.from({ length: daysInMonth }, (_, i) => String(i + 1))
    const data = Array.from({ length: daysInMonth }, (_, i) => dailyTotals[i + 1] || 0)

    return (
      <div className="bg-surface-secondary rounded-4 p-3 flex-grow-1 d-flex flex-column justify-content-center pt-4">
        <Chart
          chartId={`daily-chart-${type}`}
          chartData={{
            type: 'bar',
            height: 18,
            series: [{ name: type === 'expense' ? 'Pengeluaran' : 'Pemasukan', data }],
            categories,
            color: primaryColor,
            showX: true,
            legend: false,
            datalabels: false,
          }}
        />
      </div>
    )
  }

  return (
    <div className="card shadow-sm border-0 rounded-4 d-flex flex-column">
      <div className="card-body p-3 d-flex flex-column">
        {/* Header Controls */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-shrink-0 flex-wrap gap-2">
          <div className="d-flex align-items-center gap-3">
            <h4 className="fw-bold mb-0" style={{ fontSize: '15px' }}>Ringkasan Harian</h4>
          </div>
          
          <div className="d-flex align-items-center gap-2">
            {/* Sort Order Toggle (only for list view) */}
            {viewType === 'list' && (
              <button
                className="btn btn-light btn-sm rounded-pill d-flex align-items-center gap-1 px-3"
                style={{ fontSize: '12px', backgroundColor: '#f4f5f7', border: 'none', color: '#4a5568' }}
                onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              >
                <Icon icon="arrows-sort" size={14} stroke={2} />
                {sortOrder === 'desc' ? 'Terbaru' : 'Terlama'}
              </button>
            )}

            {/* View Type Segmented Control */}
            <div className="nav nav-pills d-flex p-1 rounded-pill" style={{ gap: '2px', backgroundColor: '#f4f5f7' }}>
              <button
                className={`rounded-circle p-0 border-0 d-flex align-items-center justify-content-center ${viewType === 'list' ? 'shadow-sm text-white' : 'text-secondary bg-transparent'}`}
                style={{ width: '28px', height: '28px', backgroundColor: viewType === 'list' ? 'var(--tblr-primary)' : 'transparent', outline: 'none' }}
                onClick={() => setViewType('list')}
                title="Daftar"
              >
                <Icon icon="list" size={16} stroke={2} />
              </button>
              <button
                className={`rounded-circle p-0 border-0 d-flex align-items-center justify-content-center ${viewType === 'calendar' ? 'shadow-sm text-white' : 'text-secondary bg-transparent'}`}
                style={{ width: '28px', height: '28px', backgroundColor: viewType === 'calendar' ? 'var(--tblr-primary)' : 'transparent', outline: 'none' }}
                onClick={() => setViewType('calendar')}
                title="Kalender"
              >
                <Icon icon="calendar" size={16} stroke={2} />
              </button>
              <button
                className={`rounded-circle p-0 border-0 d-flex align-items-center justify-content-center ${viewType === 'chart' ? 'shadow-sm text-white' : 'text-secondary bg-transparent'}`}
                style={{ width: '28px', height: '28px', backgroundColor: viewType === 'chart' ? 'var(--tblr-primary)' : 'transparent', outline: 'none' }}
                onClick={() => setViewType('chart')}
                title="Grafik"
              >
                <Icon icon="chart-bar" size={16} stroke={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Content based on viewType */}
        {isLoading ? (
          <div className="flex-grow-1 d-flex align-items-center justify-content-center py-5">
            <div className="spinner-border text-primary spinner-border-sm" />
          </div>
        ) : (
          <>
            {viewType === 'calendar' && renderCalendar()}
            {viewType === 'list' && renderList()}
            {viewType === 'chart' && renderChart()}
          </>
        )}
      </div>
    </div>
  )
}
