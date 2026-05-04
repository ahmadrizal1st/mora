import React from 'react';
import { formatCurrency } from '@/shared/utils/currencyUtils';
import { Icon } from '@/shared/components/ui/Icon';

interface GoalCardProps {
  goal: {
    id: string;
    name: string;
    target: number;
    saved: number;
    eta: string;
    monthlyDeposit: number;
    icon: string;
    color: string;
  };
}

export function GoalCard({ goal }: GoalCardProps) {
  const percentage = Math.round((goal.saved / goal.target) * 100);

  return (
    <div className="card border-0 shadow-sm transition-all overflow-hidden h-100" style={{ borderRadius: '16px' }}>
      <div className="card-body p-4 d-flex flex-column h-100">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div 
            className="p-3 rounded-circle d-flex align-items-center justify-content-center" 
            style={{ backgroundColor: `${goal.color}15`, color: goal.color }}
          >
            <Icon icon={goal.icon as any} size="md" />
          </div>
          {/* Circular Progress Ring */}
          <div className="position-relative d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" fill="none" stroke="#f1f4f9" strokeWidth="4" />
              <circle 
                cx="24" cy="24" r="20" fill="none" 
                stroke={goal.color} 
                strokeWidth="4" 
                strokeDasharray="125.6" 
                strokeDashoffset={125.6 - (125.6 * percentage) / 100} 
                strokeLinecap="round"
                transform="rotate(-90 24 24)"
              />
            </svg>
            <div className="position-absolute small fw-bold" style={{ fontSize: '10px' }}>{percentage}%</div>
          </div>
        </div>

        <h4 className="fw-bold mb-1 fs-3">{goal.name}</h4>
        <div className="text-secondary small mb-3">Target: {formatCurrency(goal.target)}</div>
        
        <div className="mt-auto">
          <div className="bg-light p-3 rounded-3" style={{ backgroundColor: 'var(--tblr-bg-surface-secondary, #f6f8fb)' }}>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary small">Terkumpul</span>
              <span className="fw-bold small">{formatCurrency(goal.saved)}</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary small">Estimasi</span>
              <span className="fw-bold small text-primary">{goal.eta}</span>
            </div>
            <div className="border-top pt-2 mt-2">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-secondary small fw-medium">Saran Setor</span>
                <span className="badge bg-success-lt fw-bold">{formatCurrency(goal.monthlyDeposit)}/bln</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
