import { useRef, useCallback, useMemo } from 'react'
import { clsx } from 'clsx'
import { NavbarLogo } from './NavbarLogo'
import { NavbarSide } from './NavbarSide'
import { NavbarMenu } from './NavbarMenu'
import type { NavItem } from './NavbarMenu'
import { Icon } from '../ui/Icon'
import { Button } from '../ui/Button'
import { useTheme } from '@/shared/context/ThemeContext'
import { useSettingsStore } from '@/shared/store/useSettingsStore'
import menuData from '../../data/menu.json'

interface MenuSub {
  title: string
  url?: string
}

interface MenuChild {
  title: string
  url?: string
  badge?: string
  children?: Record<string, MenuSub>
}

interface MenuSection {
  title: string
  icon?: string
  url?: string
  columns?: number
  children?: Record<string, MenuChild>
}


interface NavbarProps {
  breakpoint?: string
  condensed?: boolean
  transparent?: boolean
  dark?: boolean
  sticky?: boolean
  overlap?: boolean
  className?: string
  hideBrand?: boolean
  personId?: number
  hideUsername?: boolean
  showTheme?: boolean
  showNotifications?: boolean
  showLanguage?: boolean
  showUser?: boolean
  backgroundColor?: string
  background?: string
  hideSearch?: boolean
  fluidSearch?: boolean
  hideIcons?: boolean
  longTitles?: boolean
  showTitle?: boolean | string
  hideLogo?: boolean
}

export function Navbar({
  breakpoint = 'md',
  condensed,
  transparent,
  dark,
  sticky,
  overlap,
  className,
  hideBrand,
  personId = 1,
  hideUsername = false,
  showTheme = true,
  showNotifications = true,
  showLanguage = true,
  showUser = true,
  backgroundColor,
  background,
  hideSearch,
  fluidSearch,
  hideIcons,
  longTitles,
  showTitle,
  hideLogo,
}: NavbarProps) {
  const { openSettings } = useTheme()
  const { enableAdvancedCredit } = useSettingsStore()
  const headerRef = useRef<HTMLElement>(null)

  const navigationData: NavItem[] = useMemo(() => {
    const filteredMenuData = Object.entries(menuData).reduce((acc, [key, section]) => {
      if (key === 'credit' && !enableAdvancedCredit) return acc
      acc[key] = section as MenuSection
      return acc
    }, {} as Record<string, MenuSection>)

    return Object.values(filteredMenuData).map(
      (section) => ({
        label: section.title,
        icon: section.icon,
        href: section.url
          ? `/${section.url
              .replace('.html', '')
              .replace(/^index$/, 'dashboard')
              .replace(/\/index$/, '')}`
          : '#',
        dropdown: !!section.children,
        columns: section.columns,
        items: section.children
          ? Object.values(section.children).map((child) => ({
              label: child.title,
              href: child.url
                ? `/${child.url
                    .replace('.html', '')
                    .replace(/^index$/, 'dashboard')
                    .replace(/\/index$/, '')}`
                : '#',
              badge: child.badge,
              items: child.children
                ? Object.values(child.children).map((sub) => ({
                    label: sub.title,
                    href: sub.url ? `/${sub.url.replace('.html', '').replace(/\/index$/, '')}` : '#',
                  }))
                : undefined,
            }))
          : undefined,
      })
    )
  }, [enableAdvancedCredit])

  const handleNavClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    const focusable = target.closest('button, a, [tabindex]') as HTMLElement | null
    if (focusable) {
      setTimeout(() => focusable.blur(), 0)
    }
  }, [])

  const headerClasses = clsx(
    'navbar',
    `navbar-expand-${breakpoint}`,
    transparent && 'navbar-transparent',
    sticky && 'sticky-top',
    overlap && 'navbar-overlap',
    background && `bg-${background}`,
    'bg-transparent bg-md-white',
    'd-print-none',
    className
  )

  const topBar = (
    <header
      ref={headerRef}
      className={clsx(headerClasses, 'border-0 border-md-bottom')}
      onClick={handleNavClick}
      {...(dark ? { 'data-bs-theme': 'dark' } : {})}
      {...(backgroundColor ? { style: { background: backgroundColor, height: '60px' } } : { style: { height: '60px' } })}
    >
      <div className="container-xl d-flex align-items-center justify-content-between" style={{ height: '60px', paddingLeft: '1rem', paddingRight: '1rem' }}>
        <button
          className="navbar-toggler d-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar-menu"
          aria-controls="navbar-menu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {!hideBrand && (
          <NavbarLogo
            showTitle={showTitle}
            hideLogo={hideLogo}
            className="d-none-navbar-horizontal pe-0 pe-md-3"
          />
        )}

        <NavbarSide
          breakpoint={breakpoint}
          personId={personId}
          hideUsername={hideUsername}
          dark={dark}
          showTheme={showTheme}
          showNotifications={showNotifications}
          showLanguage={showLanguage}
          showUser={showUser}
          className="order-md-last"
        />

        {condensed && (
          <div className="collapse navbar-collapse" id="navbar-menu">
            <div className="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center">
              <nav aria-label="Primary">
                <NavbarMenu items={navigationData} hideIcons={hideIcons} longTitles={longTitles} />
              </nav>

              {!hideSearch && (
                <div
                  className={clsx(
                    'ms-md-auto',
                    'ps-md-4',
                    'py-2',
                    'py-md-0',
                    'me-md-4',
                    'order-first',
                    'order-md-last',
                    'flex-grow-1',
                    !fluidSearch && 'flex-md-grow-0'
                  )}
                >
                  <form action="./" method="get" autoComplete="off" noValidate>
                    <div className="input-icon">
                      <span className="input-icon-addon">
                        <Icon icon="search" />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search…"
                        aria-label="Search"
                      />
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )

  const menuBar = !condensed && (
    <div className={clsx(`navbar-expand-${breakpoint}`)} onClick={handleNavClick} style={{ height: '56px' }}>
      <div className="collapse navbar-collapse h-100" id="navbar-menu">
        <div className="navbar h-100 p-0 border-0">
          <div className="container-xl h-100 d-flex align-items-center" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
            <div className="d-flex flex-column flex-md-row align-items-center w-100">
              <div className="flex-grow-1">
                <nav aria-label="Primary">
                  <NavbarMenu
                    items={navigationData}
                    hideIcons={hideIcons}
                    longTitles={longTitles}
                  />
                </nav>
              </div>

              <div className="flex-shrink-0">
                <ul className="navbar-nav flex-row align-items-center gap-2">
                  <li className="nav-item d-flex align-items-center">
                    <Button
                      to="/ai/chat"
                      ghost
                      size="sm"
                      icon="message-chatbot"
                      text="Mora AI"
                      className="fw-medium text-body px-2"
                    />
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        openSettings()
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <span className="nav-link-icon d-md-none d-lg-inline-block">
                        <Icon icon="settings" />
                      </span>
                      <span className="nav-link-title">Theme Settings</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {sticky ? (
        <div className="sticky-top">
          {topBar}
          {menuBar}
        </div>
      ) : (
        <>
          {topBar}
          {menuBar}
        </>
      )}
    </>
  )
}
