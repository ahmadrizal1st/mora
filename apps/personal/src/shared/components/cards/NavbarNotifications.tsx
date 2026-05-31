import { clsx } from 'clsx'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'
import { SwitchIcon } from '../ui/SwitchIcon'
import { Empty } from '../ui/Empty'
import { type Notification } from '@/features/notifications/types/notification.types'
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
  useToggleStar,
} from '@/features/notifications/hooks/useNotifications'
import { type NotificationFilter } from '@/features/notifications/types/notification.types'
import { useState } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/id'

dayjs.extend(relativeTime)
dayjs.locale('id')

const LABEL_COLORS: Record<string, string> = {
  saving: 'blue',
  credit: 'orange',
  expense: 'red',
  income: 'teal',
}

const TITLE_LABEL_MAP: Array<{ keywords: string[]; label: string }> = [
  { keywords: ['saving'], label: 'saving' },
  { keywords: ['kredit', 'credit'], label: 'credit' },
  { keywords: ['pengeluaran', 'expense'], label: 'expense' },
  { keywords: ['pemasukan', 'income'], label: 'income' },
]

function resolveLabelFromTitle(title: string): string | null {
  const lower = title.toLowerCase()
  for (const { keywords, label } of TITLE_LABEL_MAP) {
    if (keywords.some((kw) => lower.includes(kw))) return label
  }
  return null
}

function resolveLabel(n: Notification): string | null {
  return n.label?.toLowerCase() ?? resolveLabelFromTitle(n.data.title)
}

function dotColor(n: Notification): string {
  const label = resolveLabel(n)
  if (label && LABEL_COLORS[label]) return `bg-${LABEL_COLORS[label]}`
  if (n.data.status === 'error') return 'bg-red status-dot-animated'
  if (n.data.status === 'success') return 'bg-green'
  if (n.read_at) return ''
  return 'bg-blue status-dot-animated'
}

interface NotificationItemProps {
  n: Notification
  onMarkRead: (id: string) => void
  onToggleStar: (id: string) => void
}

function NotificationItem({ n, onMarkRead, onToggleStar }: NotificationItemProps) {
  const labelStr = resolveLabel(n)
  const labelColor = labelStr ? (LABEL_COLORS[labelStr] ?? 'secondary') : null

  return (
    <div className={clsx('list-group-item', n.read_at && 'bg-light')}>
      <div className="row align-items-center">
        <div className="col-auto">
          <span className={`status-dot d-block ${dotColor(n)}`} />
        </div>
        <div className="col text-truncate">
          <a
            href={n.data.url || '#'}
            className="text-body d-block fw-medium d-flex align-items-center gap-2"
            onClick={() => {
              if (!n.read_at) onMarkRead(n.id)
            }}
          >
            <span className="text-truncate fw-bold">{n.data.title}</span>
            {labelStr && labelColor && (
              <span
                className={`badge bg-${labelColor}-lt font-weight-normal ms-auto text-capitalize`}
                style={{ fontSize: '0.65rem' }}
              >
                {labelStr}
              </span>
            )}
          </a>
          <div
            className="text-secondary mt-1 small text-wrap"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: '1.4',
            }}
          >
            {n.data.message}
          </div>
        </div>
        <div className="col-auto text-secondary small">{dayjs(n.created_at).fromNow()}</div>
        <div className="col-auto">
          <SwitchIcon
            icon="star"
            colorB="yellow"
            variant="slide-up"
            active={n.is_starred}
            className={clsx('list-group-item-actions', n.is_starred && 'show')}
            onClick={() => onToggleStar(n.id)}
          />
        </div>
      </div>
    </div>
  )
}

interface NavbarNotificationsProps {
  limit?: number
  isPage?: boolean
  filter?: NotificationFilter
}

export function NavbarNotifications({
  limit = 20,
  isPage = false,
  filter = 'all',
}: NavbarNotificationsProps) {
  const [page, setPage] = useState(1)

  const { data, isLoading } = useNotifications({
    per_page: limit,
    filter,
    page,
  })

  const markAsRead = useMarkAsRead()
  const markAllAsRead = useMarkAllAsRead()
  const toggleStar = useToggleStar()

  const items = data?.data ?? []
  const total = data?.total ?? 0
  const lastPage = data?.last_page ?? 1
  const unreadCount = items.filter((n) => !n.read_at).length

  const fromEntry = total > 0 ? (page - 1) * limit + 1 : 0
  const toEntry = Math.min(page * limit, total)

  if (isLoading && !data) {
    return (
      <div className="p-4 text-center">
        <div className="spinner-border spinner-border-sm text-secondary" role="status" />
      </div>
    )
  }

  return (
    <div className={isPage ? 'd-flex flex-column h-100' : 'card'}>
      <div className={clsx('card-header d-flex align-items-center', isPage && 'bg-transparent')}>
        <h3 className="card-title">
          Notifications
          {unreadCount > 0 && <span className="badge bg-red text-red-fg ms-2">{unreadCount}</span>}
        </h3>
        {!isPage && (
          <button
            type="button"
            className="btn-close ms-auto"
            aria-label="Close"
            onClick={(e) => {
              const toggle = e.currentTarget
                .closest('.dropdown')
                ?.querySelector('[data-bs-toggle="dropdown"]') as HTMLElement
              toggle?.click()
            }}
          />
        )}
      </div>

      <div
        className="list-group list-group-flush list-group-hoverable"
        style={{ maxHeight: isPage ? 'none' : '25rem', overflowY: 'auto' }}
      >
        {items.length > 0 ? (
          items.map((n) => (
            <NotificationItem
              key={n.id}
              n={n}
              onMarkRead={(id) => markAsRead.mutate(id)}
              onToggleStar={(id) => toggleStar.mutate(id)}
            />
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

      {items.length > 0 &&
        (isPage ? (
          <div className="card-footer d-flex align-items-center bg-transparent border-0 mt-auto">
            <p className="m-0 text-secondary">
              Showing <span>{fromEntry}</span> to <span>{toEntry}</span> of <span>{total}</span>{' '}
              entries
            </p>
            <ul className="pagination m-0 ms-auto">
              <li className={clsx('page-item', page === 1 && 'disabled')}>
                <a
                  className="page-link"
                  href="#"
                  tabIndex={-1}
                  aria-disabled="true"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.max(1, p - 1))
                  }}
                >
                  <Icon icon="chevron-left" />
                  prev
                </a>
              </li>
              {buildPageNumbers(page, lastPage).map((pageNum, i) => (
                <li key={i} className={clsx('page-item', page === pageNum && 'active')}>
                  <a
                    className="page-link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setPage(pageNum)
                    }}
                  >
                    {pageNum}
                  </a>
                </li>
              ))}
              <li className={clsx('page-item', page === lastPage && 'disabled')}>
                <a
                  className="page-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.min(lastPage, p + 1))
                  }}
                >
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
                <Button
                  block
                  text="Mark all as read"
                  onClick={() => markAllAsRead.mutate()}
                  loading={markAllAsRead.isPending}
                  disabled={unreadCount === 0}
                />
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}

function buildPageNumbers(currentPage: number, lastPage: number): number[] {
  const maxVisible = 5
  const total = Math.min(maxVisible, lastPage)
  let start = 1

  if (lastPage > maxVisible && currentPage > 3) {
    start = Math.min(currentPage - 2, lastPage - maxVisible + 1)
  }

  return Array.from({ length: total }, (_, i) => start + i)
}
