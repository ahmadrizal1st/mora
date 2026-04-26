// src/components/parts/QuickActions.tsx
import { Icon } from '../ui/Icon';
import { clsx } from 'clsx';

export function QuickActions() {
  const actions = [
    { label: 'Top Up', icon: 'square-plus' },
    { label: 'Transfer', icon: 'coin' },
    { label: 'Request', icon: 'arrow-down-left' },
    { label: 'History', icon: 'clock' },
  ];

  return (
    <div className="card border-0 bg-primary mb-0">
      <div className="card-body p-1">
        <div className="row g-0">
          {actions.map((a, i) => (
            <div key={i} className={clsx("col-3 text-center py-1", i < actions.length - 1 && "border-end border-white-50")}>
              <div style={{ cursor: 'pointer' }} className="d-flex flex-column align-items-center">
                <div className="mb-0">
                  <Icon icon={a.icon} color="white" size="sm" />
                </div>
                <div className="subheader text-white fw-bold" style={{ fontSize: '0.6rem', textTransform: 'none' }}>{a.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
