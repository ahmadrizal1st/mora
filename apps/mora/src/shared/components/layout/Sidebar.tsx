import { Link, useLocation } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { NavbarLogo } from './NavbarLogo'
import { Icon } from '../ui/Icon'
import { isNavItemActive } from '../../utils/navigation'
import menuData from '../../data/menu.json'
import type { NavItem } from '@/shared/types/common.types'

const navigationData: NavItem[] = Object.values(menuData).map((section: any) => ({
  label: section.title,
  icon: section.icon,
  type: section.type,
  dropdown: !!section.children,
  items: section.children
    ? Object.values(section.children).map((child: any) => ({
        label: child.title,
        href: child.url ? `/${child.url.replace('.html', '').replace(/^index$/, 'dashboard').replace(/\/index$/, '')}` : '#',
        items: child.children
          ? Object.values(child.children).map((sub: any) => ({
              label: sub.title,
              href: sub.url ? `/${sub.url.replace('.html', '').replace(/\/index$/, '')}` : '#',
            }))
          : undefined,
      }))
    : undefined,
}))

interface SidebarProps {
  end?: boolean
  breakpoint?: string
  transparent?: boolean
  dark?: boolean
  background?: string
  className?: string
  hideBrand?: boolean
  children?: React.ReactNode
}

function SidebarMenuItem({ item, currentPath }: { item: NavItem; currentPath: string }) {
  const active = isNavItemActive(item, currentPath)

  if (item.dropdown) {
    return (
      <li className={clsx('nav-item', 'dropdown', active && 'active')}>
        <a
          className="nav-link dropdown-toggle"
          href={item.href || '#'}
          data-bs-toggle="dropdown"
          data-bs-auto-close="outside"
          role="button"
          aria-expanded="false"
        >
          <span className="nav-link-icon d-md-none d-lg-inline-block">
            {item.icon && <Icon icon={item.icon} />}
          </span>
          <span className="nav-link-title">{item.label}</span>
        </a>
        <div className="dropdown-menu">
          <div className="dropdown-menu-columns">
            <div className="dropdown-menu-column">
              {item.items?.map((subItem, index) => {
                const subActive = isNavItemActive(subItem, currentPath)
                return (
                  <Link
                    key={index}
                    className={clsx('dropdown-item', subActive && 'active')}
                    to={subItem.href || '#'}
                  >
                    {subItem.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </li>
    )
  }

  return (
    <li className={clsx('nav-item', active && 'active')}>
      <Link className="nav-link" to={item.href || '#'}>
        <span className="nav-link-icon d-md-none d-lg-inline-block">
          {item.icon && <Icon icon={item.icon} />}
        </span>
        <span className="nav-link-title">{item.label}</span>
      </Link>
    </li>
  )
}

export function Sidebar({
  end,
  breakpoint = 'lg',
  transparent,
  dark,
  background,
  className,
  hideBrand,
  children,
}: SidebarProps) {
  const location = useLocation()
  const currentPath = location.pathname

  const classes = clsx(
    'navbar',
    'navbar-vertical',
    end && 'navbar-end',
    `navbar-expand-${breakpoint}`,
    transparent && 'navbar-transparent',
    background && `bg-${background}`,
    className
  )

  return (
    <aside className={classes} {...(dark ? { 'data-bs-theme': 'dark' } : {})}>
      <div className="container-fluid">
        <button
          className="navbar-toggler d-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebar-menu"
          aria-controls="sidebar-menu"
          aria-expanded="false"
          aria-label="Toggle sidebar navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {!hideBrand && (
          <NavbarLogo
            header
            showTitle
          />
        )}

        <div className="collapse navbar-collapse" id="sidebar-menu">
          <ul className="navbar-nav pt-lg-3">
            {navigationData.map((item, index) => (
              <SidebarMenuItem key={index} item={item} currentPath={currentPath} />
            ))}
            {children}
          </ul>
        </div>
      </div>
    </aside>
  )
}