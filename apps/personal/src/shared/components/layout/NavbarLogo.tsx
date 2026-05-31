import { Link } from '@tanstack/react-router'
import { clsx } from 'clsx'

interface NavbarLogoProps {
  hideLogo?: boolean
  smallLogo?: boolean
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
        <div
          className={clsx('d-flex align-items-center', showTitle && 'me-3')}
          style={{ lineHeight: 1 }}
        >
          <div
            className="me-2"
            style={{
              width: 'clamp(32px, 8vw, 44px)',
              height: 'clamp(32px, 8vw, 44px)',
              backgroundColor: 'var(--tblr-primary)',
              WebkitMaskImage: 'url("/logo/logo-nobg-fill.png")',
              maskImage: 'url("/logo/logo-nobg-fill.png")',
              WebkitMaskSize: 'contain',
              maskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskPosition: 'center',
              flexShrink: 0,
            }}
          />
          <span
            className="h1 mb-0 fw-bold"
            style={{
              color: 'var(--tblr-primary)',
              letterSpacing: '-0.05rem',
              fontFamily: "'Slackey', cursive",
              lineHeight: 1,
            }}
          >
            mora
          </span>
        </div>
      )}
    </>
  )

  const to = href ? `/${href}` : '/'

  if (header) {
    return (
      <div className={linkClass}>
        <Link to={to} aria-label="Tabler">
          {logoContent}
        </Link>
      </div>
    )
  }

  return (
    <Link to={to} aria-label="Tabler" className={linkClass}>
      {logoContent}
    </Link>
  )
}
