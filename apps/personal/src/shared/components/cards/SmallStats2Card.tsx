interface SmallStats2CardProps {
  title?: string;
  count?: string;
  growth?: number;
  description?: string;
  icon?: string;
  color?: string;
  light?: boolean;
}

export function SmallStats2Card({
  title = 'Customers',
  count = '1,850',
  growth = 0,
  description = 'Since last month',
  color,
  light,
}: SmallStats2CardProps) {
  const trendColor = growth > 0 ? 'green' : growth < 0 ? 'red' : 'grey';
  const trendIcon = growth > 0 ? '↑' : growth < 0 ? '↓' : '—';
  
  return (
    <div className="card">
      <div className="card-body">
        <div className={`float-end avatar${color ? ` bg-${color}${light ? '-lt' : ' text-white'}` : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="icon" width="24" height="24"
            viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <circle cx="12" cy="7" r="4" />
            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
          </svg>
        </div>
        <div className="text-secondary fw-normal mt-0">{title}</div>
        <h3 className="h2 mt-2 mb-3">{count}</h3>
        <p className="mb-0 text-secondary">
          <span className={`text-${trendColor} me-1`}>{trendIcon} {Math.abs(growth)}%</span>
          <span className="text-nowrap">{description}</span>
        </p>
      </div>
    </div>
  );
}
