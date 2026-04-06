// src/layouts/DefaultLayout.tsx
import { type ReactNode } from 'react'
import BaseLayout from './BaseLayout'

interface DefaultLayoutProps {
  children: ReactNode
  // Page header
  pageTitle?: string
  pagePretitle?: string
  pageDescription?: string
  pageActions?: ReactNode
  // Container
  noContainer?: boolean
  containerCentered?: boolean
  containerClass?: string
  wrapperFull?: boolean
  // Sidebar
  sidebar?: boolean
  sidebarDark?: boolean
  sidebarEnd?: boolean
  // Navbar
  hideTopbar?: boolean
  navbarCondensed?: boolean
  navbarOverlap?: boolean
  navbarDark?: boolean
  navbarHideBrand?: boolean
  navbarHideMenu?: boolean
  navbarSticky?: boolean
  navbarTransparent?: boolean
  navbarClass?: string
  // RTL
  rtl?: boolean
  bodyClass?: string
}

export default function DefaultLayout({
  children,
  pageTitle,
  pagePretitle,
  pageDescription,
  pageActions,
  noContainer,
  containerCentered,
  containerClass,
  wrapperFull,
  sidebar = false,
  sidebarDark,
  sidebarEnd,
  hideTopbar,
  navbarCondensed,
  navbarOverlap,
  navbarDark,
  navbarHideBrand,
  navbarHideMenu,
  navbarSticky,
  navbarTransparent,
  navbarClass,
  rtl,
  bodyClass,
}: DefaultLayoutProps) {
  return (
    <BaseLayout
      sidebar={sidebar}
      sidebarDark={sidebarDark}
      sidebarEnd={sidebarEnd}
      hideTopbar={hideTopbar}
      navbarCondensed={navbarCondensed}
      navbarOverlap={navbarOverlap}
      navbarDark={navbarDark}
      navbarHideBrand={navbarHideBrand}
      navbarHideMenu={navbarHideMenu}
      navbarSticky={navbarSticky}
      navbarTransparent={navbarTransparent}
      navbarClass={navbarClass}
      wrapperFull={wrapperFull}
      noContainer={noContainer}
      pageTitle={pageTitle}
      pagePretitle={pagePretitle}
      pageDescription={pageDescription}
      pageActions={pageActions}
      containerCentered={containerCentered}
      containerClass={containerClass}
      bodyClass={bodyClass}
      dir={rtl ? 'rtl' : undefined}
    >
      {children}
    </BaseLayout>
  )
}