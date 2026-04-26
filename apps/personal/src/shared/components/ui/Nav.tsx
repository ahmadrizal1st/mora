import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import { Icon } from './Icon'

export interface NavItem {
  label: string
  href?: string
  icon?: string
  active?: boolean
  disabled?: boolean
  end?: boolean
}

export interface NavProps {
  items?: NavItem[]
  pills?: boolean
  tabs?: boolean
  header?: boolean
  className?: string
  children?: ReactNode
}

export function Nav({
  items,
  pills,
  tabs,
  header,
  className,
  children,
}: NavProps) {
  const ulClasses = clsx(
    'nav',
    pills && (header ? 'nav-pills card-header-pills' : 'nav-pills'),
    tabs && (header ? 'nav-tabs card-header-tabs' : 'nav-tabs'),
    className
  )

  if (children) {
    return <ul className={ulClasses}>{children}</ul>
  }

  const defaultItems: NavItem[] = items ?? [
    { label: 'Active', href: '#', active: true },
    { label: 'Link', href: '#', icon: 'star' },
    { label: 'Disabled', href: '#', disabled: true },
    { label: '', href: '#', icon: 'settings', end: true },
  ]

  return (
    <ul className={ulClasses}>
      {defaultItems.map((item, i) => (
        <li key={i} className={clsx('nav-item', item.end && 'ms-auto')}>
          <a
            className={clsx(
              'nav-link',
              item.active && 'active',
              item.disabled && 'disabled'
            )}
            href={item.href ?? '#'}
            {...(item.disabled ? { tabIndex: -1, 'aria-disabled': true } : {})}
          >
            {item.icon && <Icon icon={item.icon} className="nav-link-icon" />}
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  )
}
