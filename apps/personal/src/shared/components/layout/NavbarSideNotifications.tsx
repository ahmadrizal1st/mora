import { clsx } from 'clsx'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Icon } from '../ui/Icon'
import { NavbarNotifications } from '../cards/NavbarNotifications'
import { notificationApi } from '@/shared/api/notifications'

interface NavbarSideNotificationsProps {
  className?: string
}

export function NavbarSideNotifications({ className }: NavbarSideNotificationsProps) {
  const { data: countData } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => notificationApi.getUnreadCount(),
    refetchInterval: 15000,
  })

  const unreadCount = countData?.unread_count ?? 0

  return (
    <div className={clsx('nav-item dropdown', className)}>
      <a
        href="#"
        className="nav-link px-0 d-none d-md-flex"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        tabIndex={-1}
        aria-label="Show notifications"
      >
        <Icon icon="bell" />
        {unreadCount > 0 && <span className="badge badge-dot bg-red" />}
      </a>

      <Link to="/notifications" className="nav-link px-0 d-md-none" aria-label="Show notifications">
        <Icon icon="bell" />
        {unreadCount > 0 && <span className="badge badge-dot bg-red" />}
      </Link>

      <div
        className="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card"
        style={{ width: '600px', maxWidth: '100vw' }}
      >
        <NavbarNotifications />
      </div>
    </div>
  )
}
