// src/components/cards/SparklineStatCard.tsx
import { Trending } from '../ui/Trending';
import { Icon } from '../ui/Icon';
import type { ChartSerie } from '../ui/Chart';

interface SparklineStatCardProps {
  title?: string;
  value?: string;
  trendValue?: number;
  series?: ChartSerie[];
  color?: string;
  chartType?: 'area' | 'bar' | 'line';
  icon?: string;
  filterLabel?: string;
}

export function SparklineStatCard({
  title = 'Stats',
  value = '0',
  trendValue = 0,
  icon = 'coin',
  color = 'primary',
  filterLabel = 'Last 7 days',
}: SparklineStatCardProps) {
  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body p-3">
        {/* Header Row */}
        <div className="d-flex justify-content-between align-items-start mb-2 mb-md-4">
          <div
            className={`bg-${color} text-white rounded-2 d-flex align-items-center justify-content-center shadow-sm`}
            style={{ width: '40px', height: '40px' }}
          >
            <Icon icon={icon} color="white" />
          </div>
          <div className="dropdown">
            <a
              className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
              href="#"
              data-bs-toggle="dropdown"
            >
              <span className="text-decoration-underline-hover">{filterLabel}</span>
              <Icon icon="chevron-down" size="xs" />
            </a>
            <div className="dropdown-menu dropdown-menu-end">
              <button className="dropdown-item">Last 7 days</button>
              <button className="dropdown-item">Last 30 days</button>
            </div>
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="mb-2">
          <Trending value={trendValue} isBadge />
        </div>

        {/* Metrics */}
        <div>
          <div className="h1 mb-1 fw-bold h1-mobile">{value}</div>
          <div className="subheader text-secondary m-0 text-mobile-xs">{title}</div>
        </div>
      </div>
    </div>
  );
}
