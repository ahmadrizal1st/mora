import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { NavbarLogo } from '../components/layout/NavbarLogo'

interface PayLayoutProps {
  children: ReactNode

  closeHref?: string
}

export default function PayLayout({ children, closeHref = '/' }: PayLayoutProps) {
  return (
    <>
      <header className="navbar">
        <div className="container-fluid">
          <NavbarLogo smallLogo />
          <div>
            <Link to={closeHref as '/'} className="btn btn-close" aria-label="Close" />
          </div>
        </div>
      </header>

      <div className="page">{children}</div>
    </>
  )
}
