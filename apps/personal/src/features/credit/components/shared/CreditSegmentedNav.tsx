import { Link, useLocation } from '@tanstack/react-router'

export function CreditSegmentedNav() {
  const location = useLocation()
  const tabs = [
    { id: 'overview', label: 'Ringkasan', to: '/credit/overview' },
    {
      id: 'credit-card',
      label: 'Kartu Kredit',
      to: '/credit/credit-card',
    },
    { id: 'kta', label: 'Pinjaman Tunai (KTA)', to: '/credit/kta' },
    { id: 'kpr', label: 'Cicilan Rumah (KPR)', to: '/credit/kpr' },
    { id: 'paylater', label: 'Layanan Paylater', to: '/credit/paylater' },
  ] as const

  return (
    <div className="w-100">
      <div className="d-flex w-100" style={{ borderBottom: '1px solid #e6e8eb' }} role="tablist">
        {tabs.map((tab) => {
          const isActive =
            location.pathname.includes(tab.id) ||
            (tab.id === 'overview' && location.pathname === '/credit')
          return (
            <Link
              key={tab.id}
              to={tab.to}
              className="d-flex align-items-center justify-content-center py-3 transition-all text-decoration-none"
              style={{
                flex: 1,
                fontSize: '12px',
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
              <span className="d-md-none" style={{ fontSize: '10px' }}>
                {tab.label.split(' ')[0]}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
