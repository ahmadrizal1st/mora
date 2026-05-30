import { Link, useLocation } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { useState, useEffect } from 'react'
import { NavbarLogo } from './NavbarLogo'
import { Icon } from '../ui/Icon'
import { isNavItemActive } from '../../utils/navigation'
import menuData from '../../data/menu.json'
import type { NavItem } from '@/shared/types/common.types'

interface MenuSub {
  title: string
  url?: string
}

interface MenuChild {
  title: string
  url?: string
  children?: Record<string, MenuSub>
}

interface MenuSection {
  title: string
  icon?: string
  url?: string
  type?: 'header'
  children?: Record<string, MenuChild>
}

const navigationData: NavItem[] = Object.values(menuData as Record<string, MenuSection>).map((section) => ({
  label: section.title,
  icon: section.icon,
  href: section.url ? `/${section.url.replace('.html', '').replace(/^index$/, 'dashboard').replace(/\/index$/, '')}` : '#',
  type: section.type,
  dropdown: !!section.children,
  items: section.children
    ? Object.values(section.children).map((child) => ({
        label: child.title,
        href: child.url ? `/${child.url.replace('.html', '').replace(/^index$/, 'dashboard').replace(/\/index$/, '')}` : '#',
        items: child.children
          ? Object.values(child.children).map((sub) => ({
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
          <span className="nav-link-icon d-inline-block">
            {item.icon && <Icon icon={item.icon} />}
          </span>
          <span className="nav-link-title">{item.label}</span>
        </a>
        <div className="dropdown-menu">
          <div className="dropdown-menu-columns">
            <div className="dropdown-menu-column">
              {item.items?.map((subItem, index) => {
                const subActive = isNavItemActive(subItem, currentPath)
                const isExternal = !subItem.href || subItem.href === '#' || !subItem.href.startsWith('/')
                
                if (isExternal) {
                  return (
                    <a
                      key={index}
                      className={clsx('dropdown-item', subActive && 'active')}
                      href={subItem.href || '#'}
                    >
                      {subItem.label}
                    </a>
                  )
                }

                return (
                  <Link
                    key={index}
                    className={clsx('dropdown-item', subActive && 'active')}
                    to={subItem.href as string}
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

  const isExternal = !item.href || item.href === '#' || !item.href.startsWith('/')

  if (isExternal) {
    return (
      <li className={clsx('nav-item', active && 'active')}>
        <a className="nav-link" href={item.href || '#'}>
          <span className="nav-link-icon d-inline-block">
            {item.icon && <Icon icon={item.icon} />}
          </span>
          <span className="nav-link-title">{item.label}</span>
        </a>
      </li>
    )
  }

  return (
    <li className={clsx('nav-item', active && 'active')}>
      <Link className="nav-link" to={item.href as string}>
        <span className="nav-link-icon d-inline-block">
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
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    if (isMinimized) {
      document.body.classList.add('sidebar-minimized')
    } else {
      document.body.classList.remove('sidebar-minimized')
    }
    return () => {
      document.body.classList.remove('sidebar-minimized')
    }
  }, [isMinimized])

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
          <div className="mt-auto p-3 d-none d-lg-flex justify-content-center">
            <button 
              className="btn btn-icon btn-ghost-secondary rounded-circle" 
              onClick={() => setIsMinimized(!isMinimized)}
              aria-label="Toggle sidebar"
            >
              <Icon icon={isMinimized ? "chevron-right" : "chevron-left"} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}