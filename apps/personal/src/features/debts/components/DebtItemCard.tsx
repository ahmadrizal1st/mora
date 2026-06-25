import { Icon } from '@/shared/components/ui/Icon'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import type { DebtRecord } from '../types/debt.types'

interface DebtItemCardProps {
  debt: DebtRecord
}

export function DebtItemCard({ debt }: DebtItemCardProps) {
  const isDebt = debt.type === 'Utang'
  const isPaid = debt.status === 'Lunas'
  const remainingAmount = debt.amount - debt.amountPaid
  const progressPercent = debt.amount > 0 ? (debt.amountPaid / debt.amount) * 100 : 0

  const statusBadge = {
    'Belum Lunas': { label: 'Belum Dibayar', class: 'bg-danger-lt text-danger border-danger-subtle' },
    'Sebagian': { label: 'Dicicil', class: 'bg-warning-lt text-warning border-warning-subtle' },
    'Lunas': { label: 'Lunas', class: 'bg-success-lt text-success border-success-subtle' },
    'Menunggu': { label: 'Menunggu', class: 'bg-secondary-lt text-secondary border-secondary-subtle' },
    'Jatuh Tempo': { label: 'Jatuh Tempo', class: 'bg-danger text-white border-danger' },
  }[debt.status] || { label: debt.status, class: 'bg-secondary-lt text-secondary' }

  // Dynamic border color based on type and hover for interactive feel
  const borderColor = isDebt ? 'border-danger' : 'border-success'

  return (
    <div
      className="card shadow-sm border-0 h-100 overflow-hidden"
      style={{
        borderRadius: '12px',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.boxShadow = '0 .5rem 1rem rgba(0,0,0,.15)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 .125rem .25rem rgba(0,0,0,.075)'
      }}
    >
      {/* Decorative top border */}
      <div className={`border-top border-3 ${borderColor}`} style={{ opacity: 0.7 }}></div>

      <div className="card-body p-3 p-md-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-center gap-3">
            <div className="avatar avatar-md rounded-circle bg-secondary-lt text-secondary">
              {debt.personName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="m-0 fw-bold">{debt.personName}</h4>
              <div className="text-muted small d-flex align-items-center gap-1 mt-1">
                <Icon icon="calendar-due" size="xs" />
                Jatuh tempo: {new Date(debt.dueDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
          <span className={`badge border ${statusBadge.class} px-2 py-1`}>
            {statusBadge.label}
          </span>
        </div>

        {debt.notes && (
          <p className="text-muted small mb-3 text-truncate" title={debt.notes}>
            <Icon icon="note" size="xs" className="me-1" />
            {debt.notes}
          </p>
        )}

        <div className="bg-light rounded p-3 mb-0">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="small text-muted fw-medium">
              {isDebt ? 'Sisa Utang:' : 'Sisa Tagihan:'}
            </span>
            <span className={`fw-bold ${isPaid ? 'text-success' : 'text-dark'}`}>
              {formatCurrency(remainingAmount)}
            </span>
          </div>

          <div className="progress progress-sm" style={{ height: '6px' }}>
            <div
              className={`progress-bar ${isPaid ? 'bg-success' : isDebt ? 'bg-danger' : 'bg-success'}`}
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
          
          <div className="d-flex justify-content-between mt-2 small">
            <span className="text-muted" style={{ fontSize: '11px' }}>
              Total: {formatCurrency(debt.amount)}
            </span>
            <span className="text-muted" style={{ fontSize: '11px' }}>
              Dibayar: {formatCurrency(debt.amountPaid)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
