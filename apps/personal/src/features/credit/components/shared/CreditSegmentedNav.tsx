import { Link, useLocation } from '@tanstack/react-router';
import { Icon } from '@/shared/components/ui';

export function CreditSegmentedNav() {
  const location = useLocation();
  const tabs = [
    { id: 'overview',     label: 'Overview',      icon: 'layout-dashboard', to: '/credit/overview' },
    { id: 'credit-card',  label: 'Credit Card',   icon: 'credit-card',    badge: '2',    badgeColor: 'azure', to: '/credit/credit-card' },
    { id: 'kta',          label: 'KTA / Pinjaman', icon: 'building-bank',  badge: '1',    badgeColor: 'primary', to: '/credit/kta' },
    { id: 'kpr',          label: 'KPR / Mortgage', icon: 'home',           badge: '1',    badgeColor: 'warning', to: '/credit/kpr' },
    { id: 'paylater',     label: 'Paylater',       icon: 'clock-dollar',   badge: '3',    badgeColor: 'green', to: '/credit/paylater' },
  ] as const;

  return (
    <div className="mb-4 d-flex justify-content-center">
      <div 
        className="p-1 d-inline-flex bg-body-tertiary rounded-3" 
        style={{ 
          backgroundColor: '#f4f6fa',
          border: '1px solid rgba(0,0,0,0.04)',
          padding: '2px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <div className="d-flex flex-nowrap" role="tablist">
          {tabs.map((tab) => {
            const isActive = location.pathname.includes(tab.id) || (tab.id === 'overview' && location.pathname === '/credit');
            return (
              <Link
                key={tab.id}
                to={tab.to}
                className="border-0 d-flex align-items-center justify-content-center gap-2 px-3 py-1 fw-bold transition-all text-decoration-none"
                style={{
                  borderRadius: '6px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  outline: 'none',
                  height: '32px',
                  backgroundColor: isActive ? '#ffffff' : 'transparent',
                  color: isActive ? '#1e293b' : '#64748b',
                  border: isActive ? '1px solid #e6e8eb' : '1px solid transparent',
                  boxShadow: isActive ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
                  margin: '1px'
                }}
                role="tab"
                aria-selected={isActive}
              >
                <Icon icon={tab.icon as any} size={15} />
                <span className="d-none d-md-inline">{tab.label}</span>
                <span className="d-md-none">{tab.label.split(' ')[0]}</span>
                {tab.badge && (
                  <span
                    className={`badge bg-${tab.badgeColor} text-white border-0 rounded-pill ms-1`}
                    style={{ fontSize: '8px', padding: '1px 5px' }}
                  >
                    {tab.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
