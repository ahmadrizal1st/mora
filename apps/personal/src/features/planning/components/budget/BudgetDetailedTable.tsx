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
      <div className="table-responsive">
        <table className="table table-vcenter card-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Allocated</th>
              <th>Spent</th>
              <th>Usage</th>
              <th>Remaining</th>
              <th className="w-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const remaining = cat.limit - cat.spent
              const isOver = remaining < 0
              const percentage = Math.min(Math.round((cat.spent / cat.limit) * 100), 100)

              return (
                <tr key={cat.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
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
                      <div>
                        <div className="fw-bold text-body">{cat.name}</div>
                        <div className="text-muted small text-capitalize">{cat.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-secondary">{formatCurrency(cat.limit)}</td>
                  <td className="fw-bold">{formatCurrency(cat.spent)}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2" style={{ minWidth: '120px' }}>
                      <div className="progress progress-xs flex-fill" style={{ height: '6px' }}>
                        <div
                          className={`progress-bar bg-${isOver ? 'danger' : 'primary'}`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="small fw-bold">{percentage}%</span>
                    </div>
                  </td>
                  <td className={isOver ? 'text-danger fw-bold' : 'text-success fw-medium'}>
                    {formatCurrency(Math.abs(remaining))}
                    {isOver && <span className="ms-1 small">over</span>}
                  </td>
                  <td>
                    <span
                      className={`badge bg-${isOver ? 'danger' : 'success'}-lt text-${isOver ? 'danger' : 'success'} border-0`}
                    >
                      {isOver ? 'Over' : 'Safe'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
