import { Icon } from '@/shared/components/ui/Icon'

interface BudgetOverviewCardProps {
  currentSpend: number
  budgetLimit: number
}

export function BudgetOverviewCard({ currentSpend, budgetLimit }: BudgetOverviewCardProps) {
  const percentage = budgetLimit > 0 ? Math.min((currentSpend / budgetLimit) * 100, 100) : 0
  const isWarning = percentage >= 80
  const isDanger = percentage >= 100

  const color = isDanger ? 'danger' : isWarning ? 'warning' : 'primary'
  
  return (
    <div className="card border-0 rounded-4 shadow-sm">
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="text-secondary text-uppercase fw-semibold" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Batas Anggaran</span>
          <Icon icon="wallet" size={18} className="text-muted" />
        </div>
        
        <div className="d-flex align-items-end justify-content-between mb-2 mt-3">
          <div>
            <div className="fw-bold fs-3 text-body" style={{ letterSpacing: '-0.5px' }}>Rp {currentSpend.toLocaleString('id-ID')}</div>
            <div className="text-secondary" style={{ fontSize: '12px' }}>dari Rp {budgetLimit.toLocaleString('id-ID')}</div>
          </div>
          <div className={`fw-bold text-${color} fs-4`}>
            {Math.round(percentage)}%
          </div>
        </div>

        <div className="progress progress-sm mt-3" style={{ backgroundColor: 'var(--tblr-border-color)' }}>
          <div 
            className={`progress-bar bg-${color}`} 
            style={{ width: `${percentage}%`, borderRadius: '4px' }}
          ></div>
        </div>
        
        <div className="mt-3">
          {isDanger ? (
            <div className="text-danger small d-flex align-items-center gap-1 fw-medium" style={{ fontSize: '12px' }}>
              <Icon icon="alert-circle" size={16} /> Anda telah melebihi batas anggaran!
            </div>
          ) : isWarning ? (
            <div className="text-warning small d-flex align-items-center gap-1 fw-medium" style={{ fontSize: '12px' }}>
              <Icon icon="alert-triangle" size={16} /> Pengeluaran hampir mencapai batas.
            </div>
          ) : (
            <div className="text-success small d-flex align-items-center gap-1 fw-medium" style={{ fontSize: '12px' }}>
              <Icon icon="circle-check" size={16} /> Anggaran Anda masih sangat aman.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
