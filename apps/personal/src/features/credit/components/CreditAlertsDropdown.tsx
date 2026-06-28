import { clsx } from 'clsx'
import { Icon } from '@/shared/components/ui/Icon'
import { useCredits } from '@/features/credit/hooks/useCredits'
import { useMemo } from 'react'

interface CreditAlertsDropdownProps {
  className?: string
}

export function CreditAlertsDropdown({ className }: CreditAlertsDropdownProps) {
  const { data: credits = [] } = useCredits()

  const alerts = useMemo(() => {
    const list: any[] = []
    credits.forEach((c) => {
      const util =
        c.credit?.limit && c.credit.limit > 0
          ? (c.credit.total_amount / c.credit.limit) * 100
          : 0
      if (util > 70) {
        list.push({
          color: 'orange',
          icon: 'alert-circle',
          text: `${c.name} utilisasi ${util.toFixed(0)}% — di atas batas aman`,
          action: 'Lihat Detail',
        })
      }
      if (c.credit?.due_date) {
        const dd = new Date(c.credit?.due_date)
        const diff = (dd.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        if (diff <= 7 && diff >= 0) {
          list.push({
            color: 'red',
            icon: 'calendar-due',
            text: `Tagihan ${c.name} jatuh tempo dalam ${Math.ceil(diff)} hari`,
            action: 'Bayar',
          })
        }
      }
    })
    return list
  }, [credits])

  if (alerts.length === 0) return null

  return (
    <div className={clsx('dropdown', className)}>
      <button
        type="button"
        className="btn btn-outline-warning position-relative"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
      >
        <Icon icon="bell-ringing" className="me-2" />
        <span className="d-none d-md-inline">Notifikasi Kredit</span>
        <span className="badge bg-red badge-notification badge-blink"></span>
      </button>

      <div
        className="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card"
        style={{ width: '400px', maxWidth: '100vw' }}
      >
        <div className="card shadow-none border-0">
          <div className="card-header border-bottom-0 pb-1">
            <h3 className="card-title fw-bold">Peringatan Kredit</h3>
          </div>
          <div className="list-group list-group-flush list-group-hoverable" style={{ maxHeight: '350px', overflowY: 'auto' }}>
            {alerts.map((alert, i) => (
              <div className="list-group-item" key={i}>
                <div className="row align-items-center">
                  <div className="col-auto">
                    <div className={`avatar avatar-sm bg-${alert.color}-lt text-${alert.color} rounded-circle`}>
                      <Icon icon={alert.icon} size="sm" />
                    </div>
                  </div>
                  <div className="col text-truncate">
                    <div className="text-body d-block text-truncate small fw-medium" style={{ whiteSpace: 'normal', lineHeight: '1.4' }}>
                      {alert.text}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
