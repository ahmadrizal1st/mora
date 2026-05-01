import React from 'react';
import { Icon, Badge, Progress } from '@/shared/components/ui';
import { type BudgetPlan, type BudgetUtilization } from '../types/budget.types';
import { BUDGET_METHODS_INFO } from '../constants/budget.constants';
import dayjs from 'dayjs';

interface BudgetPlanCardProps {
  plan: BudgetPlan;
  utilization?: BudgetUtilization;
  onClick?: () => void;
  onEdit?: (e: React.MouseEvent) => void;
  onDelete?: (e: React.MouseEvent) => void;
}

export const BudgetPlanCard: React.FC<BudgetPlanCardProps> = ({ 
  plan, 
  utilization, 
  onClick, 
  onEdit, 
  onDelete 
}) => {
  const methodInfo = BUDGET_METHODS_INFO[plan.budget_method] || { title: plan.budget_method, description: '' };
  const startDate = dayjs(plan.start_date);
  const endDate = dayjs(plan.end_date);
  const today = dayjs();

  let status: 'active' | 'upcoming' | 'completed' = 'active';
  if (today.isBefore(startDate)) status = 'upcoming';
  else if (today.isAfter(endDate)) status = 'completed';

  const statusBadge = {
    active: <Badge color="green" pill>Aktif</Badge>,
    upcoming: <Badge color="blue" pill>Mendatang</Badge>,
    completed: <Badge color="gray" pill>Selesai</Badge>,
  }[status];

  const totalSpent = utilization?.items.reduce((sum, item) => sum + item.spent, 0) || 0;
  const progress = plan.income_baseline > 0 ? (totalSpent / plan.income_baseline) * 100 : 0;

  return (
    <div 
      className="card card-stacked cursor-pointer hover:shadow-md transition-all border-hover-primary"
      onClick={onClick}
    >
      {status === 'active' && <div className="ribbon bg-green">Aktif</div>}
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div className="avatar bg-primary-lt rounded">
            <Icon icon="wallet" />
          </div>
          <div className="ms-3 flex-fill">
            <div className="font-weight-bold h3 mb-0">{plan.name}</div>
            <div className="text-muted small">{methodInfo.title}</div>
          </div>
          <div className="dropdown" onClick={(e) => e.stopPropagation()}>
            <button className="btn btn-ghost-secondary btn-icon border-0" data-bs-toggle="dropdown">
              <Icon icon="dots-vertical" />
            </button>
            <div className="dropdown-menu dropdown-menu-end">
              <button className="dropdown-item" onClick={onEdit}>
                <Icon icon="edit" className="me-2" size="sm" /> Edit Plan
              </button>
              <button className="dropdown-item text-danger" onClick={onDelete}>
                <Icon icon="trash" className="me-2" size="sm" /> Hapus Plan
              </button>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between mb-1 small">
            <span className="text-muted">
              <Icon icon="calendar" size="xs" className="me-1" />
              {startDate.format('D MMM')} - {endDate.format('D MMM YYYY')}
            </span>
            {statusBadge}
          </div>
        </div>

        <div className="mt-4">
          <div className="d-flex justify-content-between mb-1 small">
            <span className="text-muted">Pemakaian Total</span>
            <span className="font-weight-bold">
              Rp {totalSpent.toLocaleString('id-ID')} / Rp {Number(plan.income_baseline).toLocaleString('id-ID')}
            </span>
          </div>
          <Progress value={progress} color={progress > 90 ? 'red' : 'primary'} size="sm" />
        </div>
      </div>
    </div>
  );
};
