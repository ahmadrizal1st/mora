import { formatCurrency } from '@/shared/utils/currencyUtils'
import { clsx } from 'clsx'
import { Icon } from '@/shared/components/ui/Icon'

interface BudgetCategoryItemProps {
  category: {
    id: string
    name: string
    limit: number
    spent: number
    icon: string
    color: string
  }
}

export function BudgetCategoryItem({ category }: BudgetCategoryItemProps) {
  const percentage = Math.round((category.spent / category.limit) * 100)
  const isOver = percentage > 100

  return (
    <div
      className="card shadow-none h-100 transition-all"
      style={{ borderRadius: '12px', backgroundColor: '#f4f6fa', border: '1px solid #e6e9ef' }}
    >
      <div className="card-body p-3 d-flex flex-column gap-2">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center text-secondary"
              style={{ width: '24px', height: '24px', flexShrink: 0 }}
            >
              <Icon icon={category.icon as any} size="sm" />
            </div>
            <div>
              <span className="fw-semibold text-body d-block lh-1" style={{ fontSize: '0.8rem' }}>{category.name}</span>
            </div>
          </div>
          <div className="text-end">
            <span className="text-secondary lh-1" style={{ fontSize: '0.7rem' }}>
              Budget: {formatCurrency(category.limit)}
            </span>
          </div>
        </div>

        <div
          className="progress progress-xs"
          style={{ height: '4px', background: 'var(--tblr-border-color)' }}
        >
          <div
            className={clsx(
              'progress-bar rounded-pill',
              isOver ? 'bg-danger' : `bg-${category.color}`
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex flex-column gap-1">
            <span className="text-body fw-bold d-block lh-1" style={{ fontSize: '0.85rem' }}>
              {formatCurrency(category.spent)}
            </span>
            <span className={clsx("small d-block lh-1", isOver ? "text-danger" : "text-primary")} style={{ fontSize: '0.7rem', fontWeight: 600 }}>
              {percentage}%
            </span>
          </div>
          <div className="text-end">
            <span
              className={clsx(
                'px-2 py-1 rounded-pill d-block lh-1',
                isOver ? 'bg-danger-lt text-danger' : 'bg-success-lt text-success'
              )}
              style={{ fontSize: '0.7rem', fontWeight: 600 }}
            >
              {isOver
                ? `Over ${formatCurrency(category.spent - category.limit)}`
                : `Sisa ${formatCurrency(category.limit - category.spent)}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
