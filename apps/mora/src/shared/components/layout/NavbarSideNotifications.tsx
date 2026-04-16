import { clsx } from 'clsx'
import { Link } from '@tanstack/react-router'
import { Icon } from '../ui/Icon'
import { NavbarNotifications } from '../cards/NavbarNotifications'
import notificationsData from '../../data/notifications.json'

interface NavbarSideNotificationsProps {
    className?: string
}

interface Notification {
  status: string
  [key: string]: unknown
}

export function NavbarSideNotifications({ className }: NavbarSideNotificationsProps) {
    const unreadCount = (notificationsData as Notification[]).filter(n => n.status === 'unread').length

    return (
        <div className={clsx("nav-item dropdown", className)}>
            {/* Desktop: Dropdown Trigger */}
            <a
                href="#"
                className="nav-link px-0 d-none d-md-flex"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                tabIndex={-1}
                aria-label="Show notifications"
            >
                <Icon icon="bell" />
                {unreadCount > 0 && (
                    <span className="badge badge-dot bg-red" />
                )}
            </a>

            {/* Mobile: Link to Page */}
            <Link
                to="/notifications"
                className="nav-link px-0 d-md-none"
                aria-label="Show notifications"
            >
                <Icon icon="bell" />
                {unreadCount > 0 && (
                    <span className="badge badge-dot bg-red" />
                )}
            </Link>

            <div className="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card">
                <NavbarNotifications />
            </div>
        </div>
    )
}
