// src/layouts/SettingsLayout.tsx
import { NavbarLogo } from '../components/layout/NavbarLogo'

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="wrapper">
      <aside className="navbar navbar-vertical navbar-expand-lg">
        <div className="container-fluid">
          <NavbarLogo />
        </div>
      </aside>
      <div className="page-wrapper">
        <div className="page-body">
          <div className="container-xl">
            <div className="card">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}