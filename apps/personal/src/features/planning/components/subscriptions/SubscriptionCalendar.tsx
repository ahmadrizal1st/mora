import React, { useContext, useMemo, useState } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { PlanningContext } from '../../pages/PlanningLayout'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'

export function SubscriptionCalendar() {
  const { subsData } = useContext(PlanningContext)
  const bills = subsData?.subscriptions || []

  // Dynamic date state starting at current month
  const [currentDate, setCurrentDate] = useState(() => new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const numDays = new Date(year, month + 1, 0).getDate()
  const startDayOfWeek = new Date(year, month, 1).getDay()
  const days = Array.from({ length: numDays }, (_, i) => i + 1)
  
  const endEmpty = (7 - ((startDayOfWeek + numDays) % 7)) % 7

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const monthLabel = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div
      className="card shadow-none border overflow-hidden h-100 d-flex flex-column"
      style={{ borderRadius: '12px' }}
    >
      <div className="card-header border-0 py-3 px-3 bg-surface d-flex justify-content-between align-items-center">
        <h3 className="card-title fw-bold m-0">
          {monthLabel} Schedule
        </h3>
        <div className="d-flex gap-3 align-items-center">
          <div 
            className="cursor-pointer text-secondary text-hover-dark d-flex align-items-center justify-content-center" 
            onClick={handlePrevMonth} 
            style={{ userSelect: 'none', transition: 'color 0.15s ease' }}
          >
            <IconChevronLeft size={18} />
          </div>
          <div 
            className="cursor-pointer text-secondary text-hover-dark d-flex align-items-center justify-content-center" 
            onClick={handleNextMonth} 
            style={{ userSelect: 'none', transition: 'color 0.15s ease' }}
          >
            <IconChevronRight size={18} />
          </div>
        </div>
      </div>
      <div className="card-body p-0 d-flex flex-column h-100">
        <div
          className="d-grid shadow-none"
          style={{
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '1px',
            background: 'var(--tblr-border-color)',
            borderTop: '1px solid var(--tblr-border-color)',
          }}
        >
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div
              key={d}
              className="bg-surface p-2 text-center text-secondary small fw-bold"
              style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              {d}
            </div>
          ))}

          {Array.from({ length: startDayOfWeek }).map((_, i) => (
            <div
              key={`empty-start-${i}`}
              className="bg-body-tertiary"
              style={{ minHeight: '100px', opacity: 0.5 }}
            ></div>
          ))}

          {days.map((day) => {
            const dayBills = bills.filter((b: any) => {
              if (!b.dueDate) return false
              const d = new Date(b.dueDate)
              return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year
            })

            const today = new Date()
            const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year

            return (
              <div
                key={day}
                className={`bg-surface p-2 position-relative transition-all`}
                style={{
                  minHeight: '100px',
                  border: isToday ? '2px solid var(--tblr-primary)' : 'none',
                  zIndex: isToday ? 1 : 0,
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <span
                    className={`small fw-bold ${isToday ? 'badge bg-primary text-white rounded-circle p-1' : 'text-secondary'}`}
                    style={{
                      width: isToday ? '20px' : 'auto',
                      height: isToday ? '20px' : 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                    }}
                  >
                    {day}
                  </span>
                </div>
                <div className="mt-1 d-flex flex-column gap-1">
                  {dayBills.map((b: any) => (
                    <div
                      key={b.id}
                      className="badge bg-primary-lt text-primary border-0 p-1 text-truncate d-flex align-items-center gap-1"
                      style={{ fontSize: '9px', maxWidth: '100%', cursor: 'pointer' }}
                      title={b.name}
                    >
                      <Icon
                        icon={b.icon as any}
                        size="xs"
                        style={{ width: '10px', height: '10px' }}
                      />
                      <span className="text-truncate">{b.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {Array.from({ length: endEmpty }).map((_, i) => (
            <div
              key={`empty-end-${i}`}
              className="bg-body-tertiary"
              style={{ minHeight: '100px', opacity: 0.5 }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  )
}
