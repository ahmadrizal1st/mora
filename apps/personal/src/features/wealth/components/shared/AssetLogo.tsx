import { clsx } from 'clsx';
import { Icon } from '@/shared/components/ui/Icon';

interface AssetLogoProps {
  ticker: string;
  name: string;
  type?: string;
  color?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  logoUrl?: string;
}

export function AssetLogo({ ticker, name, type, color, size = 'sm', className, logoUrl }: AssetLogoProps) {
  const avatarSizeClass = clsx(
    'avatar rounded-4 shadow-none border-0 overflow-hidden',
    size === 'xs' && 'avatar-xs',
    size === 'sm' && 'avatar-sm',
    size === 'md' && 'avatar-md',
    size === 'lg' && 'avatar-lg',
    className
  );

  // Fallback icon based on type
  let iconName = '';
  if (type === 'kripto') iconName = 'brand-bitcoin';
  if (type === 'emas') iconName = 'coins';
  if (type === 'reksadana') iconName = 'chart-pie';
  if (type === 'obligasi') iconName = 'file-certificate';

  // Deterministic background if no color provided
  const getFallbackColor = () => {
    if (color) return color;
    const colors = ['#206bc4', '#4299e1', '#4263eb', '#ae3ec9', '#d6336c', '#f76707', '#0ca678'];
    const charCode = ticker.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
  };

  if (logoUrl) {
    return (
      <div className={clsx(avatarSizeClass, 'bg-white')}>
        <img src={logoUrl} alt={name} className="w-100 h-100 object-fit-contain p-1" />
      </div>
    );
  }

  return (
    <div 
      className={avatarSizeClass} 
      style={{ backgroundColor: getFallbackColor(), color: '#fff' }}
    >
      {iconName ? (
        <Icon icon={iconName} size={size === 'xs' ? 'xxs' : 'xs'} stroke={2.5} />
      ) : (
        <span className="fw-black" style={{ fontSize: size === 'xs' ? '9px' : '11px' }}>
          {ticker.substring(0, 2)}
        </span>
      )}
    </div>
  );
}
