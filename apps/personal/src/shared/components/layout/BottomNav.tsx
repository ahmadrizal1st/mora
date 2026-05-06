import { type FC, useRef } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { Icon } from '../ui/Icon'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useTransactionModalStore } from '@/features/transaction/store/useTransactionModalStore'

export function BottomNav() {
  const location = useLocation()
  const currentPath = location.pathname
  const { isAuthenticated } = useAuth()
  const { openMethodModal } = useTransactionModalStore()
  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);

  if (!isAuthenticated || currentPath.startsWith('/tracker')) return null

  const navItems = [
    { label: 'Home', icon: 'home', href: '/dashboard' },
    { label: 'Activity', icon: 'file-invoice', href: '/activity' },
    { label: 'Tracker', icon: 'scan', href: '#', isAction: true },
    { label: 'Planning', icon: 'target', href: '/planning' },
    { label: 'Chat', icon: 'message-circle', href: '/chat' },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return currentPath === '/dashboard' || currentPath === '/'
    }
    return currentPath === href || currentPath.startsWith(href + '/')
  }

  const cooldownRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (cooldownRef.current) return;
    
    // Capture pointer to ensure events continue even if thumb moves
    e.currentTarget.setPointerCapture(e.pointerId);
    
    holdTimerRef.current = setTimeout(() => {
      openMethodModal();
      // Set cooldown to prevent the subsequent click event from re-opening
      cooldownRef.current = true;
      setTimeout(() => { cooldownRef.current = false; }, 300);

      // Release capture so the global listeners can take over
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch (err) {
        // Fallback for older browsers
      }
      
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50); // Sharper haptic
      }
    }, 150); // Near instant response
  };

  const handlePointerUp = () => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const handleContextMenu = (e: React.MouseEvent | React.PointerEvent) => {
    e.preventDefault();
  };

  return (
    <nav className="bottom-navbar d-md-none px-3">
      <div className="bottom-navbar-container">
        {navItems.map((item) => {
          const active = isActive(item.href)
          const isAction = item.isAction
          
          if (isAction) {
            return (
              <div key={item.label} className="bottom-navbar-action-wrapper">
                <button
                  className="bottom-navbar-action-btn border-0 p-0"
                  onClick={(e) => {
                    e.preventDefault();
                    openMethodModal();
                  }}
                  onPointerDown={handlePointerDown}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  onContextMenu={handleContextMenu}
                  style={{ touchAction: 'none' }}
                >
                  <div className="btn-glass-glow"></div>
                  <Icon icon={item.icon} stroke={2} size={26} />
                </button>
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
