import React, { useContext, useMemo } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { PlanningContext } from '../../pages/PlanningLayout'

export function SubscriptionCalendar() {
  const { subsData } = useContext(PlanningContext)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const bills = subsData?.subscriptions || []

  return (
    <div
      className="card shadow-sm border-0 overflow-hidden h-100 d-flex flex-column"
      style={{ borderRadius: '16px' }}
    >
      <div className="card-header border-0 py-4 px-4 bg-surface d-flex justify-content-between align-items-center">
        <h3 className="card-title fw-bold m-0 d-flex align-items-center gap-2">
          <div className="p-2 bg-primary-lt rounded-3 shadow-sm d-flex align-items-center justify-content-center">
            <Icon icon="calendar" size="sm" className="text-primary" />
          </div>
          May 2026 Schedule
        </h3>
        <div className="d-flex gap-2">
          <button className="btn btn-icon btn-sm btn-ghost-secondary rounded-circle">
            <Icon icon="chevron-left" size="xs" />
          </button>
          <button className="btn btn-icon btn-sm btn-ghost-secondary rounded-circle">
            <Icon icon="chevron-right" size="xs" />
          </button>
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

          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="bg-body-tertiary p-3"
              style={{ minHeight: '100px', opacity: 0.5 }}
            ></div>
          ))}

          {days.map((day) => {
            const dayBills = bills.filter((b: any) => {
              if (!b.dueDate) return false
              const d = new Date(b.dueDate)
              return d.getDate() === day
            })

            const isToday = day === 4

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
        </div>
      </div>
    </div>
  )
}
