import React from 'react';
import { Icon, Progress, Badge } from '@/shared/components/ui';
import { type BudgetUtilizationItem } from '../types/budget.types';
import { cn } from '@/shared/utils/cn';

interface BudgetBucketCardProps {
  item: BudgetUtilizationItem;
  className?: string;
}

export const BudgetBucketCard: React.FC<BudgetBucketCardProps> = ({ item, className }) => {
  const remaining = Math.max(0, item.limit - item.spent);
  const isOver = item.spent > item.limit;
  


  const statusColor = isOver ? 'red' : (item.percentage_used > 90 ? 'orange' : 'green');

  return (
    <div className={cn("card card-sm shadow-sm hover:shadow-md transition-all duration-300 border-0", className)}>
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div className={cn(
            "avatar avatar-md rounded me-3 text-white",
            `bg-${item.color || 'blue'}`
          )}>
            <Icon icon={item.icon || 'bucket'} size="lg" />
          </div>
          <div className="flex-fill">
            <div className="font-weight-bold h4 mb-0">{item.name}</div>
            <div className="text-muted small">
              {item.percentage_used}% Terpakai
            </div>
          </div>
          <div className="text-end">
            <Badge color={statusColor} light pill>
              {isOver ? 'Over Budget' : 'On Track'}
            </Badge>
          </div>
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1 small">
            <span className="text-muted">Terpakai: Rp {item.spent.toLocaleString('id-ID')}</span>
            <span className="font-weight-bold">Rp {item.limit.toLocaleString('id-ID')}</span>
          </div>
          <Progress 
            value={item.percentage_used} 
            color={statusColor}
            size="sm"
            animated={item.percentage_used > 90}
          />
        </div>

        <div className="d-flex align-items-center justify-content-between small">
          <div className="text-muted">
            Sisa: <span className={cn("font-weight-black", isOver ? "text-danger" : "text-success")}>
              Rp {remaining.toLocaleString('id-ID')}
            </span>
          </div>
          {isOver && (
            <div className="text-danger d-flex align-items-center">
              <Icon icon="alert-triangle" size="xs" className="me-1" />
              Over limit
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
