import React, { useState } from 'react'
import { Icon } from '@/shared/components/ui/Icon'

interface Subscription {
  id: number
  name: string
  amount: number
  dueDate: string
  status: 'paid' | 'upcoming' | 'unpaid'
  icon: string
  category?: string
}

export function SubscriptionItem({
  subscription,
  onClick,
}: {
  subscription: Subscription & { color?: string }
  onClick?: () => void
}) {
  const [imageError, setImageError] = useState(false)

  const getLogo = (name: string) => {
    if (name.includes('Netflix')) return 'https://cdn-icons-png.flaticon.com/512/732/732228.png'
    if (name.includes('Spotify')) return 'https://cdn-icons-png.flaticon.com/512/5968/5968906.png'
    if (name.includes('PLN')) return 'https://upload.wikimedia.org/wikipedia/id/5/55/Logo_PLN.png'
    if (name.includes('Indihome'))
      return 'https://upload.wikimedia.org/wikipedia/id/e/e1/IndiHome_logo.png'
    return ''
  }

  const getFallbackIcon = (name: string) => {
    if (name.includes('PLN')) return 'bolt'
    if (name.includes('Indihome')) return 'world'
    if (name.includes('Netflix')) return 'player-play'
    if (name.includes('Spotify')) return 'music'
    return subscription.icon || 'receipt'
  }

  const statusColor =
    subscription.status === 'paid'
      ? 'success'
      : subscription.status === 'upcoming'
        ? 'primary'
        : 'danger'

  const statusLabel =
    subscription.status === 'paid'
      ? 'Lunas'
      : subscription.status === 'upcoming'
        ? 'Akan Datang'
        : 'Belum Bayar'

  const formatDueDate = (dateStr: string) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const logoUrl = getLogo(subscription.name)

  return (
    <div
      className="card shadow-none h-100 cursor-pointer"
      style={{ borderRadius: '12px', border: '1px solid var(--tblr-border-color)' }}
      onClick={onClick}
    >
      <div className="card-body p-3">
        <div className="d-flex align-items-center gap-3">
          <div
            className="bg-surface p-1 rounded-2 border d-flex align-items-center justify-content-center flex-shrink-0"
            style={{ width: '32px', height: '32px', overflow: 'hidden' }}
          >
            {logoUrl && !imageError ? (
              <img
                src={logoUrl}
                alt=""
                style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                onError={() => setImageError(true)}
              />
            ) : (
              <Icon
                icon={getFallbackIcon(subscription.name) as any}
                size="sm"
                className="text-primary"
              />
            )}
          </div>
          <div className="flex-grow-1">
            <div className="d-flex justify-content-between align-items-center">
              <div className="text-truncate" style={{ maxWidth: '140px' }}>
                <div className="fw-bold text-body text-truncate" style={{ fontSize: '12px' }}>
                  {subscription.name}
                </div>
                <div className="text-secondary" style={{ fontSize: '10px' }}>
                  {formatDueDate(subscription.dueDate)}
                </div>
              </div>
              <div className="text-end">
                <div
                  className="fw-bold text-body"
                  style={{ fontSize: '11px' }}
                >{`Rp ${subscription.amount.toLocaleString()}`}</div>
                <span
                  className={`badge bg-${statusColor}-lt text-${statusColor} border-0 rounded-pill mt-0.5`}
                  style={{ fontSize: '8px', padding: '1px 6px' }}
                >
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
