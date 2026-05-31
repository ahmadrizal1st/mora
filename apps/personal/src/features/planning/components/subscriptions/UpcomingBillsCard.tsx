import React from 'react'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import { Icon } from '@/shared/components/ui/Icon'

interface UpcomingBillsCardProps {
  totalMonthly: number
  paidThisMonth: number
}

export function UpcomingBillsCard({ totalMonthly, paidThisMonth }: UpcomingBillsCardProps) {
  const [imageErrors, setImageErrors] = React.useState<Record<string, boolean>>({})
  const percentage = Math.round((paidThisMonth / totalMonthly) * 100)

  const getLogo = (name: string) => {
    if (name.includes('Netflix')) return 'https://cdn-icons-png.flaticon.com/512/732/732228.png'
    if (name.includes('Spotify')) return 'https://cdn-icons-png.flaticon.com/512/5968/5968906.png'
    return ''
  }

  const nextPayments = [
    { name: 'Netflix Family', date: '08 Mei', amount: 'Rp 186.000', icon: 'player-play' },
    { name: 'Spotify Premium', date: '12 Mei', amount: 'Rp 55.000', icon: 'music' },
  ]

  return (
    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <div
              className="text-secondary small fw-bold text-uppercase mb-1"
              style={{ fontSize: '10px', letterSpacing: '0.05em' }}
            >
              Total Tagihan
            </div>
            <div className="h2 fw-bold mb-0">{formatCurrency(totalMonthly)}</div>
          </div>
          <div
            className="p-2 rounded-circle shadow-sm"
            style={{ backgroundColor: 'var(--tblr-primary)', color: '#fff' }}
          >
            <Icon icon="credit-card" size="sm" />
          </div>
        </div>

        <div
          className="progress progress-sm mb-3"
          style={{
            height: '6px',
            backgroundColor: 'var(--tblr-border-color)',
            borderRadius: '10px',
          }}
        >
          <div
            className="progress-bar"
            style={{
              width: `${percentage}%`,
              backgroundColor: 'var(--tblr-primary)',
              borderRadius: '10px',
            }}
          ></div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <div className="text-secondary small fw-medium" style={{ fontSize: '10px' }}>
              Sudah Dibayar
            </div>
            <div className="fw-bold text-primary small">{formatCurrency(paidThisMonth)}</div>
          </div>
          <div className="text-end">
            <div className="text-secondary small fw-medium" style={{ fontSize: '10px' }}>
              Sisa
            </div>
            <div className="fw-bold text-body small">
              {formatCurrency(totalMonthly - paidThisMonth)}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-3 border-top">
          <div
            className="text-secondary small fw-bold text-uppercase mb-3"
            style={{ fontSize: '9px', letterSpacing: '0.05em' }}
          >
            Pembayaran Terdekat
          </div>
          <div className="vstack gap-2">
            {nextPayments.map((p, i) => (
              <div
                key={i}
                className="d-flex align-items-center justify-content-between p-2 bg-body-tertiary rounded-2 transition-all hover-bg-surface"
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="bg-surface p-1 rounded-2 shadow-sm d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px', overflow: 'hidden' }}
                  >
                    {getLogo(p.name) && !imageErrors[p.name] ? (
                      <img
                        src={getLogo(p.name)}
                        alt=""
                        style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                        onError={() => setImageErrors((prev) => ({ ...prev, [p.name]: true }))}
                      />
                    ) : (
                      <Icon icon={p.icon as any} size="xs" className="text-primary" />
                    )}
                  </div>
                  <span className="small fw-bold" style={{ fontSize: '11px' }}>
                    {p.name}
                  </span>
                </div>
                <div className="text-end">
                  <div className="fw-bold text-body" style={{ fontSize: '11px' }}>
                    {p.amount}
                  </div>
                  <div className="text-secondary" style={{ fontSize: '9px' }}>
                    {p.date}
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
