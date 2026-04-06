import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import { Icon } from '../ui/Icon'
import { useAuth } from '../../context/AuthContext'

export function BottomNavbar() {
  const location = useLocation()
  const currentPath = location.pathname
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) return null

  const navItems = [
    { icon: 'home', label: 'Home', path: '/dashboard' },
    { icon: 'presentation', label: 'Tracker', path: '/tracker' },
    { icon: 'plus', label: 'Add', path: '/tracker/input', isAction: true },
    { icon: 'chart-pie', label: 'Reports', path: '/dashboard-assets' },
    { icon: 'user', label: 'Profile', path: '/profile' },
  ]

  return (
    <nav className="bottom-navbar d-md-none">
      {navItems.map((item) => {
        const isActive = currentPath === item.path
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={clsx('bottom-navbar-item', isActive && 'active')}
          >
            {item.isAction ? (
              <div className="bottom-navbar-add">
                <Icon icon={item.icon} stroke={2.5} size="md" />
              </div>
            ) : (
              <Icon icon={item.icon} stroke={1.5} size="lg" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
