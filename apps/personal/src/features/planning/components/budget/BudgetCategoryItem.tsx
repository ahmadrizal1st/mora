import React from 'react';
import { formatCurrency } from '@/shared/utils/currencyUtils';
import { Icon } from '@/shared/components/ui/Icon';
import { clsx } from 'clsx';

interface BudgetCategoryItemProps {
  category: {
    id: string;
    name: string;
    limit: number;
    spent: number;
    icon: string;
    color: string;
  };
}

export function BudgetCategoryItem({ category }: BudgetCategoryItemProps) {
  const percentage = Math.round((category.spent / category.limit) * 100);
  const isOver = percentage > 100;

  return (
    <div className="card shadow-none border bg-light-lt h-100 transition-all" style={{ borderRadius: '12px', background: 'rgba(248, 250, 252, 0.4)' }}>
      <div className="card-body p-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-3">
            <div className={`avatar avatar-xs rounded bg-${category.color}-lt text-${category.color} shadow-none`}>
              <Icon icon={category.icon as any} size="xs" />
            </div>
            <div>
              <span className="fw-bold small text-dark d-block lh-1 mb-1">{category.name}</span>
              <span className="text-secondary" style={{ fontSize: '10px' }}>Budget {formatCurrency(category.limit)}</span>
            </div>
          </div>
          <div className="text-end">
            <span className={clsx('fw-bold small d-block lh-1 mb-1', isOver ? 'text-danger' : 'text-primary')}>
              {percentage}%
            </span>
          </div>
        </div>
        
        <div className="progress progress-xs mb-2" style={{ height: '6px', background: '#e2e8f0' }}>
          <div 
            className={clsx('progress-bar rounded-pill', isOver ? 'bg-danger' : `bg-${category.color}`)} 
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>

        <div className="d-flex justify-content-between align-items-center mt-1">
          <div>
            <span className="text-dark fw-bold d-block lh-1" style={{ fontSize: '13px' }}>
              {formatCurrency(category.spent)}
            </span>
            <span className="text-muted" style={{ fontSize: '9px' }}>Realisasi Bulan Ini</span>
          </div>
          <div className="text-end">
            <span className={clsx('small px-2 py-0 rounded-pill d-block mb-1', isOver ? 'bg-danger-lt text-danger' : 'bg-success-lt text-success')} style={{ fontSize: '10px', fontWeight: 600 }}>
              {isOver ? `Over ${formatCurrency(category.spent - category.limit)}` : `Sisa ${formatCurrency(category.limit - category.spent)}`}
            </span>
            <span className="text-muted" style={{ fontSize: '9px' }}>{isOver ? 'Tinjau Anggaran' : 'Kondisi Aman'}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
