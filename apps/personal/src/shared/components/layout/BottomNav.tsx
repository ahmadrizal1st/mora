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
    { label: 'Info', icon: 'library', href: '/info' },
    { label: 'Tracker', icon: 'scan', href: '/tracker', isAction: true },
    { label: 'Activity', icon: 'file-invoice', href: '/activity' },
    { label: 'Chat', icon: 'message-circle', href: '/chat' },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/'
    }
    return currentPath === href || currentPath.startsWith(href + '/')
  }

  return (
    <nav className="bottom-navbar d-md-none px-3">
      <div className="bottom-navbar-container">
        {navItems.map((item) => {
          const active = isActive(item.href)
          const isAction = item.isAction
          
          if (isAction) {
            return (
              <div key={item.label} className="bottom-navbar-action-wrapper">
                <Link
                  to={item.href}
                  className="bottom-navbar-action-btn"
                >
                  <div className="btn-glass-glow"></div>
                  <Icon icon={item.icon} stroke={2} size={26} />
                </Link>
                <span className="bottom-navbar-label">{item.label}</span>
              </div>
            )
          }

          return (
            <Link
              key={item.label}
              to={item.href}
              className={clsx('bottom-navbar-item', active && 'active')}
            >
              <div className="bottom-navbar-icon-wrapper">
                <Icon 
                  icon={item.icon} 
                  filled={active}
                  stroke={active ? 1.5 : 2}
                  size={24}
                />
              </div>
              <span className="bottom-navbar-label">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
