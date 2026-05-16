import { clsx } from 'clsx';
import { Icon } from '@/shared/components/ui/Icon';

interface WealthMetricCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: string;
  valueColor?: 'success' | 'danger' | 'primary' | 'warning' | 'purple' | string;
  trend?: { value: string; positive: boolean };
}

export function WealthMetricCard({ title, value, subtext, icon, valueColor, trend }: WealthMetricCardProps) {
  const colorClass = valueColor === 'purple' ? 'purple' : valueColor === 'success' ? 'success' : valueColor === 'danger' ? 'danger' : valueColor || 'primary';
  const textColorClass = `text-${colorClass}`;

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body p-3 d-flex flex-column justify-content-between">
        {/* Header Row */}
        <div className="d-flex justify-content-between align-items-start mb-2 mb-md-4">
          <div
            className={`bg-${colorClass} text-white rounded-2 d-flex align-items-center justify-content-center shadow-sm`}
            style={{ width: '40px', height: '40px' }}
          >
            <Icon icon={icon} color="white" />
          </div>
          {trend && (
            <span className={clsx('badge badge-pill border-0', trend.positive ? 'bg-success-lt text-success' : 'bg-danger-lt text-danger')}>
              {trend.value}
            </span>
          )}
        </div>

        {/* Metrics */}
        <div className="mt-auto">
          <div className={clsx('h1 mb-1 fw-bold h1-mobile', textColorClass)}>{value}</div>
          <div className="d-flex align-items-center justify-content-between">
            <div className="subheader text-secondary m-0 text-mobile-xs">{title}</div>
            <div className="text-secondary small opacity-75" style={{ fontSize: '0.7rem' }}>{subtext}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
