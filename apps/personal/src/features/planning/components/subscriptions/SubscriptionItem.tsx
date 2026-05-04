import React from 'react';
import { formatCurrency } from '@/shared/utils/currencyUtils';
import { Icon } from '@/shared/components/ui/Icon';
import { clsx } from 'clsx';

interface SubscriptionItemProps {
  subscription: {
    id: string;
    name: string;
    amount: number;
    dueDate: string;
    status: 'upcoming' | 'paid' | 'unpaid';
    icon: string;
    color: string;
  };
}

export function SubscriptionItem({ subscription }: SubscriptionItemProps) {
  const date = new Date(subscription.dueDate);
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });

  return (
    <div className="card border-0 shadow-sm" style={{ borderRadius: '12px' }}>
      <div className="card-body p-3">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <div 
              className="p-2 rounded-circle d-flex align-items-center justify-content-center" 
              style={{ backgroundColor: `${subscription.color}15`, color: subscription.color }}
            >
              <Icon icon={subscription.icon as any} size="sm" />
            </div>
            <div>
              <div className="fw-bold text-dark">{subscription.name}</div>
              <div className="text-secondary small">{day} {month} 2026</div>
            </div>
          </div>
          <div className="text-end">
            <div className="fw-bold">{formatCurrency(subscription.amount)}</div>
            <div className={clsx(
              'badge rounded-pill mt-1',
              subscription.status === 'upcoming' && 'bg-warning-lt',
              subscription.status === 'paid' && 'bg-success-lt',
              subscription.status === 'unpaid' && 'bg-danger-lt'
            )}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
