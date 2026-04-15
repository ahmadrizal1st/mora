// src/layouts/PayLayout.tsx
import type { ReactNode } from 'react'
import { NavbarLogo } from '../components/layout/NavbarLogo'

interface PayLayoutProps {
  children: ReactNode
  /** URL for the close button — defaults to "/" */
  closeHref?: string
}

/**
 * PayLayout renders a minimal navbar with just logo + close button,
 * then wraps content in a .page div.
 * Equivalent to shared/layouts/pay.html (layout: base)
 */
export default function PayLayout({ children, closeHref = '/' }: PayLayoutProps) {
  return (
    <>
      <header className="navbar">
        <div className="container-fluid">
          <NavbarLogo smallLogo />
          <div>
            <a href={closeHref} className="btn btn-close" aria-label="Close" />
          </div>
        </div>
      </header>

      <div className="page">
        {children}
      </div>
    </>
  )
}