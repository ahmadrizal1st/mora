import { clsx } from 'clsx';
import { Icon } from '@/shared/components/ui/Icon';

interface AccountCardProps {
  isActive?: boolean;
  type: string;
  name: string;
  balance: string;
  delta: string;
  chgPos?: boolean;
  logo?: string;
  color?: string;
  onClick: () => void;
}

export function AccountCard({ isActive, type, name, balance, delta, chgPos, logo, color, onClick }: AccountCardProps) {
  const isBank = type.toLowerCase().includes('bank');
  const isInvest = ['invest', 'bibit', 'ajaib', 'bareksa', 'reksa'].some(k => type.toLowerCase().includes(k));
  const isCash = type.toLowerCase().includes('tunai') || type.toLowerCase().includes('cash');

  const typeIcon = isBank ? 'building-bank' : isInvest ? 'trending-up' : isCash ? 'cash' : 'wallet';
  const badgeStyle = { width: '26px', height: '26px', color: 'white' };

  return (
    <div 
      className={clsx(
        'card cursor-pointer transition-all h-100',
        isActive ? 'border-primary shadow-sm' : 'border-transparent shadow-sm'
      )}
      style={{ 
        minWidth: '220px',
        backgroundColor: isActive ? 'var(--tblr-primary-lt)' : undefined
      }}
      onClick={onClick}
    >
      <div className="card-body p-3 d-flex flex-column h-100">
        <div className="d-flex align-items-center justify-content-between mb-3">
          {logo ? (
            <img 
              src={logo} 
              alt={type}
              style={{ width: '48px', height: '28px', objectFit: 'contain', objectPosition: 'left' }}
            />
          ) : (
            <div 
              className={clsx('d-flex align-items-center justify-content-center text-white shadow-sm', color ? `bg-${color}` : 'bg-primary')}
              style={{ borderRadius: '10px', width: '32px', height: '32px' }}
            >
              <Icon icon={isBank ? 'building-bank' : 'wallet'} size="sm" />
            </div>
          )}
          <span className={clsx('badge d-flex align-items-center justify-content-center rounded-circle p-1 shadow-sm', color ? `bg-${color}` : 'bg-primary')} style={badgeStyle}>
            <Icon icon={typeIcon} size={14} />
          </span>
        </div>
        <div className="fw-bold text-body text-truncate mb-0">{name}</div>
        <div className="text-secondary small mb-3">{type}</div>
        <div className="mt-auto">
          <div className="h2 fw-bold mb-1 font-monospace">{balance}</div>
          <div className={clsx('small fw-medium d-flex align-items-center gap-1', chgPos ? 'text-success' : 'text-danger')}>
            <Icon icon={chgPos ? 'trending-up' : 'trending-down'} size="xxs" />
            {delta} bulan ini
          </div>
        </div>
      </div>
    </div>
  );
}
