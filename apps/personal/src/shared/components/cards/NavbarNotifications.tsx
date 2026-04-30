import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'
import { notificationApi, type Notification } from '@/shared/api/notifications'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/id'

dayjs.extend(relativeTime)
dayjs.locale('id')

interface NavbarNotificationsProps {
  limit?: number
  isPage?: boolean
}

function dotColor(n: Notification): string {
  if (n.data.status === 'error') return 'bg-red status-dot-animated'
  if (n.data.status === 'success') return 'bg-green'
  if (n.read_at) return ''
  return 'bg-blue status-dot-animated'
}

export function NavbarNotifications({
  limit = 5,
  isPage = false,
}: NavbarNotificationsProps) {
  const queryClient = useQueryClient()

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications', { limit: isPage ? 20 : limit }],
    queryFn: () => notificationApi.getNotifications({ per_page: isPage ? 20 : limit }),
    refetchInterval: 15000,
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => notificationApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const toggleStarMutation = useMutation({
    mutationFn: (id: string) => notificationApi.toggleStar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const items = notificationsData?.data || []
  const unreadCount = items.filter(n => !n.read_at).length

  if (isLoading && !notificationsData) {
    return (
      <div className="p-4 text-center">
        <div className="spinner-border spinner-border-sm text-secondary" role="status"></div>
      </div>
    )
  }

  return (
    <div className={isPage ? "card border-0 shadow-none rounded-0" : "card"}>
      <div className="card-header d-flex align-items-center">
        <h3 className="card-title">
          Notifications
          {unreadCount > 0 && (
            <span className="badge bg-red text-red-fg ms-2">{unreadCount}</span>
          )}
        </h3>
        <div className="btn-close ms-auto" data-bs-dismiss="dropdown" />
      </div>

      <div className="list-group list-group-flush list-group-hoverable" style={{ maxHeight: isPage ? 'none' : '25rem', overflowY: 'auto' }}>
        {items.map((n) => (
          <div key={n.id} className={clsx("list-group-item", n.read_at && "bg-light")}>
            <div className="row align-items-center">
              <div className="col-auto">
                <span className={`status-dot d-block ${dotColor(n)}`} />
              </div>
              <div className="col text-truncate">
                <a 
                  href={n.data.url || '#'} 
                  className="text-body d-block fw-medium"
                  onClick={() => {
                    if (!n.read_at) markAsReadMutation.mutate(n.id)
                  }}
                >
                  {n.data.title}
                </a>
                <div className="d-block text-secondary text-truncate mt-n1">
                  {n.data.message}
                </div>
              </div>
              <div className="col-auto text-secondary small">
                {dayjs(n.created_at).fromNow()}
              </div>
              <div className="col-auto">
                <a 
                  href="#" 
                  className={clsx("list-group-item-actions", n.is_starred ? "show" : "")}
                  onClick={(e) => {
                    e.preventDefault();
                    toggleStarMutation.mutate(n.id);
                  }}
                >
                  <Icon icon={n.is_starred ? "star-filled" : "star"} color={n.is_starred ? "yellow" : "muted"} />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-footer">
        <div className="row align-items-center">
          <div className="col">
            <Button block text="View all" to="/notifications" />
          </div>
          <div className="col">
            <Button block text="Mark all as read" onClick={() => markAllReadMutation.mutate()} loading={markAllReadMutation.isPending} disabled={unreadCount === 0} />
          </div>
        </div>
      </div>
    </div>
  )
}