import { useState } from 'react'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { NavbarNotifications } from '@/shared/components/cards/NavbarNotifications'
import { Icon } from '@/shared/components/ui/Icon'
import { clsx } from 'clsx'
import { type NotificationFilter } from '@/features/notifications'

export default function NotificationsPage() {
  const [filter, setFilter] = useState<NotificationFilter>('all')

  const navItems = [
    { id: 'all', label: 'All Notifications', icon: 'bell' },
    { id: 'unread', label: 'Unread', icon: 'bell-ringing' },
    { id: 'starred', label: 'Starred', icon: 'star' },
    { id: 'archive', label: 'Archived', icon: 'archive' },
  ] as const

  const labels = [
    { label: 'Budgeting', color: 'green' },
    { label: 'Saving', color: 'blue' },
    { label: 'Credit', color: 'orange' },
    { label: 'Expense', color: 'red' },
    { label: 'Income', color: 'teal' },
  ]

  return (
    <BaseLayout pageTitle="Notifications" pagePretitle="Overview" containerFlushMobile>
      <div className="container-xl">
        <div className="card">
          <div className="row g-0">
            <div className="col-12 d-md-none border-bottom p-2 bg-light">
              <div className="d-flex align-items-center justify-content-between gap-2">
                <div className="btn-group shadow-sm">
                  <button
                    className={clsx(
                      'btn btn-white px-3 d-flex align-items-center justify-content-center',
                      filter === 'all' && 'active'
                    )}
                    style={{
                      borderTopLeftRadius: '8px',
                      borderBottomLeftRadius: '8px',
                      height: '36px',
                      minWidth: '60px',
                    }}
                    onClick={() => setFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={clsx(
                      'btn btn-white px-3 d-flex align-items-center justify-content-center',
                      filter === 'unread' && 'active'
                    )}
                    style={{
                      borderTopRightRadius: '8px',
                      borderBottomRightRadius: '8px',
                      height: '36px',
                      minWidth: '60px',
                    }}
                    onClick={() => setFilter('unread')}
                  >
                    Unread
                  </button>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <div className="btn-group shadow-sm">
                    <button
                      className={clsx(
                        'btn btn-icon btn-white p-0 d-flex align-items-center justify-content-center',
                        filter === 'archive' && 'active'
                      )}
                      style={{
                        borderTopLeftRadius: '8px',
                        borderBottomLeftRadius: '8px',
                        width: '36px',
                        height: '36px',
                      }}
                      title="Archive"
                      onClick={() => setFilter('archive')}
                    >
                      <Icon icon="archive" size="sm" />
                    </button>
                    <button
                      className={clsx(
                        'btn btn-icon btn-white p-0 d-flex align-items-center justify-content-center',
                        filter === 'starred' && 'active'
                      )}
                      style={{
                        borderTopRightRadius: '8px',
                        borderBottomRightRadius: '8px',
                        width: '36px',
                        height: '36px',
                      }}
                      title="Starred"
                      onClick={() => setFilter('starred')}
                    >
                      <Icon icon="star" size="sm" />
                    </button>
                  </div>

                  <div className="dropdown">
                    <button
                      className="btn btn-white btn-icon shadow-sm p-0 d-flex align-items-center justify-content-center no-caret"
                      style={{ borderRadius: '8px', width: '36px', height: '36px' }}
                      data-bs-toggle="dropdown"
                    >
                      <Icon icon="tag" size="sm" />
                    </button>
                    <div className="dropdown-menu dropdown-menu-end shadow-lg border-0">
                      <div className="dropdown-header">Filter by Label</div>
                      {labels.map((item) => (
                        <a
                          key={item.label}
                          href="#"
                          className={clsx(
                            'dropdown-item',
                            filter === item.label.toLowerCase() && 'active'
                          )}
                          onClick={(e) => {
                            e.preventDefault()
                            setFilter(item.label.toLowerCase() as NotificationFilter)
                          }}
                        >
                          <span className={`status-dot bg-${item.color} me-2`}></span>
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-3 border-end d-none d-md-block">
              <div className="card-body">
                <h4 className="subheader">Status</h4>
                <div className="list-group list-group-transparent mb-3 mx-0">
                  {navItems.map((item) => (
                    <a
                      key={item.id}
                      href="#"
                      className={clsx(
                        'list-group-item list-group-item-action d-flex align-items-center border-0',
                        filter === item.id && 'active fw-bold'
                      )}
                      style={{ outline: 'none' }}
                      onClick={(e) => {
                        e.preventDefault()
                        setFilter(item.id as NotificationFilter)
                      }}
                    >
                      <span className="nav-link-icon d-md-none d-lg-inline-block me-2">
                        <Icon icon={item.icon} size={18} />
                      </span>
                      {item.label}
                    </a>
                  ))}
                </div>

                <h4 className="subheader mt-4">Labels</h4>
                <div className="list-group list-group-transparent mx-0">
                  {labels.map((item) => (
                    <a
                      key={item.label}
                      href="#"
                      className={clsx(
                        'list-group-item list-group-item-action d-flex align-items-center border-0',
                        filter.toLowerCase() === item.label.toLowerCase()
                          ? 'active fw-bold'
                          : 'text-secondary'
                      )}
                      style={{ outline: 'none' }}
                      onClick={(e) => {
                        e.preventDefault()
                        setFilter(item.label.toLowerCase() as NotificationFilter)
                      }}
                    >
                      <span className={`status-dot bg-${item.color} me-2`}></span>
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-12 col-md-9 d-flex flex-column">
              <div className="flex-fill" style={{ minHeight: '500px' }}>
                <NavbarNotifications isPage limit={20} filter={filter} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
