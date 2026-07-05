import { useState, useRef, useEffect } from 'react'
import { Link } from '@tanstack/react-router'

function FeatureIcon({ type }: { type: string }) {
  const iconProps = {
    width: 24,
    height: 24,
    viewBox: '0 0 24 24',
    fill: 'none',
    strokeWidth: '2',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  const Indigo = 'var(--tblr-body-color)'
  const Primary = 'var(--tblr-primary)'

  switch (type) {
    case 'Analytics':
      return (
        <svg {...iconProps}>
          <path d="M18 20V10" stroke={Primary} />
          <path d="M12 20V4" stroke={Indigo} />
          <path d="M6 20v-6" stroke={Primary} />
        </svg>
      )
    case 'AI Advisor':
      return (
        <svg {...iconProps}>
          <path d="M12 2v3" stroke={Indigo} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="2" r="1.2" fill={Indigo} />
          <rect x="4" y="6" width="16" height="13" rx="4" stroke={Indigo} strokeWidth="1.5" />
          <circle
            cx="9"
            cy="12"
            r="1.8"
            fill={Primary}
            fillOpacity="0.15"
            stroke={Primary}
            strokeWidth="1.5"
          />
          <circle
            cx="15"
            cy="12"
            r="1.8"
            fill={Primary}
            fillOpacity="0.15"
            stroke={Primary}
            strokeWidth="1.5"
          />
          <path d="M9.5 16h5" stroke={Primary} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M4 11H2M22 11h-2" stroke={Indigo} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )
    case 'Tracker':
      return (
        <svg {...iconProps}>
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke={Indigo} />
          <path d="M14 2v6h6" stroke={Indigo} strokeWidth="1.5" />
          <path d="m9 15 2 2 4-4" stroke={Primary} strokeWidth="2.5" />
        </svg>
      )
    case 'Assets':
      return (
        <svg {...iconProps}>
          <path d="M3 21h18" stroke={Indigo} strokeWidth="1.5" />
          <path d="M5 21V7l7-4 7 4v14" stroke={Indigo} strokeWidth="1.5" />
          <path d="M9 21v-8h6v8" stroke={Primary} strokeWidth="1.5" />
        </svg>
      )
    case 'Subs':
      return (
        <svg {...iconProps}>
          <path d="M17 1l4 4-4 4" stroke={Primary} />
          <path d="M3 11V9a4 4 0 0 1 4-4h14" stroke={Indigo} />
          <path d="M7 23l-4-4 4-4" stroke={Primary} />
          <path d="M21 13v2a4 4 0 0 1-4 4H3" stroke={Indigo} />
        </svg>
      )
    case 'Portfolio':
      return (
        <svg {...iconProps}>
          <path d="M21.21 15.89A10 10 0 1 1 8 2.83" stroke={Indigo} />
          <path d="M22 12A10 10 0 0 0 12 2v10" stroke={Primary} />
          <circle cx="12" cy="12" r="3" fill={Primary} stroke="white" strokeWidth="1" />
        </svg>
      )
    case 'Market':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="9.5" stroke={Indigo} strokeWidth="1.5" />
          <path
            d="M2.5 12h19"
            stroke={Indigo}
            strokeWidth="1"
            strokeOpacity="0.35"
            strokeDasharray="2 2"
          />
          <path
            d="M7 15.5l3.5-5 2.5 3 3.5-5.5"
            stroke={Primary}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'Goals':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="10" stroke={Indigo} />
          <circle cx="12" cy="12" r="4" fill={Primary} stroke={Primary} />
        </svg>
      )
    case 'Academy':
      return (
        <svg {...iconProps}>
          <path d="M22 10v6" stroke={Indigo} />
          <path d="M2 10l10-5 10 5-10 5-10-5z" stroke={Indigo} strokeWidth="2" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" stroke={Primary} strokeWidth="2" />
        </svg>
      )
    case 'Crypto':
      return (
        <svg {...iconProps}>
          <path
            d="M12 3L20 7.5V12"
            stroke={Indigo}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 3L4 7.5V12"
            stroke={Indigo}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 12v4.5L12 21l8-4.5V12"
            stroke={Indigo}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 12L4 7.5" stroke={Indigo} strokeWidth="1" strokeOpacity="0.3" />
          <path d="M12 12L20 7.5" stroke={Indigo} strokeWidth="1" strokeOpacity="0.3" />
          <circle cx="12" cy="12" r="2.5" fill={Primary} stroke="white" strokeWidth="1.5" />
        </svg>
      )
    case 'Notif':
      return (
        <svg {...iconProps}>
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke={Indigo} />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke={Indigo} />
          <circle cx="18" cy="6" r="3.5" fill={Primary} stroke="white" strokeWidth="1.5" />
        </svg>
      )
    case 'Security':
      return (
        <svg {...iconProps}>
          <path
            d="M12 21.5s-8-3.8-8-9.5V5.5l8-3 8 3V12c0 5.7-8 9.5-8 9.5z"
            stroke={Indigo}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M9 12l2 2 4-4"
            stroke={Primary}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'Trophy':
      return (
        <svg {...iconProps}>
          <path d="M8 21h8M12 17v4M7 4h10" stroke={Indigo} strokeWidth="1.5" />
          <path d="M17 4v8a5 5 0 0 1-10 0V4" stroke={Indigo} strokeWidth="1.5" />
          <path d="M15 9h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" stroke={Primary} strokeWidth="1.5" />
          <path d="M9 9H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke={Primary} strokeWidth="1.5" />
        </svg>
      )
    case 'History':
      return (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="9" stroke={Indigo} strokeWidth="1.5" />
          <path d="M12 7v5l3 3" stroke={Primary} strokeWidth="2" strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}

export function MobileGridMenu() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [canScroll, setCanScroll] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      setCanScroll(scrollRef.current.scrollWidth > scrollRef.current.clientWidth + 5)
    }
  }, [])

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', icon: 'Analytics' },
    { label: 'Assets', href: '/assets', icon: 'Assets' },
    { label: 'Tracker', href: '/tracker', icon: 'Tracker' },
    { label: 'Planning', href: '/planning', icon: 'Goals' },
    { label: 'Credit', href: '/credit', icon: 'Security' },
    { label: 'Achievements', href: '/achievements', icon: 'Trophy' },
    { label: 'History', href: '/activity', icon: 'History' },
    { label: 'Accounts', href: '/accounts', icon: 'Portfolio' },
  ]

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement
    const progress = target.scrollLeft / (target.scrollWidth - target.clientWidth)
    setScrollProgress(progress)
  }

  const groupedItems = []
  for (let i = 0; i < menuItems.length; i += 2) {
    groupedItems.push(menuItems.slice(i, i + 2))
  }

  return (
    <div className="card border-0 shadow-sm d-lg-none overflow-hidden">
      <div className="card-body pt-3 px-3 pb-2">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="d-flex flex-nowrap overflow-auto hide-scrollbar pb-1"
          style={{ gap: '0.75rem', scrollSnapType: 'x mandatory' }}
        >
          {groupedItems.map((group, groupIdx) => (
            <div
              key={groupIdx}
              className="d-flex flex-column gap-2"
              style={{
                flex: `0 0 calc((100% - (3 * 0.75rem)) / 4)`,
                scrollSnapAlign: 'start',
              }}
            >
              {group.map((item, i) => (
                <Link
                  key={i}
                  to={item.href}
                  className="text-decoration-none d-flex flex-column align-items-center transition-all"
                  style={{ transition: 'transform 0.1s ease' }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                  onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
                  onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <div
                    className={`bg-primary-lt d-flex align-items-center justify-content-center mb-1 shadow-none`}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'calc(var(--tblr-border-radius) / 0.25rem * 35%)',
                      border: '1px solid rgba(47, 179, 68, 0.08)',
                    }}
                  >
                    <FeatureIcon type={item.icon || item.label} />
                  </div>
                  <div
                    className="fw-medium text-truncate w-100 text-center text-mobile-xs"
                    style={{ fontSize: '0.62rem', letterSpacing: '0.01em' }}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>

        {canScroll && (
          <div className="d-flex justify-content-center mt-2">
            <div
              className="position-relative bg-secondary-lt rounded-pill overflow-hidden"
              style={{ width: '28px', height: '3px' }}
            >
              <div
                className="position-absolute h-100 bg-primary rounded-pill transition-all"
                style={{
                  width: '10px',
                  left: `${(Number.isNaN(scrollProgress) ? 0 : scrollProgress) * 18}px`,
                  transition: 'left 0.1s ease-out',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
