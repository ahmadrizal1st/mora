import { useMemo } from 'react';
import { Icon } from '@/shared/components/ui/Icon';
import { Chart } from '@/shared/components/ui/Chart';

interface VisualStatCardProps {
  title: string;
  value: string;
  trendPercentage: string;
  trendAbsolute: string;
  icon: string;
  isPositive?: boolean;
}

export function VisualStatCard({
  title,
  value,
  trendAbsolute,
  icon,
  isPositive = true,
}: VisualStatCardProps) {

  // Generate a random-looking path for the sparkline so each card is visually distinct
  const chartData = useMemo(() => {
    // Use a hardcoded pattern that perfectly matches the reference image's sparkline curve
    const basePattern = [
      10, 10, 12, 16, 13, 8, 8, 10, 26, 12, 
      10, 10, 12, 22, 19, 15, 12, 12, 10, 8, 
      16, 65, 35, 20, 18, 22, 18, 8, 18, 16, 
      14, 25, 20, 15, 8, 12, 15, 15, 25, 35
    ];
    
    // Slightly offset the scale per card so the exact shape is maintained but absolute values vary
    const offset = (title.length % 5) + 1;
    const data = basePattern.map(val => val * offset);

    return {
      type: 'area' as const,
      sparkline: true,
      height: 4, // 64px compact height
      strokeWidth: [2],
      series: [
        {
          name: title,
          color: isPositive ? 'primary' : 'danger',
          data: data
        }
      ]
    };
  }, [title, isPositive]);

  return (
    <div className="card shadow-sm border-0 h-100 overflow-hidden">
      <div className="card-body p-0 d-flex flex-column h-100 justify-content-between">
        
        <div className="p-3 pb-2 z-1">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center gap-2">
              <div className={`bg-${isPositive ? 'primary' : 'secondary'}-lt text-${isPositive ? 'primary' : 'secondary'} rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '24px', height: '24px' }}>
                <Icon icon={icon} size="xs" />
              </div>
              <div className="fw-medium text-dark small">{title}</div>
            </div>
            <div className="dropdown">
              <a
                href="#"
                className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
                data-bs-toggle="dropdown"
                style={{ fontSize: '0.65rem' }}
              >
                <span className="text-decoration-underline-hover">Last 7 days</span>
                <Icon icon="chevron-down" size="xxs" />
              </a>
              <div className="dropdown-menu dropdown-menu-end">
                <button className="dropdown-item">Last 7 days</button>
                <button className="dropdown-item">Last 30 days</button>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-end mt-1">
            <h2 className="mb-0 fw-bold lh-1">{value}</h2>
            <div className="text-muted small">
              <span className={isPositive ? 'text-primary fw-bold' : 'text-danger fw-bold'}>{trendAbsolute}</span> than last week
            </div>
          </div>
        </div>

        {/* Embedded Edge-to-Edge Sparkline Chart */}
        <div className="mt-auto position-relative" style={{ zIndex: 0, marginTop: '-1rem' }}>
          <Chart
            chartId={`stat-sparkline-${title.replace(/[\s&]+/g, '-').toLowerCase()}`}
            chartData={chartData}
          />
        </div>

      </div>
    </div>
  );
}
