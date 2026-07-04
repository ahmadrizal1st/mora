import React from 'react'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import { Icon } from '@/shared/components/ui/Icon'

interface GoalsOverviewCardProps {
  totalSaved: number
  totalTarget: number
  goals?: any[]
  onViewDetail?: () => void
}

export function GoalsOverviewCard({
  totalSaved,
  totalTarget,
  goals = [],
  onViewDetail,
}: GoalsOverviewCardProps) {
  const percentage = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0
  const totalMonthlyDeposit = goals.reduce((acc, curr) => acc + (curr.monthlyDeposit || 0), 0)
  
  const activeGoals = goals.filter(g => g.saved < g.target && g.rawEta)
  let maxEta = ''
  if (activeGoals.length > 0) {
    const maxDate = new Date(Math.max(...activeGoals.map(g => new Date(g.rawEta).getTime())))
    maxEta = maxDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  } else {
    maxEta = 'Tidak ada'
  }

  const isEmpty = goals.length === 0 || (totalTarget === 0 && totalSaved === 0)

  return (
    <div className="card border-0 shadow-sm overflow-hidden h-100" style={{ borderRadius: '16px' }}>
      <div className="card-body p-4 d-flex flex-column flex-grow-1">
        {isEmpty ? (
          <div className="position-relative text-center py-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
            <Icon icon="chart-pie" size={32} stroke={1.5} className="text-secondary opacity-50 mb-3" />
            <div className="fw-bold text-body mb-1" style={{ fontSize: '14px' }}>Belum Ada Progres</div>
            <div className="text-secondary" style={{ fontSize: '12px', lineHeight: '1.5' }}>Tambahkan impian untuk melihat progres.</div>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div
                className="text-secondary fw-bold mb-1"
                style={{ fontSize: '11px', letterSpacing: '0.05em' }}
              >
                TOTAL DANA DIKUMPULKAN
              </div>

              <div className="d-flex align-items-center gap-2 mb-3 flex-wrap">
                <span className="fw-bold text-orange" style={{ fontSize: '28px', lineHeight: '1.2' }}>
                  {formatCurrency(totalSaved)}
                </span>
                <span
                  className="badge bg-orange-lt text-orange border-0 rounded-pill px-2.5 py-1"
                  style={{ fontSize: '11px', fontWeight: '700' }}
                >
                  {percentage}% Terkumpul
                </span>
              </div>

              <div
                className="progress progress-sm mb-1"
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

            <div className="pt-3 mt-4 border-top">
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <div className="p-3 bg-body-tertiary rounded-3 border-0 transition-all hover-bg-surface">
                    <div
                      className="text-secondary mb-1 fw-bold"
                      style={{ fontSize: '9px', letterSpacing: '0.05em' }}
                    >
                      SISA TARGET
                    </div>
                    <div className="fw-bold text-body fs-4" style={{ letterSpacing: '-0.5px' }}>
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
                    <div className="fw-bold text-success fs-4" style={{ letterSpacing: '-0.5px' }}>+{formatCurrency(totalMonthlyDeposit)}</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-body-tertiary rounded-3 border-0 transition-all hover-bg-surface">
                    <div
                      className="text-secondary mb-1 fw-bold"
                      style={{ fontSize: '9px', letterSpacing: '0.05em' }}
                    >
                      TOTAL KESELURUHAN
                    </div>
                    <div className="fw-bold text-body fs-4" style={{ letterSpacing: '-0.5px' }}>
                      {formatCurrency(totalTarget)}
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 bg-body-tertiary rounded-3 border-0 transition-all hover-bg-surface">
                    <div
                      className="text-secondary mb-1 fw-bold"
                      style={{ fontSize: '9px', letterSpacing: '0.05em' }}
                    >
                      STATUS IMPIAN
                    </div>
                    <div className="fw-bold text-body fs-4" style={{ letterSpacing: '-0.5px' }}>
                      {activeGoals.length} <span className="fs-5 text-secondary fw-normal">aktif</span>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-flex align-items-center justify-content-between p-3 bg-orange-lt rounded-3 border border-orange-subtle shadow-sm">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="p-2 bg-orange text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                        style={{ width: '32px', height: '32px' }}
                      >
                        <Icon icon="calendar-stats" size="sm" />
                      </div>
                      <div>
                        <div
                          className="text-orange fw-bold"
                          style={{ fontSize: '9px', letterSpacing: '0.05em' }}
                        >
                          ESTIMASI SELESAI
                        </div>
                        <div className="fw-bold text-orange" style={{ fontSize: '13px' }}>
                          {maxEta}
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
          </>
        )}
      </div>
    </div>
  )
}
