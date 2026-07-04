import React, { useContext, useMemo, useState } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { PlanningContext } from '../../pages/PlanningLayout'

const DAY_LABELS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

function getHeatColor(amount: number, max: number): string {
  if (amount === 0) return 'transparent'
  const ratio = Math.min(amount / max, 1)
  
  if (ratio < 0.25) return `rgba(var(--tblr-primary-rgb), 0.15)`
  if (ratio < 0.50) return `rgba(var(--tblr-primary-rgb), 0.35)`
  if (ratio < 0.75) return `rgba(var(--tblr-primary-rgb), 0.65)`
  return `rgba(var(--tblr-primary-rgb), 0.90)`
}

function getTextColor(amount: number, max: number): string {
  if (amount === 0) return '#888'
  const ratio = Math.min(amount / max, 1)
  return ratio >= 0.65 ? '#fff' : '#333'
}

const formatK = (val: number) => {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}Jt`
  if (val >= 1000) return `${Math.round(val / 1000)}K`
  return val.toString()
}

export function SubscriptionCalendar() {
  const { subsData } = useContext(PlanningContext) || {}
  const bills = subsData?.subscriptions || []

  const today = new Date()
  const [currentDate, setCurrentDate] = useState(() => new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const daysInMonth = getDaysInMonth(year, month)
  const firstOffset = getFirstDayOfMonth(year, month)

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const dailyTotals = useMemo(() => {
    const totals: Record<number, number> = {}
    bills.forEach((b: any) => {
      if (!b.dueDate) return
      const d = new Date(b.dueDate)
      if (d.getMonth() === month && d.getFullYear() === year) {
         const day = d.getDate()
         totals[day] = (totals[day] || 0) + Number(b.amount || 0)
      }
    })
    return totals
  }, [bills, month, year])
  
  const maxAmount = Math.max(...Object.values(dailyTotals), 1)

  const tooltipText = (day: number) => {
    const amount = dailyTotals[day] || 0
    if (amount === 0) return ''
    const dayBills = bills.filter((b: any) => {
        if (!b.dueDate) return false
        const d = new Date(b.dueDate)
        return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year
    })
    return `${day} ${MONTH_NAMES[month]} - ${dayBills.map((b: any) => b.name).join(', ')}: Rp ${amount.toLocaleString('id-ID')}`
  }

  return (
    <div className="card shadow-none border overflow-hidden h-100 d-flex flex-column" style={{ borderRadius: '12px' }}>
      <div className="card-header border-0 bg-transparent pt-3 px-3 pb-0">
        <h3 className="card-title fw-bold m-0" style={{ fontSize: '14px' }}>
          Jadwal Penagihan
        </h3>
      </div>
      <div className="card-body p-3 d-flex flex-column flex-grow-1">
        <div className="bg-light rounded-4 p-3 flex-grow-1 d-flex flex-column justify-content-center">
          {/* Month nav */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <button
              className="btn btn-icon btn-sm btn-light rounded-circle"
              onClick={handlePrevMonth}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M15 6l-6 6l6 6" />
              </svg>
            </button>
            <span className="fw-bold" style={{ fontSize: '14px' }}>
              {MONTH_NAMES[month]} {year}
            </span>
            <button
              className="btn btn-icon btn-sm btn-light rounded-circle"
              onClick={handleNextMonth}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M9 6l6 6l-6 6" />
              </svg>
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
              const bgColor = getHeatColor(amount, maxAmount)
              const color = getTextColor(amount, maxAmount)
              const isToday = year === today.getFullYear() && month === today.getMonth() && day === today.getDate()

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
                  title={tooltipText(day)}
                >
                  <span style={{ fontSize: '11px', fontWeight: 600, color }}>{day}</span>
                  {amount > 0 && (
                    <span style={{ fontSize: '8px', color, lineHeight: 1 }}>
                      {formatK(amount)}
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
                style={{ width: '14px', height: '14px', backgroundColor: `rgba(var(--tblr-primary-rgb), ${op})` }}
              />
            ))}
            <span className="text-secondary ms-1" style={{ fontSize: '10px' }}>Tinggi</span>
          </div>
        </div>
      </div>
    </div>
  )
}
