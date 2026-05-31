import React from 'react'
import { formatCurrency } from '@/shared/utils/currencyUtils'

interface GoalsOverviewCardProps {
  totalSaved: number
  totalTarget: number
  onViewDetail?: () => void
}

export function GoalsOverviewCard({
  totalSaved,
  totalTarget,
  onViewDetail,
}: GoalsOverviewCardProps) {
  const percentage = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0

  return (
    <div className="card border-0 shadow-sm overflow-hidden h-100" style={{ borderRadius: '16px' }}>
      <div className="card-body p-4 d-flex flex-column h-100 position-relative">
        <div
          className="position-absolute top-0 end-0 p-4 opacity-5"
          style={{ transform: 'rotate(-15deg) translate(20%, -20%)' }}
        >
          <i className="ti ti-chart-pie" style={{ fontSize: '120px' }}></i>
        </div>

        <div className="position-relative mb-4" style={{ zIndex: 1 }}>
          <div
            className="text-secondary fw-bold mb-1"
            style={{ fontSize: '11px', letterSpacing: '0.05em' }}
          >
            TOTAL DANA DIKUMPULKAN
          </div>

          <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
            <span className="fw-bold text-orange" style={{ fontSize: '26px', lineHeight: '1.2' }}>
              {formatCurrency(totalSaved)}
            </span>
            <span
              className="badge bg-orange-lt text-orange border-0 rounded-pill px-2.5 py-1"
              style={{ fontSize: '11px', fontWeight: '700' }}
            >
              {percentage}%
            </span>
          </div>

          <p
            className="text-secondary small m-0 fw-medium italic opacity-75"
            style={{ fontSize: '12px', lineHeight: '1.4' }}
          >
            "Kamu sudah mencapai <strong>{percentage}%</strong> dari seluruh mimpimu. Terus
            semangat!"
          </p>
        </div>

        <div className="position-relative mb-4" style={{ zIndex: 1 }}>
          <div className="d-flex justify-content-between mb-2 align-items-center">
            <span
              className="fw-bold text-secondary"
              style={{ fontSize: '11px', letterSpacing: '0.05em' }}
            >
              KEMAJUAN GLOBAL
            </span>
            <span className="fw-bold text-orange" style={{ fontSize: '11px' }}>
              {percentage}%
            </span>
          </div>
          <div
            className="progress progress-sm"
            style={{
              height: '8px',
              borderRadius: '10px',
              backgroundColor: 'var(--tblr-border-color)',
            }}
          >
            <div
              className="progress-bar bg-orange animate-progress"
              role="progressbar"
              style={{
                width: `${percentage}%`,
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(245, 159, 0, 0.2)',
              }}
            ></div>
          </div>
        </div>

        <div className="mt-auto pt-4 border-top">
          <div className="row g-3">
            <div className="col-6">
              <div className="p-3 bg-body-tertiary rounded-3 border-0 transition-all hover-bg-surface">
                <div
                  className="text-secondary mb-1 fw-bold"
                  style={{ fontSize: '9px', letterSpacing: '0.05em' }}
                >
                  SISA TARGET
                </div>
                <div className="fw-bold text-body fs-4">
                  {formatCurrency(Math.max(0, totalTarget - totalSaved))}
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="p-3 bg-body-tertiary rounded-3 border-0 transition-all hover-bg-surface">
                <div
                  className="text-secondary mb-1 fw-bold"
                  style={{ fontSize: '9px', letterSpacing: '0.05em' }}
                >
                  RATA-RATA /BULAN
                </div>
                <div className="fw-bold text-success fs-4">+{formatCurrency(6000000)}</div>
              </div>
            </div>
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between p-3 bg-orange-lt rounded-3 border border-orange-subtle shadow-sm">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="p-2 bg-orange text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                    style={{ width: '32px', height: '32px' }}
                  >
                    <i className="ti ti-calendar-stats" style={{ fontSize: '16px' }}></i>
                  </div>
                  <div>
                    <div
                      className="text-orange fw-bold"
                      style={{ fontSize: '9px', letterSpacing: '0.05em' }}
                    >
                      ESTIMASI SELESAI
                    </div>
                    <div className="fw-bold text-orange" style={{ fontSize: '13px' }}>
                      Maret 2027
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-orange btn-sm rounded-pill px-3 fw-bold"
                  onClick={onViewDetail}
                >
                  Detail
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
