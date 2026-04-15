import { Avatar } from '../ui/Avatar';

interface StatGradientCardProps {
  title?: string;
  value?: string;
  color?: string;
  icon?: string;
  progress?: number;
}

export function StatGradientCard({
  title = 'Total',
  value = '0',
  color = 'primary',
  icon = 'trending-up',
  progress = 0,
}: StatGradientCardProps) {
  return (
    <div className={`card card-gradient card-gradient-${color} card-gradient-start`}>
      <div className="card-body">
        <div className="row g-3">
          <div className="col">
            <h4 className="subheader mb-1">{title}</h4>
            <div className="h3 m-0">{value}</div>
          </div>
          <div className="col-auto">
            <Avatar icon={icon} color={color} />
          </div>
          <div className="col-12">
            <div className="progress progress-sm">
              <div className={`progress-bar bg-${color}`} style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
