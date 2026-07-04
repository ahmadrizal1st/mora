import React, { useContext } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { PlanningContext } from '../../pages/PlanningLayout'
import { formatCurrency } from '@/shared/utils/currencyUtils'

export function TrialTrackerCard() {
  const { subsData } = useContext(PlanningContext) || {}
  const subscriptions = subsData?.subscriptions || []

  const trials = subscriptions
    .filter((sub: any) => sub.name.toLowerCase().includes('trial'))
    .map((sub: any) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const dueDate = new Date(sub.dueDate)
      dueDate.setHours(0, 0, 0, 0)
      const diffTime = dueDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      const getLogo = (name: string) => {
        const n = name.toLowerCase()
        if (n.includes('netflix')) return 'https://cdn-icons-png.flaticon.com/512/732/732228.png'
        if (n.includes('spotify')) return 'https://cdn-icons-png.flaticon.com/512/5968/5968906.png'
        if (n.includes('youtube')) return 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png'
        if (n.includes('canva')) return 'https://cdn-icons-png.flaticon.com/512/5968/5968906.png'
        return ''
      }

      return {
        id: sub.id,
        name: sub.name,
        daysLeft: diffDays > 0 ? diffDays : 0,
        price: formatCurrency(sub.amount),
        logo: getLogo(sub.name),
        rawIcon: sub.icon || 'credit-card',
      }
    })

  return (
    <div className="card shadow-none border h-100" style={{ borderRadius: '12px' }}>
      <div className="card-header border-0 bg-transparent pt-3 px-3 pb-0">
        <h3 className="card-title fw-bold m-0" style={{ fontSize: '14px' }}>
          Trial Tracker
          <span
            className="badge bg-primary-lt text-primary border-0 ms-auto rounded-pill px-2 py-0.5"
            style={{ fontSize: '9px' }}
          >
            {trials.length} Aktif
          </span>
        </h3>
      </div>
      <div className="card-body p-3 d-flex flex-column h-100">
        <div className="vstack gap-2 flex-grow-1">
          {subscriptions.length === 0 ? (
            <div className="text-center py-4 my-auto text-secondary d-flex flex-column align-items-center justify-content-center">
              <Icon icon="help" size={32} stroke={1.5} className="text-secondary opacity-50 mb-3" />
              <div className="fw-bold text-body mb-1" style={{ fontSize: '14px' }}>Belum Ada Data</div>
              <div className="text-secondary" style={{ fontSize: '12px', lineHeight: '1.5' }}>Tambahkan langganan trial untuk melacak durasinya</div>
            </div>
          ) : trials.length === 0 ? (
            <div className="text-center py-4 my-auto text-secondary d-flex flex-column align-items-center justify-content-center">
              <Icon icon="box" size={32} stroke={1.5} className="text-secondary mb-3 opacity-50" />
              <div className="fw-bold text-body mb-1" style={{ fontSize: '14px' }}>Tidak Ada Trial Aktif</div>
              <div className="text-secondary" style={{ fontSize: '12px', lineHeight: '1.5' }}>Belum ada layanan trial yang sedang berjalan.</div>
            </div>
          ) : (
            trials.map((trial) => (
              <div
                key={trial.id}
                className="p-2 bg-body-tertiary rounded-3 border border-transparent"
              >
                <div className="d-flex align-items-start gap-3">
                  <div
                    className="bg-surface p-1 rounded-2 border d-flex align-items-center justify-content-center flex-shrink-0"
                    style={{ width: '32px', height: '32px', overflow: 'hidden' }}
                  >
                    {trial.logo ? (
                      <img
                        src={trial.logo}
                        alt=""
                        style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    ) : (
                      <Icon icon={trial.rawIcon as any} size="xs" className="text-primary" />
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="fw-bold text-body" style={{ fontSize: '12px' }}>
                          {trial.name}
                        </div>
                        <div className="text-secondary" style={{ fontSize: '10px' }}>
                          Billed {trial.price}
                        </div>
                      </div>
                      <div className="text-end">
                        <div
                          className={`fw-bold ${trial.daysLeft <= 2 ? 'text-danger' : 'text-primary'}`}
                          style={{ fontSize: '11px' }}
                        >
                          {trial.daysLeft} Hari lagi
                        </div>
                        <div className="text-secondary" style={{ fontSize: '9px' }}>
                          Sisa Waktu
                        </div>
                      </div>
                    </div>
                    <div className="mt-1.5 d-flex justify-content-end">
                      <span
                        className="cursor-pointer text-danger fw-bold text-hover-dark"
                        style={{
                          fontSize: '9px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          userSelect: 'none',
                          transition: 'color 0.15s ease'
                        }}
                      >
                        Batalkan Trial
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-2.5 text-center">
          <div className="d-inline-flex align-items-center gap-1.5 px-2 py-0.5 bg-primary-lt rounded-pill">
            <Icon icon="bell-ringing" size="xs" className="text-primary" />
            <span className="text-primary fw-medium" style={{ fontSize: '10px' }}>
              Pengingat aktif 24 jam sebelum jatuh tempo
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
