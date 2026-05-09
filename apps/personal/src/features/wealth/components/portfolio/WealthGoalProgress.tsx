import { Icon } from '@/shared/components/ui/Icon';
import { formatCurrency } from '@/shared/utils/currencyUtils';
import { MOCK_WEALTH_GOALS } from '../../data/mockWealthData';

export function WealthGoalProgress() {
  return (
    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
      <div className="card-header border-bottom-0 pt-4">
        <h3 className="card-title fw-bold">Goal Tracking</h3>
      </div>
      <div className="card-body">
        <div className="d-flex flex-column gap-4">
          {MOCK_WEALTH_GOALS.map((goal) => {
            const percent = Math.round((goal.current / goal.target) * 100);
            return (
              <div key={goal.id} className="p-3 rounded-3 bg-body-tertiary border border-dashed">
                <div className="d-flex align-items-center mb-2">
                  <div className="avatar avatar-sm rounded-circle me-3 shadow-none" style={{ background: goal.color + '20', color: goal.color }}>
                    <Icon icon={goal.icon === 'pension' ? 'building-bank' : goal.icon} size="sm" />
                  </div>
                  <div className="flex-fill">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-bold text-body small">{goal.name}</span>
                      <span className="fw-black text-body">{percent}%</span>
                    </div>
                    <div className="progress progress-xs shadow-none" style={{ height: '4px' }}>
                      <div className="progress-bar rounded-pill" style={{ width: `${percent}%`, backgroundColor: goal.color }} />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between text-secondary mt-1" style={{ fontSize: '10px', paddingLeft: '44px' }}>
                  <span>{formatCurrency(goal.current)}</span>
                  <span>Target: {formatCurrency(goal.target)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="card-footer bg-transparent border-0 pt-0 pb-4">
        <button className="btn btn-ghost-primary btn-sm w-100 rounded-pill border-0">Manage Financial Goals</button>
      </div>
    </div>
  );
}
