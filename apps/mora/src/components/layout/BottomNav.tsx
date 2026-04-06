import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import { Icon } from '../ui/Icon'
import { useAuth } from '../../context/AuthContext'

export function BottomNav() {
  const location = useLocation()
  const currentPath = location.pathname
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return null
  }

  const navItems = [
    { label: 'Home', icon: 'home', href: '/dashboard' },
    { label: 'Insight', icon: 'presentation-analytics', href: '/analytics' },
    { label: 'Transactions', icon: 'square-rounded-plus', href: '/tracker' },
    { label: 'Invest', icon: 'chart-pie', href: '/portfolio' },
    { label: 'Profile', icon: 'user', href: '/profile' },
  ]

  const isActive = (item: any) => {
    if (item.href === '/dashboard' && (currentPath === '/dashboard' || currentPath === '/')) return true
    return currentPath.startsWith(item.href)
  }

  return (
    <nav className="fixed-bottom d-lg-none mb-3 px-3 d-flex justify-content-center" style={{ zIndex: 1050 }}>
      <div 
        className="d-flex align-items-center justify-content-around p-1 shadow-lg"
        style={{
          background: 'color-mix(in srgb, var(--tblr-bg-surface), transparent 5%)',
          borderRadius: '2.5rem',
          width: '100%',
          maxWidth: '450px',
          border: '1px solid var(--tblr-border-color-light)',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)'
        }}
      >
        {navItems.map((item) => {
          const active = isActive(item)
          const isAction = item.label === 'Transactions'
          return (
            <Link
              key={item.label}
              to={item.href}
              className={clsx(
                'd-flex align-items-center justify-content-center transition-all',
                active ? 'text-white fw-bold' : 'text-primary opacity-50'
              )}
              style={{
                width: '64px',
                height: '48px',
                borderRadius: '1.5rem',
                background: active ? 'var(--tblr-primary)' : 'transparent',
                transition: 'all 0.2s ease-in-out',
                boxShadow: active ? '0 4px 12px rgba(var(--tblr-primary-rgb), 0.4)' : 'none'
              }}
            >
              <Icon 
                icon={item.icon} 
                filled={active || isAction}
                stroke={active ? 0.5 : 2}
                style={{ width: isAction ? '28px' : '22px', height: isAction ? '28px' : '22px' }}
              />
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
