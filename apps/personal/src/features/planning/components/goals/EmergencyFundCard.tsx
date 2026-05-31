import React from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { formatCurrency } from '@/shared/utils/currencyUtils'

export function EmergencyFundCard() {
  const target = 50000000
  const current = 15000000
  const percentage = Math.round((current / target) * 100)

  return (
    <div className="card border-0" style={{ borderRadius: '16px' }}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-3">
            <div
              className="p-2 bg-orange-lt rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: '40px', height: '40px' }}
            >
              <Icon icon="shield-check" size="sm" className="text-orange" />
            </div>
            <div>
              <h4 className="fw-bold m-0 fs-3">Dana Darurat</h4>
              <div className="text-secondary small fw-medium">Safety Net</div>
            </div>
          </div>
          <span
            className="badge bg-orange text-white fw-bold border-0 rounded-pill px-3 py-2"
            style={{ fontSize: '11px' }}
          >
            {percentage}%
          </span>
        </div>

        <div className="mb-3 d-flex justify-content-between align-items-end">
          <div>
            <div
              className="text-secondary small mb-1 fw-bold"
              style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              TERKUMPUL
            </div>
            <div className="fw-bold text-body fs-2">{formatCurrency(current)}</div>
          </div>
          <div className="text-end">
            <div
              className="text-secondary small mb-1 fw-bold"
              style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
              TARGET (6 BLN)
            </div>
            <div className="fw-bold text-secondary fs-4">{formatCurrency(target)}</div>
          </div>
        </div>

        <div
          className="progress progress-md mb-4"
          style={{
            height: '10px',
            backgroundColor: 'var(--tblr-border-color)',
            borderRadius: '10px',
          }}
        >
          <div
            className="progress-bar bg-orange"
            style={{
              width: `${percentage}%`,
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(247, 103, 7, 0.2)',
              transition: 'width 1.5s ease-in-out',
            }}
          ></div>
        </div>

        <div className="p-3 bg-body-tertiary rounded-3 border-0 position-relative overflow-hidden">
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-orange opacity-5"></div>

          <div className="d-flex gap-3 align-items-center position-relative" style={{ zIndex: 1 }}>
            <div
              className="p-2 bg-orange text-white rounded-circle d-flex align-items-center justify-content-center shadow-none"
              style={{ width: '32px', height: '32px' }}
            >
              <Icon icon="bulb" size="sm" stroke={2.5} />
            </div>
            <p
              className="small text-secondary mb-0 fw-medium"
              style={{ fontSize: '11px', lineHeight: '1.6' }}
            >
              Dana darurat idealnya mencakup <strong>6 bulan</strong> biaya hidup. Tingkatkan
              setoran untuk keamanan finansial yang lebih baik.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
