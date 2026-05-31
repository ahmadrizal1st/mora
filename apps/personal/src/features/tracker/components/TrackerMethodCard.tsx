import { type FC } from 'react'
import { Link } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { Icon } from '@/shared/components/ui/Icon'
interface TrackerMethod {
  id: string
  label: string
  description: string
  path: string
  colorName: string
  icon: string
  isSolid?: boolean
}

interface TrackerMethodCardProps {
  method: TrackerMethod
  index: number
}

export const TrackerMethodCard: FC<TrackerMethodCardProps> = ({ method, index }) => {
  const cardBgClass = method.isSolid ? `bg-${method.colorName}` : `bg-${method.colorName}-lt`
  const textColorClass = method.isSolid ? 'text-white' : `text-${method.colorName}`
  const iconColor = method.isSolid ? '#ffffff' : `var(--tblr-${method.colorName})`

  return (
    <div
      className="col-6 col-md-4 tracker-animate-fade-in-up"
      style={{ animationDelay: `${0.2 + index * 0.08}s` }}
    >
      <Link
        to={method.path}
        className={clsx(
          'card border-0 shadow-sm h-100 text-decoration-none overflow-hidden position-relative transition-all',
          cardBgClass
        )}
        style={{
          borderRadius: '16px',
          minHeight: '150px',
        }}
      >
        <div
          className="position-absolute"
          style={{
            top: '-15px',
            right: '-15px',
            width: '120px',
            height: '120px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '50%',
            zIndex: 0,
          }}
        />
        <div
          className="position-absolute"
          style={{
            top: '10px',
            right: '10px',
            zIndex: 1,
            opacity: 0.15,
            transform: 'rotate(-15deg)',
            color: method.isSolid ? '#ffffff' : iconColor,
          }}
        >
          <Icon icon={method.icon} size={80} stroke={1.5} />
        </div>

        <div className="card-body p-4 position-relative d-flex flex-column" style={{ zIndex: 2 }}>
          <h3 className={clsx('fw-bold mb-2', textColorClass)} style={{ fontSize: '1.25rem' }}>
            {method.label}
          </h3>
          <p
            className={clsx('opacity-75 mb-0', textColorClass)}
            style={{ fontSize: '0.85rem', lineHeight: '1.4' }}
          >
            {method.description}
          </p>
        </div>
      </Link>
    </div>
  )
}
