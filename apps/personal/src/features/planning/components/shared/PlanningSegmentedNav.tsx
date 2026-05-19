import { Link, useLocation } from '@tanstack/react-router';
import { Icon } from '@/shared/components/ui/Icon';

export function PlanningSegmentedNav() {
  const location = useLocation();
  const tabs = [
    { id: 'budget', label: 'Monthly Budget', icon: 'chart-pie', badge: '5', badgeColor: 'azure', to: '/planning/budget' },
    { id: 'goals', label: 'Financial Goals', icon: 'target', badge: '3', badgeColor: 'warning', to: '/planning/goals' },
    { id: 'subscriptions', label: 'Subscriptions', icon: 'calendar-event', badge: '4', badgeColor: 'green', to: '/planning/subscriptions' },
  ] as const;

  return (
    <div 
      className="p-1 d-inline-flex bg-body-tertiary rounded-3" 
      style={{ 
        backgroundColor: '#f4f6fa',
        border: '1px solid rgba(0,0,0,0.04)',
        padding: '2px'
      }}
    >
      <div className="d-flex flex-nowrap" role="tablist">
        {tabs.map((tab) => {
          const isActive = location.pathname.includes(tab.id);
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
              <span className="d-md-none">{tab.label.split(' ')[1] || tab.label}</span>
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
  );
}
