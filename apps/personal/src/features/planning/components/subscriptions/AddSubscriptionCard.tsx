import React from 'react'
import { Icon } from '@/shared/components/ui/Icon'

interface AddSubscriptionCardProps {
  onClick?: () => void
}

export function AddSubscriptionCard({ onClick }: AddSubscriptionCardProps) {
  return (
    <div
      className="card h-100 shadow-none transition-all hover-bg-body-tertiary"
      style={{
        borderRadius: '12px',
        border: '1.5px dashed var(--tblr-border-color)',
        cursor: 'pointer',
        background: 'transparent',
        minHeight: '50px',
      }}
      onClick={onClick}
    >
      <div className="card-body p-3 d-flex align-items-center justify-content-center text-center">
        <div>
          <div className="mb-2">
            <Icon icon="plus" size="sm" className="text-primary" />
          </div>
          <div
            className="fw-bold text-secondary"
            style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            Tambah Langganan
          </div>
        </div>
      </div>
    </div>
  )
}
