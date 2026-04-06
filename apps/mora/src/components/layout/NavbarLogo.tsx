import { Link } from 'react-router-dom'
import { clsx } from 'clsx'

interface NavbarLogoProps {
  hideLogo?: boolean
  showTitle?: boolean | string
  href?: string
  prefix?: string
  header?: boolean
  className?: string
}

export function NavbarLogo({
  hideLogo,
  showTitle,
  href = '',
  prefix = 'navbar',
  header,
  className,
}: NavbarLogoProps) {
  const linkClass = clsx(`${prefix}-brand`, `${prefix}-brand-autodark`, className)

  const logoContent = (
    <>
      {!hideLogo && (
        <div className={clsx('navbar-brand-image d-flex align-items-center', showTitle && 'me-3')}>
          <img 
            src="/logo/mora-nobg.png" 
            alt="Mora" 
            height="24" 
            className="me-2"
            style={{ display: 'block', maxWidth: '100%', height: 'auto', maxHeight: '24px' }}
          />
          <span 
            className="h1 mb-0 fw-bold" 
            style={{ 
              color: 'var(--tblr-primary)', 
              letterSpacing: '-0.05rem',
              fontFamily: '"Comic Sans MS", "Comic Sans", cursive'
            }}
          >
            Mora
          </span>
        </div>
      )}
    </>
  )

  const to = href ? `/${href}` : '/'

  if (header) {
    return (
      <div className={linkClass}>
        <Link to={to} aria-label="Tabler">{logoContent}</Link>
      </div>
    )
  }

  return (
    <Link to={to} aria-label="Tabler" className={linkClass}>
      {logoContent}
    </Link>
  )
}