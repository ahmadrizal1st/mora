import { Icon } from '@/shared/components/ui/Icon'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import clsx from 'clsx'

interface BudgetBurnRateCardProps {
  spent: number
  totalBudget: number
  safeToSpendPerDay?: number
  topCategory?: any
}

export function BudgetBurnRateCard({ spent, totalBudget, safeToSpendPerDay = 0, topCategory }: BudgetBurnRateCardProps) {
  const today = new Date()
  const currentDay = today.getDate()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const daysRemaining = daysInMonth - currentDay

  const dailyBurn = spent / currentDay
  const projectedSpent = dailyBurn * daysInMonth
  const isOverBudget = projectedSpent > totalBudget
  const variance = Math.abs(projectedSpent - totalBudget)
  const isEmpty = totalBudget === 0 && spent === 0

  return (
    <div
      className="card shadow-sm border-0 h-100 w-100"
      style={{ borderRadius: '24px' }}
    >
      <div className="card-body p-3 d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div className="d-flex align-items-center gap-2">
            <div
              className="avatar avatar-sm rounded-circle shadow-sm"
              style={{
                background: 'rgba(var(--tblr-primary-rgb), 0.1)',
                border: '2px solid rgba(var(--tblr-primary-rgb), 0.4)',
                color: 'var(--tblr-primary)',
              }}
            >
              <Icon icon="flame" size="sm" />
            </div>
            <h4 className="m-0 fw-bold" style={{ fontSize: '1.05rem' }}>Spending Velocity</h4>
          </div>
          {!isEmpty && (
            <span
              className={`badge ${isOverBudget ? 'bg-danger-lt text-danger' : 'bg-success-lt text-success'} border-0 px-2`}
            >
              {isOverBudget ? 'Over Projection' : 'On Track'}
            </span>
          )}
        </div>

        {isEmpty ? (
          <div className="text-center py-4 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
            <div className="mb-3">
              <Icon icon="chart-line" size={40} stroke={1.5} style={{ opacity: 0.6 }} />
            </div>
            <div className="fw-bold text-body mb-1">Belum Ada Data</div>
            <div className="text-muted small mb-3">Tambahkan budget untuk melihat analisis</div>
          </div>
        ) : (
          <>
            <div className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <div className="text-secondary small fw-medium" style={{ fontSize: '12px' }}>Rata-rata Pengeluaran Harian</div>
                <div className="text-primary fw-bold" style={{ fontSize: '10px' }}>
                  Budget: {formatCurrency(totalBudget / daysInMonth)}
                </div>
              </div>
              <div className="h2 fw-bold m-0">
                {formatCurrency(dailyBurn)} <span className="fs-5 text-muted fw-normal">/ hari</span>
              </div>
              <div
                className="progress progress-xs mt-2"
                style={{ height: '4px', background: 'var(--tblr-border-color)' }}
              >
                <div
                  className={clsx('progress-bar rounded-pill')}
                  style={{
                    width: `${Math.min((dailyBurn / (totalBudget / daysInMonth)) * 100, 100)}%`,
                    background: isOverBudget
                      ? 'linear-gradient(90deg, #ff4b2b 0%, #ff416c 100%)'
                      : 'linear-gradient(90deg, var(--tblr-primary) 0%, #ffc107 100%)',
                    boxShadow: isOverBudget ? '0 0 10px rgba(255, 75, 43, 0.3)' : 'none',
                  }}
                ></div>
              </div>
            </div>

            <div className="p-2 px-3 rounded-3 bg-body-tertiary border shadow-sm mb-3">
              <div className="row g-2">
                <div className="col-6 border-end" style={{ borderColor: 'var(--tblr-border-color)' }}>
                  <div className="text-muted small mb-1" style={{ fontSize: '11px' }}>Estimasi Akhir Bulan</div>
                  <div className={`fw-bold ${isOverBudget ? 'text-danger' : 'text-body'}`} style={{ fontSize: '13px' }}>
                    {formatCurrency(projectedSpent)}
                  </div>
                  <div className="text-muted" style={{ fontSize: '9px' }}>
                    Proj. {Math.round((projectedSpent / totalBudget) * 100)}% total
                  </div>
                </div>
                <div className="col-6 ps-3">
                  <div className="text-muted small mb-1" style={{ fontSize: '11px' }}>
                    {isOverBudget ? 'Potensi Defisit' : 'Estimasi Sisa'}
                  </div>
                  <div className={`fw-bold ${isOverBudget ? 'text-danger' : 'text-success'}`} style={{ fontSize: '13px' }}>
                    {formatCurrency(variance)}
                  </div>
                  <div className="text-muted" style={{ fontSize: '9px' }}>
                    {isOverBudget ? 'Need adjustment' : 'Good job!'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-auto d-flex flex-column mb-3">
              {topCategory && topCategory.spent > 0 && (
                <div className="d-flex align-items-center justify-content-between p-2 px-3 rounded-3 border mb-2 shadow-sm" style={{ background: 'var(--tblr-bg-surface)', borderColor: 'var(--tblr-border-color)' }}>
                  <div className="d-flex align-items-center gap-2">
                    <div className="d-flex align-items-center justify-content-center text-white rounded bg-purple shadow-sm" style={{ width: '28px', height: '28px' }}>
                      <Icon icon={topCategory.icon || 'star'} size="sm" />
                    </div>
                    <div>
                      <div className="fw-bold text-muted" style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pengeluaran Terbesar</div>
                      <div className="fw-bold text-body" style={{ fontSize: '12px' }}>{topCategory.name}</div>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold text-body" style={{ fontSize: '12px' }}>{formatCurrency(topCategory.spent)}</div>
                    <div className="text-muted fw-medium" style={{ fontSize: '9px' }}>{Math.round((topCategory.spent / spent) * 100)}% dari total</div>
                  </div>
                </div>
              )}

              <div className="p-2 px-3 rounded-3" style={{ background: isOverBudget ? 'rgba(var(--tblr-danger-rgb), 0.05)' : 'rgba(var(--tblr-success-rgb), 0.05)', border: `1px solid rgba(var(--tblr-${isOverBudget ? 'danger' : 'success'}-rgb), 0.2)` }}>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <Icon icon={isOverBudget ? 'alert-triangle' : 'check'} size="sm" className={isOverBudget ? 'text-danger' : 'text-success'} />
                  <span className={`fw-bold text-${isOverBudget ? 'danger' : 'success'}`} style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {isOverBudget ? 'Peringatan Defisit' : 'Status Aman'}
                  </span>
                </div>
                <div className="text-secondary" style={{ fontSize: '11px', lineHeight: '1.4' }}>
                  {isOverBudget
                    ? `Kecepatan pengeluaran Anda melebihi batas harian. Tekan pengeluaran sekitar ${formatCurrency(dailyBurn - safeToSpendPerDay)}/hari agar terhindar dari defisit di akhir bulan.`
                    : 'Pengeluaran harian Anda masih berada di bawah batas wajar. Pertahankan ritme ini hingga akhir bulan.'}
                </div>
              </div>
            </div>

            <div className="d-flex align-items-center justify-content-between pt-2 border-top" style={{ borderColor: 'var(--tblr-border-color)' }}>
              <div className="d-flex align-items-center gap-2 text-secondary small" style={{ fontSize: '11px' }}>
                <Icon icon="calendar-stats" size="xs" />
                <span>{daysRemaining} hari tersisa</span>
              </div>
              <div className="text-muted small" style={{ fontSize: '10px' }}>
                Periode: {currentDay} / {daysInMonth} Hari
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
