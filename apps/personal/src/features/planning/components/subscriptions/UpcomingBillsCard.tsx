import React, { useContext } from 'react'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import { Icon } from '@/shared/components/ui/Icon'
import { PlanningContext } from '../../pages/PlanningLayout'

interface UpcomingBillsCardProps {
  totalMonthly: number
  paidThisMonth: number
}

export function UpcomingBillsCard({ totalMonthly, paidThisMonth }: UpcomingBillsCardProps) {
  const { subsData } = useContext(PlanningContext) || {}
  const subscriptions = subsData?.subscriptions || []

  const [imageErrors, setImageErrors] = React.useState<Record<string, boolean>>({})
  const percentage = totalMonthly > 0 ? Math.round((paidThisMonth / totalMonthly) * 100) : 0

  const getLogo = (name: string) => {
    const n = name.toLowerCase()
    if (n.includes('netflix')) return 'https://cdn-icons-png.flaticon.com/512/732/732228.png'
    if (n.includes('spotify')) return 'https://cdn-icons-png.flaticon.com/512/5968/5968906.png'
    if (n.includes('youtube')) return 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png'
    if (n.includes('canva')) return 'https://cdn-icons-png.flaticon.com/512/5968/5968906.png'
    return ''
  }

  const nextPayments = subscriptions
    .filter((sub: any) => sub.status !== 'paid')
    .sort((a: any, b: any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 2)
    .map((sub: any) => {
      const dateObj = new Date(sub.dueDate)
      const day = dateObj.getDate()
      const month = dateObj.toLocaleDateString('id-ID', { month: 'short' })
      return {
        name: sub.name,
        date: `${day < 10 ? '0' + day : day} ${month}`,
        amount: formatCurrency(sub.amount),
        icon: sub.icon || 'credit-card',
      }
    })

  return (
    <div className="card shadow-none border h-100" style={{ borderRadius: '12px' }}>
      <div className="card-body p-3 d-flex flex-column h-100">
        <div className="mb-2">
          <div
            className="text-secondary small fw-bold text-uppercase mb-1"
            style={{ fontSize: '10px', letterSpacing: '0.05em' }}
          >
            Total Tagihan
          </div>
          <div className="h2 fw-bold mb-0">{formatCurrency(totalMonthly)}</div>
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

        <div className="pt-2 border-top mt-4">
          <div
            className="text-secondary small fw-bold text-uppercase mb-3"
            style={{ fontSize: '9px', letterSpacing: '0.05em' }}
          >
            Pembayaran Terdekat
          </div>
          <div className="vstack gap-2">
            {nextPayments.length === 0 ? (
              <div className="text-center py-4 my-auto text-secondary">
                <Icon icon="circle-check" size="md" className="text-success mb-2" />
                <div className="small fw-bold">Semua Tagihan Lunas!</div>
                <div className="small text-muted" style={{ fontSize: '10px' }}>Tidak ada tagihan terdekat</div>
              </div>
            ) : (
              nextPayments.map((p, i) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
