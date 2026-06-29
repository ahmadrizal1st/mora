import { Link, useLocation } from '@tanstack/react-router'

export function PlanningSegmentedNav() {
  const location = useLocation()
  const tabs = [
    {
      id: 'budget',
      label: 'Monthly Budget',
      to: '/planning/budget',
    },
    {
      id: 'goals',
      label: 'Financial Goals',
      to: '/planning/goals',
    },
    {
      id: 'subscriptions',
      label: 'Subscriptions',
      to: '/planning/subscriptions',
    },
  ] as const

  return (
    <div className="w-100 mb-2">
      <div className="d-flex w-100" style={{ borderBottom: '1px solid #e6e8eb' }} role="tablist">
        {tabs.map((tab) => {
          const isActive = location.pathname.includes(tab.id)
          return (
            <Link
              key={tab.id}
              to={tab.to}
              className="d-flex align-items-center justify-content-center py-3 transition-all text-decoration-none"
              style={{
                flex: 1,
                fontSize: '14px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                outline: 'none',
                backgroundColor: 'transparent',
                color: isActive ? '#1e293b' : '#64748b',
                fontWeight: isActive ? '800' : '600',
                borderBottom: isActive ? '3px solid #ff6b00' : '3px solid transparent',
                marginBottom: '-1px',
              }}
              role="tab"
              aria-selected={isActive}
            >
              <span className="d-none d-md-inline">{tab.label}</span>
              <span className="d-md-none">{tab.label.split(' ')[1] || tab.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
