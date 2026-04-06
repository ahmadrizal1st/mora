// src/layouts/HomepageLayout.tsx
import { type ReactNode } from 'react';
import BaseLayout from './BaseLayout';

interface HomepageLayoutProps {
  children?: ReactNode;
  pageHeader?: string;
  title?: string;
  pageActions?: ReactNode;
  // Body modifiers
  bodyClass?: string;
  rtl?: boolean;
  // Sidebar
  sidebar?: boolean;
  sidebarDark?: boolean;
  sidebarEnd?: boolean;
  hideTopbar?: boolean;
  // Navbar modifiers
  navbarDark?: boolean;
  navbarCondensed?: boolean;
  navbarOverlap?: boolean;
  navbarSticky?: boolean;
  navbarTransparent?: boolean;
  navbarHideBrand?: boolean;
  navbarHidePageMenu?: boolean;
  navbarClass?: string;
}

export default function HomepageLayout({
  children,
  pageHeader,
  title,
  pageActions,
  bodyClass,
  rtl = false,
  sidebar = false,
  sidebarDark = false,
  sidebarEnd = false,
  hideTopbar = false,
  navbarDark = false,
  navbarCondensed = false,
  navbarOverlap = false,
  navbarSticky = false,
  navbarTransparent = false,
  navbarHideBrand = false,
  navbarHidePageMenu = false,
  navbarClass,
}: HomepageLayoutProps) {
  return (
    <BaseLayout
      pageTitle={title || pageHeader}
      pageActions={pageActions}
      bodyClass={bodyClass}
      dir={rtl ? 'rtl' : undefined}
      sidebar={sidebar}
      sidebarDark={sidebarDark}
      sidebarEnd={sidebarEnd}
      hideTopbar={hideTopbar}
      navbarDark={navbarDark}
      navbarCondensed={navbarCondensed}
      navbarOverlap={navbarOverlap}
      navbarSticky={navbarSticky}
      navbarTransparent={navbarTransparent}
      navbarHideBrand={navbarHideBrand}
      navbarHideMenu={navbarHidePageMenu}
      navbarClass={navbarClass}
    >
      {children}
    </BaseLayout>
  );
}
