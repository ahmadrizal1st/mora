import type { ReactNode } from 'react'
import DefaultLayout from './DefaultLayout'

interface CardLayoutProps {
  children: ReactNode

  pageTitle?: string
  pagePretitle?: string
  pageDescription?: string
  pageActions?: ReactNode

  sidebar?: boolean
  sidebarDark?: boolean
  sidebarEnd?: boolean

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
        <div className="card-body">{children}</div>
      </div>
    </DefaultLayout>
  )
}
