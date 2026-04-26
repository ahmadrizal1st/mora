import { type ReactNode } from 'react'
import { useLocation } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { Navbar } from '../components/layout/Navbar'
import { Sidebar } from '../components/layout/Sidebar'
import { PageHeader } from '../components/layout/PageHeader'
import { Footer } from '../components/layout/Footer'

interface BaseLayoutProps {
  children: ReactNode
  sidebar?: boolean
  sidebarDark?: boolean
  sidebarEnd?: boolean
  hideTopbar?: boolean
  navbarCondensed?: boolean
  navbarOverlap?: boolean
  navbarDark?: boolean
  navbarSticky?: boolean
  navbarTransparent?: boolean
  navbarHideBrand?: boolean
  navbarHideMenu?: boolean
  navbarClass?: string
  wrapperFull?: boolean
  noContainer?: boolean
  containerCentered?: boolean
  containerClass?: string
  containerFlushMobile?: boolean
  pageTitle?: string
  pageIcon?: string
  pagePretitle?: React.ReactNode
  pageDescription?: string
  pageActions?: ReactNode
  bodyClass?: string
  hideFooter?: boolean
  dir?: 'ltr' | 'rtl'
  showBackButton?: boolean
  flush?: boolean
}

export default function BaseLayout({
  children,
  sidebar = false,
  sidebarDark,
  sidebarEnd,
  hideTopbar,
  navbarCondensed,
  navbarOverlap,
  navbarDark,
  navbarSticky,
  navbarTransparent,
  navbarHideBrand,
  navbarClass,
  wrapperFull,
  noContainer,
  containerCentered,
  containerClass,
  containerFlushMobile,
  pageTitle,
  pageIcon,
  pagePretitle,
  pageDescription,
  pageActions,
  bodyClass,
  hideFooter = false,
  dir,
  showBackButton = true,
  flush = false,
}: BaseLayoutProps) {
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/' || location.pathname === '/dashboard-crypto'

  const containerClasses = clsx(
    containerFlushMobile ? 'container-xl px-0 px-md-3' : 'container-xl',
    containerCentered && 'my-auto',
    containerClass
  )

  return (
    <div className={clsx('page', isDashboard && 'mobile-page-gradient')} dir={dir}>
      {sidebar && (
        <Sidebar dark={sidebarDark} end={sidebarEnd} />
      )}

      {!hideTopbar && (
        <Navbar
          condensed={navbarCondensed || sidebar}
          overlap={navbarOverlap}
          dark={navbarDark}
          sticky={navbarSticky}
          transparent={navbarTransparent}
          hideBrand={navbarHideBrand || sidebar}
          className={clsx(navbarClass, !isDashboard && 'd-none d-md-flex')}
        />
      )}

      <div className={clsx('page-wrapper', wrapperFull && 'page-wrapper-full', 'mobile-bottom-nav-gap', isDashboard && 'mobile-layout-wrapper')}>
        {(pageTitle || pagePretitle || pageActions) && (
          <PageHeader
            title={pageTitle}
            icon={pageIcon}
            pretitle={pagePretitle}
            description={pageDescription}
            actions={pageActions}
            showBackButton={showBackButton}
            containerClass={containerFlushMobile ? 'px-2 px-md-2' : undefined}
            className={clsx((navbarOverlap && navbarDark) && 'text-white')}
          />
        )}

        <main id="content" className={clsx('page-body', bodyClass, flush && 'pt-0')}>
          {wrapperFull || noContainer ? (
            children
          ) : (
            <div className={containerClasses}>
              {children}
            </div>
          )}
        </main>

        {!hideFooter && <Footer />}
      </div>
    </div>
  )
}