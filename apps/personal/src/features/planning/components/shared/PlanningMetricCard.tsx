import { clsx } from 'clsx';
import { Icon } from '@/shared/components/ui/Icon';

interface PlanningMetricCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: string;
  valueColor?: 'success' | 'danger' | 'primary' | 'warning';
}

export function PlanningMetricCard({ title, value, subtext, icon, valueColor }: PlanningMetricCardProps) {
  return (
    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className={clsx('avatar avatar-xs rounded-circle bg-light shadow-none', valueColor && `text-${valueColor}`)}>
            <Icon icon={icon} size="xs" />
          </div>
          <div className="text-secondary text-uppercase fw-bold text-ls-sm" style={{ fontSize: '10px' }}>{title}</div>
        </div>
        <div className={clsx('h1 mb-1 fw-black metric-value lh-1', valueColor && `text-${valueColor}`)}>
          {value}
        </div>
        <div className="text-muted small fw-medium" style={{ fontSize: '11px' }}>{subtext}</div>
      </div>
    </div>

  );
}
