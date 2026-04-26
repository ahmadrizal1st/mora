import { Link, useLocation } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { Icon } from '../ui/Icon'
import { useAuth } from '@/features/auth/hooks/useAuth'

export function BottomNav() {
  const location = useLocation()
  const currentPath = location.pathname
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated || currentPath.startsWith('/tracker')) return null

  const navItems = [
    { label: 'Home', icon: 'home', href: '/dashboard' },
    { label: 'Insight', icon: 'presentation-analytics', href: '/activity' },
    { label: 'Add', icon: 'plus', href: '/tracker', isAction: true },
    { label: 'Reports', icon: 'chart-pie', href: '/dashboard-assets' },
    { label: 'Profile', icon: 'user', href: '/profile' },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/'
    }
    return currentPath === href || currentPath.startsWith(href + '/')
  }

  return (
    <nav className="bottom-navbar d-md-none">
      {navItems.map((item) => {
        const active = isActive(item.href)
        const isAction = item.isAction
        
        return (
          <Link
            key={item.label}
            to={item.href}
            className={clsx('bottom-navbar-item', active && 'active')}
            style={{
              width: isAction ? '74px' : '64px', // Slightly wider for action button if needed
              height: '46px',
              borderRadius: '1.25rem',
            }}
          >
            {isAction && !active ? (
              <div className="bottom-navbar-add">
                <Icon icon={item.icon} stroke={3} size={24} />
              </div>
            ) : (
              <Icon 
                icon={item.icon} 
                filled={active}
                stroke={active ? 0.5 : 2}
                size={22}
                style={{ transition: 'all 0.2s ease' }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
