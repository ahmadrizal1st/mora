import React from 'react'
import { Icon } from '@/shared/components/ui/Icon'

export function SmartInsightCard() {
  return (
    <div
      className="card shadow-none border overflow-hidden transition-all"
      style={{ borderRadius: '12px', background: '#ffffff' }}
    >
      <div className="card-body p-4 position-relative">
        <div className="d-flex align-items-start gap-3 position-relative z-1">
          <div
            className="flex-shrink-0 d-flex align-items-center justify-content-center bg-orange text-white"
            style={{ width: '40px', height: '40px', borderRadius: '10px' }}
          >
            <Icon icon="bulb" size="sm" stroke={1.5} />
          </div>

          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-1">
              <h4 className="fw-bold m-0 text-dark" style={{ fontSize: '15px' }}>
                Peluang Akselerasi
              </h4>
            </div>

            <p className="text-secondary mb-3 leading-relaxed" style={{ fontSize: '12px' }}>
              Dengan tambahan setoran <strong className="text-orange">Rp 500rb/bulan</strong>,
              target <strong className="text-dark">DP Rumah</strong> Anda bisa terwujud{' '}
              <span className="badge bg-orange-lt text-orange px-2 py-1 rounded-pill fw-bold border-0 mx-1">
                2 Bulan
              </span>{' '}
              lebih awal.
            </p>

            <button className="btn btn-sm btn-light rounded-pill px-3 fw-medium text-secondary shadow-none border">
              Lihat Skenario <Icon icon="arrow-right" size="xs" className="ms-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
