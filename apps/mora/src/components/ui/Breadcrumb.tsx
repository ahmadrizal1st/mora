import { clsx } from 'clsx'
import { Icon } from './Icon'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items?: BreadcrumbItem[]
  separator?: 'dot' | 'arrow' | 'bullet'
  homeIcon?: boolean
  className?: string
}

export function Breadcrumb({
  items = [
    { label: 'Home', href: '/' },
    { label: 'Library', href: '#' },
    { label: 'Data' },
  ],
  separator,
  homeIcon,
  className,
}: BreadcrumbProps) {
  const olClasses = clsx(
    'breadcrumb',
    separator && `breadcrumb-${separator}`,
    className
  )

  return (
    <nav aria-label="Breadcrumb">
      <ol className={olClasses}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          const isFirst = index === 0

          if (isLast) {
            return (
              <li key={index} className="breadcrumb-item active" aria-current="page">
                {item.label}
              </li>
            )
          }

          return (
            <li key={index} className="breadcrumb-item">
              {isFirst && homeIcon ? (
                <a href={item.href ?? '/'}>
                  <Icon icon="home" />
                </a>
              ) : (
                <a href={item.href ?? '#'}>{item.label}</a>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
