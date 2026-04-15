import { useLocation, Link } from 'react-router-dom'
import { clsx } from 'clsx'
import { Icon } from '../ui/Icon'
import { isNavItemActive } from '../../utils/navigation'

import type { NavItem } from '@/shared/types/common.types'

export type { NavItem }

function NavSubMenu({ items, currentPath }: { items: NavItem[]; currentPath: string }) {
  return (
    <div className="dropdown-menu">
      {items.map((item, index) => {
        if (item.items && item.items.length > 0) {
          return (
            <div key={index} className="dropend">
              <a
                className="dropdown-item dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                role="button"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {item.label}
              </a>
              <NavSubMenu items={item.items} currentPath={currentPath} />
            </div>
          )
        }
        const active = isNavItemActive(item, currentPath)
        const isExternal = item.href?.startsWith('http')
        if (isExternal) {
          return (
            <a
              key={index}
              className={clsx('dropdown-item', active && 'active')}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.label}
            </a>
          )
        }
        return (
          <Link
            key={index}
            className={clsx('dropdown-item', active && 'active')}
            to={item.href || '#'}
            {...(active ? { 'aria-current': 'page' } : {})}
          >
            {item.label}
          </Link>
        )
      })}
    </div>
  )
}

function NavMenuDropdown({
  items,
  columns,
  currentPath,
}: {
  items: NavItem[]
  columns?: number
  currentPath: string
}) {
  if (!columns || columns <= 1) {
    return (
      <div className="dropdown-menu">
        {items.map((subItem, index) => (
          <NavMenuDropdownItem key={index} item={subItem} currentPath={currentPath} />
        ))}
      </div>
    )
  }

  const perCol = Math.ceil(items.length / columns)
  const cols: NavItem[][] = Array.from({ length: columns }, (_, i) =>
    items.slice(i * perCol, (i + 1) * perCol)
  )

  return (
    <div className="dropdown-menu">
      <div className="dropdown-menu-columns">
        {cols.map((colItems, ci) => (
          <div key={ci} className="dropdown-menu-column">
            {colItems.map((subItem, index) => (
              <NavMenuDropdownItem key={index} item={subItem} currentPath={currentPath} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function NavMenuDropdownItem({ item, currentPath }: { item: NavItem; currentPath: string }) {
  if (item.items && item.items.length > 0) {
    return (
      <div className="dropend">
        <a
          className="dropdown-item dropdown-toggle"
          href="#"
          data-bs-toggle="dropdown"
          data-bs-auto-close="outside"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {item.label}
        </a>
        <NavSubMenu items={item.items} currentPath={currentPath} />
      </div>
    )
  }
  const active = isNavItemActive(item, currentPath)
  const isExternal = item.href?.startsWith('http')

  if (isExternal) {
    return (
      <a
        className={clsx('dropdown-item', active && 'active')}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
      >
        {item.label}
        {item.badge && (
          <span className="badge badge-sm bg-green-lt text-uppercase ms-auto">{item.badge}</span>
        )}
      </a>
    )
  }

  return (
    <Link
      className={clsx('dropdown-item', active && 'active')}
      to={item.href || '#'}
      {...(active ? { 'aria-current': 'page' } : {})}
    >
      {item.label}
      {item.badge && (
        <span className="badge badge-sm bg-green-lt text-uppercase ms-auto">{item.badge}</span>
      )}
    </Link>
  )
}

function NavMenuItem({ item, currentPath }: { item: NavItem; currentPath: string }) {
  if (item.type === 'header') return null
  const active = item.active || isNavItemActive(item, currentPath)

  if (item.dropdown) {
    return (
      <li className={clsx('nav-item', 'dropdown', active && 'active')}>
        <a
          className="nav-link dropdown-toggle"
          href={`#navbar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
          data-bs-toggle="dropdown"
          data-bs-auto-close="outside"
          role="button"
          aria-haspopup="true"
          aria-expanded="false"
          {...(active ? { 'aria-current': 'page' } : {})}
        >
          {!item.hideIcons && (
            <span className="nav-link-icon d-md-none d-lg-inline-block">
              {item.icon && <Icon icon={item.icon} />}
            </span>
          )}
          <span className="nav-link-title">{item.label}</span>
          {item.badge && (
            <span className="badge badge-sm bg-red text-red-fg">{item.badge}</span>
          )}
        </a>
        <NavMenuDropdown
          items={item.items || []}
          columns={item.columns}
          currentPath={currentPath}
        />
      </li>
    )
  }

  const navLinkClasses = clsx('nav-link', item.disabled && 'disabled')

  return (
    <li className={clsx('nav-item', active && 'active', item.disabled && 'disabled')}>
      {item.disabled ? (
        <a
          className={navLinkClasses}
          href="#"
          tabIndex={-1}
          aria-disabled={true}
        >
          {!item.hideIcons && (
            <span className="nav-link-icon d-md-none d-lg-inline-block">
              {item.icon && <Icon icon={item.icon} />}
            </span>
          )}
          <span className="nav-link-title">{item.label}</span>
          {item.badge && (
            <span className={clsx('badge', 'badge-sm', item.badgeColor || 'bg-red text-red-fg')}>
              {item.badge}
            </span>
          )}
        </a>
      ) : item.href?.startsWith('http') ? (
        <a
          className="nav-link"
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          {!item.hideIcons && (
            <span className="nav-link-icon d-md-none d-lg-inline-block">
              {item.icon && <Icon icon={item.icon} />}
            </span>
          )}
          <span className="nav-link-title">{item.label}</span>
          {item.badge && (
            <span className={clsx('badge', 'badge-sm', item.badgeColor || 'bg-red text-red-fg')}>
              {item.badge}
            </span>
          )}
        </a>
      ) : (
        <Link
          className="nav-link"
          to={item.href || '#'}
          {...(active ? { 'aria-current': 'page' } : {})}
        >
          {!item.hideIcons && (
            <span className="nav-link-icon d-md-none d-lg-inline-block">
              {item.icon && <Icon icon={item.icon} />}
            </span>
          )}
          <span className="nav-link-title">{item.label}</span>
          {item.badge && (
            <span className={clsx('badge', 'badge-sm', item.badgeColor || 'bg-red text-red-fg')}>
              {item.badge}
            </span>
          )}
        </Link>
      )}
    </li>
  )
}

interface NavbarMenuProps {
  items: NavItem[]
  hideIcons?: boolean
  longTitles?: boolean
}

export function NavbarMenu({ items, hideIcons, longTitles }: NavbarMenuProps) {
  const location = useLocation()
  const currentPath = location.pathname

  const menuItems = items.map((item) => ({
    ...item,
    hideIcons: hideIcons || item.hideIcons,
    longTitles: longTitles || item.longTitles,
  }))

  return (
    <ul className="navbar-nav">
      {menuItems.map((item, index) => (
        <NavMenuItem key={index} item={item} currentPath={currentPath} />
      ))}
    </ul>
  )
}