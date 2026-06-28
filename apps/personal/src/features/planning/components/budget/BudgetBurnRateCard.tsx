import { Icon } from '@/shared/components/ui/Icon'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import clsx from 'clsx'

interface BudgetBurnRateCardProps {
  spent: number
  totalBudget: number
}

export function BudgetBurnRateCard({ spent, totalBudget }: BudgetBurnRateCardProps) {
  const daysInMonth = 31
  const currentDay = 15
  const daysRemaining = daysInMonth - currentDay

  const dailyBurn = spent / currentDay
  const projectedSpent = dailyBurn * daysInMonth
  const isOverBudget = projectedSpent > totalBudget
  const variance = Math.abs(projectedSpent - totalBudget)

  return (
    <div
      className="card shadow-sm border-0 h-100 w-100"
      style={{ borderRadius: '24px' }}
    >
      <div className="card-body p-4 d-flex flex-column justify-content-between gap-3">
        <div>
          <div className="d-flex align-items-center justify-content-between mb-3">
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
              <h4 className="m-0 fw-bold">Spending Velocity</h4>
            </div>
            <span
              className={`badge ${isOverBudget ? 'bg-danger-lt text-danger' : 'bg-success-lt text-success'} border-0 px-2`}
            >
              {isOverBudget ? 'Over Projection' : 'On Track'}
            </span>
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <div className="text-secondary small fw-medium">Rata-rata Pengeluaran Harian</div>
              <div className="text-primary fw-bold" style={{ fontSize: '10px' }}>
                Budget: {formatCurrency(totalBudget / daysInMonth)}
              </div>
            </div>
            <div className="h2 fw-bold m-0">
              {formatCurrency(dailyBurn)} <span className="fs-5 text-muted fw-normal">/ hari</span>
            </div>
            <div
              className="progress progress-xs mt-2"
              style={{ height: '6px', background: 'var(--tblr-border-color)' }}
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

          <div className="p-3 rounded-3 bg-surface border border-secondary-subtle shadow-sm mb-3">
            <div className="row g-2">
              <div className="col-6 border-end">
                <div className="text-muted small mb-1">Estimasi Akhir Bulan</div>
                <div className={`fw-bold ${isOverBudget ? 'text-danger' : 'text-body'}`}>
                  {formatCurrency(projectedSpent)}
                </div>
                <div className="text-muted" style={{ fontSize: '9px' }}>
                  Proj. {Math.round((projectedSpent / totalBudget) * 100)}% total
                </div>
              </div>
              <div className="col-6 ps-3">
                <div className="text-muted small mb-1">
                  {isOverBudget ? 'Potensi Defisit' : 'Estimasi Sisa'}
                </div>
                <div className={`fw-bold ${isOverBudget ? 'text-danger' : 'text-success'}`}>
                  {formatCurrency(variance)}
                </div>
                <div className="text-muted" style={{ fontSize: '9px' }}>
                  {isOverBudget ? 'Need adjustment' : 'Good job!'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center justify-content-between mt-2">
          <div className="d-flex align-items-center gap-2 text-secondary small">
            <Icon icon="calendar-stats" size="xs" />
            <span>{daysRemaining} hari tersisa</span>
          </div>
          <div className="text-muted small" style={{ fontSize: '10px' }}>
            Periode: 1 - 31 Mei
          </div>
        </div>
      </div>
    </div>
  )
}
