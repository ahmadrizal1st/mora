import { Icon } from '@/shared/components/ui/Icon'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import clsx from 'clsx'

interface BudgetAllocationCardProps {
  title: string
  subtitle: string
  icon: any
  iconColor: string
  badgeLabel: string
  items: any[]
  totalLimit: number
  totalSpent: number
}

export function BudgetAllocationCard({ title, subtitle, icon, iconColor, badgeLabel, items, totalLimit, totalSpent }: BudgetAllocationCardProps) {
  const sisaLimit = totalLimit - totalSpent
  const isOverbudget = totalSpent > totalLimit

  return (
    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px', overflow: 'hidden' }}>
      <div className="card-header border-bottom py-3 px-4 bg-transparent d-flex align-items-center gap-3">
        <div className={`avatar avatar-sm rounded bg-${iconColor} text-white shadow-sm d-flex align-items-center justify-content-center`} style={{ width: '40px', height: '40px' }}>
          <Icon icon={icon} size="md" />
        </div>
        <div>
          <h4 className="fw-bold m-0 text-body" style={{ fontSize: '1rem' }}>
            {title}
          </h4>
          <div className="text-muted small" style={{ fontSize: '12px' }}>
            {subtitle}
          </div>
        </div>
      </div>
      
      <div className="card-body p-0">
        <div className="d-flex flex-column">
          {items.map((cat, idx) => (
            <div key={cat.id} className={clsx("p-3 px-4 d-flex justify-content-between align-items-center", idx !== items.length - 1 && "border-bottom")} style={{ borderColor: 'var(--tblr-border-color)' }}>
              <div>
                <div className="fw-bold text-body mb-1" style={{ fontSize: '14px' }}>
                  {cat.name}
                </div>
                <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: '11px' }}>
                  <span className={`badge bg-${iconColor}-lt text-${iconColor} px-2 py-1 border-0`} style={{ fontSize: '10px' }}>
                    {badgeLabel}
                  </span>
                  <span>&middot;</span>
                  <span>{cat.percentage_used}% Terpakai</span>
                </div>
              </div>
              <div className="text-end">
                <div className="fw-bold text-body mb-1" style={{ fontSize: '14px' }}>
                  {formatCurrency(cat.spent)}
                </div>
                <div className="text-muted" style={{ fontSize: '11px' }}>
                  dari {formatCurrency(cat.limit)}
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-muted small text-center py-5">Belum ada anggaran {title}</div>
          )}
        </div>
      </div>
      
      <div className="card-footer bg-transparent p-4 border-top">
        <div className="d-flex justify-content-between mb-2">
          <span className="text-muted small" style={{ fontSize: '12px' }}>Total Limit Anggaran</span>
          <span className="fw-bold text-body" style={{ fontSize: '13px' }}>{formatCurrency(totalLimit)}</span>
        </div>
        <div className="d-flex justify-content-between mb-3">
          <span className="text-muted small" style={{ fontSize: '12px' }}>Total Pengeluaran Berjalan</span>
          <span className="fw-bold text-danger" style={{ fontSize: '13px' }}>{formatCurrency(totalSpent)}</span>
        </div>
        <div className="d-flex justify-content-between pt-3 border-top">
          <span className="text-muted small" style={{ fontSize: '12px' }}>Sisa Limit Tersedia</span>
          <span className={`fw-bold text-${isOverbudget ? 'danger' : 'success'}`} style={{ fontSize: '13px' }}>
            {isOverbudget ? `-${formatCurrency(Math.abs(sisaLimit))}` : formatCurrency(sisaLimit)}
          </span>
        </div>
      </div>
    </div>
  )
}
