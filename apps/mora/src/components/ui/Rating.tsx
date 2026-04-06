import { clsx } from 'clsx'
import { Icon } from './Icon';

export interface RatingProps {
  value?: number;
  count?: number;
  icon?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  id?: string;
  className?: string;
}

export function Rating({
  value = 0,
  count = 5,
  icon = 'star',
  color = 'yellow',
  size,
  id,
  className,
}: RatingProps) {
  const containerClasses = clsx(
    'rating',
    size && `rating-${size}`,
    className
  );

  const iconSizeMap: Record<string, number> = {
    'sm': 14,
    'md': 20,
    'lg': 32,
    'xl': 48,
  };

  const finalIconSize = size ? iconSizeMap[size] || 20 : 20;

  return (
    <div className={containerClasses} id={id} style={{ display: 'inline-flex', gap: '0.125rem' }}>
      {Array.from({ length: count }, (_, i) => {
        const active = i + 1 <= value;
        return (
          <span 
            key={i} 
            className={clsx('rating-item', active && `text-${color}`)}
            style={{ 
              color: active ? undefined : 'var(--tblr-border-color-darker, #e6e7e9)',
              display: 'inline-flex'
            }}
          >
            <Icon 
              icon={icon} 
              filled={true} 
              size={finalIconSize} 
              stroke={1.5}
            />
          </span>
        );
      })}
    </div>
  );
}
