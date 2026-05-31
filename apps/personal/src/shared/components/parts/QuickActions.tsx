import { Icon } from '../ui/Icon'
import { clsx } from 'clsx'

export function QuickActions() {
  const actions = [
    { label: 'Top Up', icon: 'square-plus' },
    { label: 'Transfer', icon: 'coin' },
    { label: 'Request', icon: 'arrow-down-left' },
    { label: 'History', icon: 'clock' },
    { label: 'Assets', icon: 'building-bank', href: '/assets' },
  ]

  return (
    <div className="card border-0 bg-primary mb-0">
      <div className="card-body p-1">
        <div className="row g-0">
          {actions.map((a, i) => (
            <div
              key={i}
              className={clsx(
                'col text-center py-1',
                i < actions.length - 1 && 'border-end border-white-50'
              )}
            >
              <a
                href={a.href || '#'}
                style={{ cursor: 'pointer', textDecoration: 'none' }}
                className="d-flex flex-column align-items-center text-white"
              >
                <div className="mb-0">
                  <Icon icon={a.icon} color="white" size="sm" />
                </div>
                <div
                  className="subheader text-white fw-bold"
                  style={{ fontSize: '0.6rem', textTransform: 'none' }}
                >
                  {a.label}
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
