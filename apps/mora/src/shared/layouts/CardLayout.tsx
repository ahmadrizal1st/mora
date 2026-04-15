// src/layouts/CardLayout.tsx
import type { ReactNode } from 'react'
import DefaultLayout from './DefaultLayout'

interface CardLayoutProps {
  children: ReactNode
  // Page header
  pageTitle?: string
  pagePretitle?: string
  pageDescription?: string
  pageActions?: ReactNode
  // Sidebar
  sidebar?: boolean
  sidebarDark?: boolean
  sidebarEnd?: boolean
  // Navbar
  hideTopbar?: boolean
  navbarCondensed?: boolean
  navbarOverlap?: boolean
  navbarDark?: boolean
  navbarSticky?: boolean
  navbarTransparent?: boolean
  navbarClass?: string
  rtl?: boolean
  bodyClass?: string
}

/**
 * CardLayout wraps page content inside a Bootstrap card.
 * Equivalent to shared/layouts/card.html (layout: default)
 */
export default function CardLayout({
  children,
  pageTitle,
  pagePretitle,
  pageDescription,
  pageActions,
  sidebar = true,
  sidebarDark,
  sidebarEnd,
  hideTopbar,
  navbarCondensed,
  navbarOverlap,
  navbarDark,
  navbarSticky,
  navbarTransparent,
  navbarClass,
  rtl,
  bodyClass,
}: CardLayoutProps) {
  return (
    <DefaultLayout
      pageTitle={pageTitle}
      pagePretitle={pagePretitle}
      pageDescription={pageDescription}
      pageActions={pageActions}
      sidebar={sidebar}
      sidebarDark={sidebarDark}
      sidebarEnd={sidebarEnd}
      hideTopbar={hideTopbar}
      navbarCondensed={navbarCondensed}
      navbarOverlap={navbarOverlap}
      navbarDark={navbarDark}
      navbarSticky={navbarSticky}
      navbarTransparent={navbarTransparent}
      navbarClass={navbarClass}
      rtl={rtl}
      bodyClass={bodyClass}
    >
      <div className="card">
        <div className="card-body">
          {children}
        </div>
      </div>
    </DefaultLayout>
  )
}