// src/components/cards/NavbarNotifications.tsx
import { clsx } from 'clsx'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'
import notificationsData from '../../data/notifications.json'

interface Notification {
  id: string
  title: string
  description: string
  status?: string
  priority?: string
  icon?: string
  color?: string
  action_url?: string
  is_important?: boolean
  timestamp?: string
}

interface NavbarNotificationsProps {
  notifications?: Notification[]
  limit?: number
  isPage?: boolean
}

function timeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function dotColor(notification: Notification): string {
  if (notification.priority === 'critical') return 'bg-red status-dot-animated'
  if (notification.priority === 'high') return 'bg-orange status-dot-animated'
  if (notification.color === 'success') return 'bg-green'
  if (notification.color === 'danger') return 'bg-red'
  if (notification.color === 'warning') return 'bg-yellow'
  if (notification.status === 'unread') return 'bg-blue status-dot-animated'
  return ''
}

export function NavbarNotifications({
  notifications = notificationsData as Notification[],
  limit = 5,
  isPage = false,
}: NavbarNotificationsProps) {
  const items = isPage ? notifications : notifications.slice(0, limit)
  const unreadCount = notifications.filter(n => n.status === 'unread').length

  return (
    <div className={isPage ? "card border-0 shadow-none rounded-0" : "card"}>
      {!isPage && (
        <div className="card-header d-flex align-items-center">
          <h3 className="card-title">
            Notifications
            {unreadCount > 0 && (
              <span className="badge bg-red text-red-fg ms-2">{unreadCount}</span>
            )}
          </h3>
          <div className="btn-close ms-auto" data-bs-dismiss="dropdown" />
        </div>
      )}

      <div className="list-group list-group-flush list-group-hoverable">
        {items.map((n) => (
          <div key={n.id} className={clsx(isPage ? "list-group-item rounded-0 px-3 py-2 py-md-3" : "list-group-item")}>
            <div className="row align-items-center g-2 g-md-3">
              <div className="col-auto">
                <span className={`status-dot rounded-circle d-block ${dotColor(n)}`} />
              </div>
              <div className="col text-truncate">
                <a href={n.action_url || '#'} className="text-body d-block fw-bold mb-0 text-truncate" style={{ fontSize: isPage ? '0.875rem' : 'inherit' }}>
                  {n.title}
                </a>
                <div className="text-secondary text-truncate mt-n1" style={{ fontSize: isPage ? '0.75rem' : '0.85rem' }}>
                  {n.description}
                </div>
              </div>
              <div className="col-auto text-secondary text-nowrap" style={{ fontSize: '0.7rem' }}>
                {n.timestamp ? timeAgo(n.timestamp) : ''}
              </div>
              {n.is_important && (
                <div className="col-auto">
                  <a href="#" className="list-group-item-actions d-none d-md-block show">
                    <Icon icon="star" color="yellow" size="sm" />
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={clsx("card-footer", isPage && "px-3")}>
        <div className="row">
          <div className="col">
            <Button block text="Archive all" />
          </div>
          <div className="col">
            <Button block text="Mark all as read" />
          </div>
        </div>
      </div>
    </div>
  )
}