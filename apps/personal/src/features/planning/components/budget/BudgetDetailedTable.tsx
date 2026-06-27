import { Icon } from '@/shared/components/ui/Icon'
import { useBudgets } from '../../hooks/usePlanning'
import { formatCurrency } from '@/shared/utils/currencyUtils'

export function BudgetDetailedTable() {
  const { data: budgetData } = useBudgets()
  const categories = budgetData?.categories || []

  return (
    <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
      <div className="card-header border-bottom py-3 px-4 bg-surface">
        <h3 className="card-title fw-bold m-0 d-flex align-items-center gap-2">
          <Icon icon="table" size="sm" className="text-primary" />
          Detailed Breakdown
        </h3>
      </div>
      <div className="card-body p-0 m-0">
        <div>
          {categories.length === 0 ? (
            <div className="text-center py-5">
              <div className="empty">
                <div className="empty-icon text-secondary mb-3">
                  <Icon icon="category-2" size={48} stroke={1.5} opacity={0.5} />
                </div>
                <p className="empty-title h4 fw-bold mb-1">Belum Ada Kategori</p>
                <p className="empty-subtitle text-muted small mb-3" style={{ maxWidth: '300px', margin: '0 auto' }}>
                  Anda belum mengatur anggaran kategori apapun.
                </p>
                <div className="empty-action">
                  <button className="btn btn-primary btn-sm rounded-pill">
                    <Icon icon="plus" size={16} className="me-1" /> Buat Anggaran
                  </button>
                </div>
              </div>
            </div>
          ) : (
            categories.map((cat, i) => {
              const remaining = cat.limit - cat.spent
              const isOver = remaining < 0
              const percentage = Math.min(Math.round((cat.spent / cat.limit) * 100), 100)

              return (
                <div 
                  key={cat.id}
                  className="d-flex justify-content-between align-items-center px-4 py-3"
                  style={{ borderBottom: i < categories.length - 1 ? '1px solid #fafafa' : undefined }}
                >
                  <div className="d-flex align-items-center gap-3 flex-grow-1 overflow-hidden me-2">
                    <div
                      className={`d-flex align-items-center justify-content-center bg-${cat.color}-lt text-${cat.color}`}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        flexShrink: 0,
                      }}
                    >
                      <Icon icon={cat.icon as any} size="sm" />
                    </div>
                    <div className="overflow-hidden">
                      <div className="fw-semibold text-truncate" style={{ fontSize: '14px', color: '#1a202c' }}>
                        {cat.name}
                      </div>
                      <div className="d-flex align-items-center gap-1 flex-wrap mt-1" style={{ fontSize: '11px', color: '#a0aec0' }}>
                        <span
                          className={`badge bg-${isOver ? 'danger' : 'success'}-lt text-${isOver ? 'danger' : 'success'} border-0 px-1 py-0`}
                          style={{ fontSize: '10px' }}
                        >
                          {isOver ? 'Over' : 'Safe'}
                        </span>
                        <span className="text-capitalize">&middot; {cat.type}</span>
                        <span>&middot; Limit: {formatCurrency(cat.limit)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-end flex-shrink-0">
                    <div className="fw-bold" style={{ color: '#1a202c', fontSize: '14px' }}>
                      {formatCurrency(cat.spent)}
                    </div>
                    <div className={`mt-1 fw-medium ${isOver ? 'text-danger' : 'text-success'}`} style={{ fontSize: '11px' }}>
                      Sisa: {formatCurrency(Math.abs(remaining))}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
