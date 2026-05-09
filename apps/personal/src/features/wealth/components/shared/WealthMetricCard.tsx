import { clsx } from 'clsx';
import { Icon } from '@/shared/components/ui/Icon';

interface WealthMetricCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: string;
  valueColor?: 'success' | 'danger' | 'primary' | 'warning' | 'purple';
  trend?: { value: string; positive: boolean };
}

export function WealthMetricCard({ title, value, subtext, icon, valueColor, trend }: WealthMetricCardProps) {
  const colorClass = valueColor === 'purple' ? 'text-purple' : valueColor === 'success' ? 'text-success' : valueColor === 'danger' ? 'text-danger' : valueColor ? `text-${valueColor}` : '';
  
  return (
    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className={clsx('avatar avatar-xs rounded-circle bg-body-tertiary shadow-none', colorClass)}>
              <Icon icon={icon} size="xs" />
            </div>
            <div className="text-secondary text-uppercase fw-bold text-ls-sm" style={{ fontSize: '10px' }}>{title}</div>
          </div>
          {trend && (
            <span className={clsx('badge', trend.positive ? 'bg-success-lt text-success' : 'bg-danger-lt text-danger')}>
              {trend.value}
            </span>
          )}
        </div>
        <div className={clsx('h1 mb-1 fw-black metric-value lh-1', colorClass)}>
          {value}
        </div>
        <div className="text-muted small fw-medium" style={{ fontSize: '11px' }}>{subtext}</div>
      </div>
    </div>
  );
}
