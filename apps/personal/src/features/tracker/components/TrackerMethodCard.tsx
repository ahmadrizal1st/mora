import { type FC } from 'react';
import { Link } from '@tanstack/react-router';
import { Icon } from '@/shared/components/ui/Icon';

interface TrackerMethod {
  id: string;
  label: string;
  description: string;
  path: string;
  bgColor: string;
  iconColor: string;
  icon: string;
  textColor: string;
}

interface TrackerMethodCardProps {
  method: TrackerMethod;
  index: number;
}

export const TrackerMethodCard: FC<TrackerMethodCardProps> = ({ method, index }) => {
  return (
    <div 
      className="col-6 col-md-4 tracker-animate-fade-in-up"
      style={{ animationDelay: `${0.2 + index * 0.08}s` }}
    >
      <Link
        to={method.path}
        className="card border shadow-sm h-100 text-decoration-none overflow-hidden position-relative"
        style={{ 
          backgroundColor: method.bgColor,
          borderRadius: '12px',
          minHeight: '140px'
        }}
      >
        {/* Background Decoration Icon */}
        <div 
          className="position-absolute"
          style={{ 
            top: '-15px', 
            right: '-15px', 
            width: '120px', 
            height: '120px', 
            backgroundColor: method.textColor === 'white' ? 'rgba(255,255,255,0.15)' : `${method.iconColor}15`,
            borderRadius: '50%',
            zIndex: 0
          }}
        />
        <div 
          className="position-absolute"
          style={{ 
            top: '10px', 
            right: '10px', 
            zIndex: 1,
            opacity: 0.2,
            transform: 'rotate(-15deg)',
            color: method.textColor === 'white' ? '#ffffff' : method.iconColor
          }}
        >
          <Icon icon={method.icon} size={80} stroke={1.5} />
        </div>

        <div className="card-body p-4 position-relative" style={{ zIndex: 2 }}>
          <h3 className={`fw-bold mb-2 text-${method.textColor}`} style={{ fontSize: '1.25rem' }}>
            {method.label}
          </h3>
          <p className={`text-${method.textColor} opacity-75 mb-0`} style={{ maxWidth: '80%' }}>
            {method.description}
          </p>
        </div>
      </Link>
    </div>
  );
};
