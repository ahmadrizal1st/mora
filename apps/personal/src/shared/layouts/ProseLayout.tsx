// src/layouts/ProseLayout.tsx
import type { ReactNode } from 'react'
import DefaultLayout from './DefaultLayout'

interface ProseLayoutProps {
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
  navbarDark?: boolean
  navbarSticky?: boolean
  navbarTransparent?: boolean
  rtl?: boolean
  bodyClass?: string
}

/**
 * ProseLayout puts content inside a centered card with .prose class.
 * Used for markdown / long-form text pages.
 * Equivalent to shared/layouts/prose.html (layout: default)
 */
export default function ProseLayout({
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
  navbarDark,
  navbarSticky,
  navbarTransparent,
  rtl,
  bodyClass,
}: ProseLayoutProps) {
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
      navbarDark={navbarDark}
      navbarSticky={navbarSticky}
      navbarTransparent={navbarTransparent}
      rtl={rtl}
      bodyClass={bodyClass}
    >
      <div className="row justify-content-center">
        <div className="col-lg-10 col-xl-9">
          <div className="card card-lg">
            <div className="card-body prose">
              {children}
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  )
}