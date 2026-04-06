interface SmallStats3CardProps {
  number?: string | number;
  title?: string;
  percentage?: number;
}

export function SmallStats3Card({
  number = '0',
  title = 'Stat',
  percentage = 0,
}: SmallStats3CardProps) {
  const trendColor = percentage > 0 ? 'text-green' : percentage < 0 ? 'text-red' : '';
  const trendIcon = percentage > 0 ? '↑' : percentage < 0 ? '↓' : '';
  
  return (
    <div className="card">
      <div className="card-body p-2 text-center">
        <div className={`text-end ${trendColor}`}>
          {trendIcon} {percentage !== 0 ? `${Math.abs(percentage)}%` : ''}
        </div>
        <div className="h1 m-0">{number}</div>
        <div className="text-secondary mb-3">{title}</div>
      </div>
    </div>
  );
}
