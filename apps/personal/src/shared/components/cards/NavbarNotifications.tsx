import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'
import { SwitchIcon } from '../ui/SwitchIcon'
import { Empty } from '../ui/Empty'
import { notificationApi, type Notification } from '@/shared/api/notifications'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/id'

dayjs.extend(relativeTime)
dayjs.locale('id')

interface NavbarNotificationsProps {
  limit?: number
  isPage?: boolean
  filter?: string
}

const LABEL_COLORS: Record<string, string> = {
  budgeting: 'green',
  saving: 'blue',
  credit: 'orange',
  expense: 'red',
  income: 'teal',
}

function dotColor(n: Notification): string {
  // If label exists, use label color
  if (n.label) {
    const color = LABEL_COLORS[n.label.toLowerCase()]
    if (color) return `bg-${color}`
  }

  // Fallback to title-based detection (if DB label is missing)
  const title = n.data.title.toLowerCase()
  if (title.includes('budget')) return 'bg-green'
  if (title.includes('saving')) return 'bg-blue'
  if (title.includes('credit') || title.includes('kredit')) return 'bg-orange'
  if (title.includes('expense') || title.includes('pengeluaran')) return 'bg-red'
  if (title.includes('income') || title.includes('pemasukan')) return 'bg-teal'

  // Default status-based colors
  if (n.data.status === 'error') return 'bg-red status-dot-animated'
  if (n.data.status === 'success') return 'bg-green'
  if (n.read_at) return ''
  return 'bg-blue status-dot-animated'
}

export function NavbarNotifications({
  limit = 20,
  isPage = false,
  filter,
}: NavbarNotificationsProps) {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)

  const { data: notificationsData, isLoading } = useQuery({
    queryKey: ['notifications', { limit: isPage ? limit || 20 : limit, filter, page }],
    queryFn: () => notificationApi.getNotifications({ 
      per_page: isPage ? limit || 20 : limit, 
      filter,
      page
    }),
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
    <div className={isPage ? "d-flex flex-column h-100" : "card"}>
      <div className={clsx("card-header d-flex align-items-center", isPage && "bg-transparent")}>
        <h3 className="card-title">
          Notifications
          {unreadCount > 0 && (
            <span className="badge bg-red text-red-fg ms-2">{unreadCount}</span>
          )}
        </h3>
        {!isPage && (
          <button 
            type="button" 
            className="btn-close ms-auto" 
            onClick={(e) => {
              const toggle = e.currentTarget.closest('.dropdown')?.querySelector('[data-bs-toggle="dropdown"]') as HTMLElement;
              toggle?.click();
            }}
            aria-label="Close" 
          />
        )}
      </div>

      <div className="list-group list-group-flush list-group-hoverable" style={{ maxHeight: isPage ? 'none' : '25rem', overflowY: 'auto' }}>
        {items.length > 0 ? (
          items.map((n) => (
            <div key={n.id} className={clsx("list-group-item", n.read_at && "bg-light")}>
              <div className="row align-items-center">
                <div className="col-auto">
                  <span className={`status-dot d-block ${dotColor(n)}`} />
                </div>
                <div className="col text-truncate">
                  <a 
                    href={n.data.url || '#'} 
                    className="text-body d-block fw-medium d-flex align-items-center gap-2"
                    onClick={() => {
                      if (!n.read_at) markAsReadMutation.mutate(n.id)
                    }}
                  >
                    <span className="text-truncate fw-bold">{n.data.title}</span>
                    {(() => {
                      const labelStr = n.label?.toLowerCase() || 
                        (n.data.title.toLowerCase().includes('budget') ? 'budgeting' :
                         n.data.title.toLowerCase().includes('saving') ? 'saving' :
                         n.data.title.toLowerCase().includes('kredit') || n.data.title.toLowerCase().includes('credit') ? 'credit' :
                         n.data.title.toLowerCase().includes('pengeluaran') || n.data.title.toLowerCase().includes('expense') ? 'expense' :
                         n.data.title.toLowerCase().includes('pemasukan') || n.data.title.toLowerCase().includes('income') ? 'income' : null)
                      
                      if (!labelStr) return null

                      const color = LABEL_COLORS[labelStr] || 'secondary'
                      
                      return (
                        <span className={`badge bg-${color}-lt font-weight-normal ms-auto text-capitalize`} style={{ fontSize: '0.65rem' }}>
                          {labelStr}
                        </span>
                      )
                    })()}
                  </a>
                  <div className="text-secondary mt-1 small text-wrap" style={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    lineHeight: '1.4'
                  }}>
                    {n.data.message}
                  </div>
                </div>
                <div className="col-auto text-secondary small">
                  {dayjs(n.created_at).fromNow()}
                </div>
                <div className="col-auto">
                  <SwitchIcon 
                    icon="star" 
                    colorB="yellow" 
                    variant="slide-up" 
                    active={n.is_starred} 
                    className={clsx("list-group-item-actions", n.is_starred && "show")}
                    onClick={() => toggleStarMutation.mutate(n.id)}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 py-6">
            <Empty 
              illustration="not-found"
              illustrationSize={isPage ? 240 : 120}
              title="No notifications yet"
              subtitle="When you have new updates, they will show up here."
            />
          </div>
        )}
      </div>

      {items.length > 0 && (
        isPage ? (
          <div className="card-footer d-flex align-items-center bg-transparent border-0 mt-auto">
            <p className="m-0 text-secondary">
              Showing <span>{Math.min(1 + (page - 1) * limit, notificationsData?.meta.total || 0)}</span> to <span>{Math.min(page * limit, notificationsData?.meta.total || 0)}</span> of <span>{notificationsData?.meta.total || 0}</span> entries
            </p>
            <ul className="pagination m-0 ms-auto">
              <li className={clsx("page-item", page === 1 && "disabled")}>
                <a className="page-link" href="#" tabIndex={-1} aria-disabled="true" onClick={(e) => { e.preventDefault(); setPage(p => Math.max(1, p - 1)); }}>
                  <Icon icon="chevron-left" />
                  prev
                </a>
              </li>
              {[...Array(Math.min(5, notificationsData?.meta.last_page || 1))].map((_, i) => {
                // Simple pagination logic: show up to 5 pages
                let pageNum = i + 1;
                const lastPage = notificationsData?.meta.last_page || 1;
                if (lastPage > 5 && page > 3) {
                  pageNum = page - 2 + i;
                  if (pageNum > lastPage) pageNum = lastPage - (4 - i);
                }
                
                return (
                  <li key={i} className={clsx("page-item", page === pageNum && "active")}>
                    <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); setPage(pageNum); }}>{pageNum}</a>
                  </li>
                )
              })}
              <li className={clsx("page-item", page === (notificationsData?.meta.last_page || 1) && "disabled")}>
                <a className="page-link" href="#" onClick={(e) => { e.preventDefault(); setPage(p => Math.min(notificationsData?.meta.last_page || 1, p + 1)); }}>
                  next
                  <Icon icon="chevron-right" />
                </a>
              </li>
            </ul>
          </div>
        ) : (
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
        )
      )}
    </div>
  )
}