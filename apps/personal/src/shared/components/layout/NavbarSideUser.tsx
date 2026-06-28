import { Link, useNavigate } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { Icon } from '../ui/Icon'
import { Avatar } from '../ui/Avatar'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useSettingsStore } from '@/shared/store/useSettingsStore'
import type { Person } from '@/shared/types/common.types'

import peopleData from '../../data/people.json'

interface NavbarSideUserProps {
  personId?: number
  hideUsername?: boolean
  dark?: boolean
}

export function NavbarSideUser({ hideUsername, dark }: NavbarSideUserProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { enableAdvancedCredit, toggleAdvancedCredit } = useSettingsStore()

  const defaultPerson = peopleData[0]

  const person: Person = {
    id: user?.id || parseInt(String(defaultPerson.id)),
    full_name: user?.name || 'Andrew Forbist',
    job_title: 'CEO & Founder',
    email: user?.email || defaultPerson.email,
    photo: user?.avatar || defaultPerson.photo,
  }

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault()
    await logout()

    const isMobile = window.innerWidth < 768
    navigate({ to: isMobile ? '/' : '/sign-in' })
  }

  return (
    <div className="nav-item dropdown">
      <a
        href="#"
        className="nav-link d-flex lh-1 text-reset p-0"
        data-bs-toggle="dropdown"
        aria-label="Open user menu"
      >
        <Avatar person={person} size="sm" />
        {!hideUsername && (
          <div className="d-none d-xl-block ps-2">
            <div>{person.full_name}</div>
            <div className="mt-1 small text-secondary">{person.job_title}</div>
          </div>
        )}
      </a>
      <div
        className={clsx('dropdown-menu', 'dropdown-menu-end', 'dropdown-menu-arrow')}
        {...(dark ? { 'data-bs-theme': 'light' } : {})}
      >
        <Link to="/profile" className="dropdown-item">
          <Icon icon="user" className="dropdown-item-icon" /> Profile
        </Link>
        <div className="dropdown-divider" />
        
        {/* Toggle Credit Feature */}
        <div className="dropdown-item d-flex justify-content-between align-items-center pe-3" style={{ minWidth: '260px' }}>
          <div>
            <div className="fw-medium">Fitur Kredit Lanjutan</div>
            <div className="text-muted" style={{ fontSize: '11px', whiteSpace: 'normal', lineHeight: '1.2' }}>
              Aktifkan modul Kartu Kredit, KPR, KTA, dan Paylater.
            </div>
          </div>
          <label className="form-check form-switch m-0 ms-3" onClick={(e) => e.stopPropagation()}>
            <input 
              className="form-check-input" 
              type="checkbox" 
              checked={enableAdvancedCredit}
              onChange={toggleAdvancedCredit}
              style={{ cursor: 'pointer' }}
            />
          </label>
        </div>
        
        <div className="dropdown-divider" />
        <Link to="/settings" className="dropdown-item">
          Settings & Privacy
        </Link>
        <Link to="/help" className="dropdown-item">
          Help
        </Link>
        <a href="#" onClick={handleLogout} className="dropdown-item">
          Sign out
        </a>
      </div>
    </div>
  )
}
