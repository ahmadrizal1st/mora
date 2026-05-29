import { Link, useLocation } from '@tanstack/react-router';

export function CreditSegmentedNav() {
  const location = useLocation();
  const tabs = [
    { id: 'overview',     label: 'Overview',      to: '/credit/overview' },
    { id: 'credit-card',  label: 'Credit Card',   badge: '2',    badgeColor: 'azure', to: '/credit/credit-card' },
    { id: 'kta',          label: 'KTA / Pinjaman', badge: '1',    badgeColor: 'primary', to: '/credit/kta' },
    { id: 'kpr',          label: 'KPR / Mortgage', badge: '1',    badgeColor: 'warning', to: '/credit/kpr' },
    { id: 'paylater',     label: 'Paylater',       badge: '3',    badgeColor: 'green', to: '/credit/paylater' },
  ] as const;

  return (
    <div className="w-100 mb-2">
      <div 
        className="d-flex w-100" 
        style={{ borderBottom: '1px solid #e6e8eb' }}
        role="tablist"
      >
        <div className="d-flex w-100 justify-content-center">
          {tabs.map((tab) => {
            const isActive = location.pathname.includes(tab.id) || (tab.id === 'overview' && location.pathname === '/credit');
            return (
              <Link
                key={tab.id}
                to={tab.to}
                className="d-flex flex-fill align-items-center justify-content-center px-1 py-3 transition-all text-decoration-none"
                style={{
                  fontSize: '12px', // Slightly smaller for credit tabs since there are 5
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  color: isActive ? '#1e293b' : '#64748b',
                  fontWeight: isActive ? '800' : '600',
                  borderBottom: isActive ? '3px solid #ff6b00' : '3px solid transparent',
                  marginBottom: '-1px', // To overlap the container's bottom border
                  maxWidth: '120px' // Prevent tabs from becoming too wide
                }}
                role="tab"
                aria-selected={isActive}
              >
                <span className="d-none d-md-inline">{tab.label}</span>
                <span className="d-md-none" style={{ fontSize: '10px' }}>{tab.label.split(' ')[0]}</span>
                {tab.badge && (
                  <span
                    className={`badge bg-${tab.badgeColor} text-white border-0 rounded-pill ms-1`}
                    style={{ fontSize: '9px', padding: '1px 4px' }}
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
