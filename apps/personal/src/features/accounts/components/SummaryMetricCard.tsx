import { clsx } from 'clsx';
import { Icon } from '@/shared/components/ui/Icon';

interface SummaryMetricCardProps {
  title: string;
  value: string;
  subtext: string;
  icon: string;
  valueColor?: 'success' | 'danger' | 'primary' | 'warning';
}

export function SummaryMetricCard({ title, value, subtext, icon, valueColor }: SummaryMetricCardProps) {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-3">
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className={clsx('avatar avatar-xs rounded bg-body-tertiary', valueColor && `text-${valueColor}`)}>
            <Icon icon={icon} size="xs" />
          </div>
          <div className="text-secondary text-uppercase fw-semibold fs-5">{title}</div>
        </div>
        <div className={clsx('h1 mb-1 fw-bold lh-1', valueColor && `text-${valueColor}`)}>
          {value}
        </div>
        <div className="text-muted small">{subtext}</div>
      </div>
    </div>
  );
}
