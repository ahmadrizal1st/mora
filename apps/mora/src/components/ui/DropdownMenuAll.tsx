import { clsx } from 'clsx'
import { Icon } from './Icon'
import { Avatar } from './Avatar'

import type { Person } from '../../types'

export interface DropdownMenuAllProps {
  show?: boolean
  people: Person[]
  className?: string
}

export function DropdownMenuAll({
  show,
  people = [],
  className,
}: DropdownMenuAllProps) {
  return (
    <div className={clsx('dropdown-menu', show && 'dropdown-menu-demo', className)}>
      <h6 className="dropdown-header">Dropdown header</h6>
      <a href="#" className="dropdown-item">
        <Icon icon="activity" className="dropdown-item-icon" /> Item 1
      </a>
      <a href="#" className="dropdown-item">
        <Icon icon="edit" className="dropdown-item-icon" /> Item 2
      </a>

      <div className="dropdown-item">
        <a href="#" className="text-reset">
          My profile
        </a>
        <label className="form-check m-0 ms-auto">
          <input type="checkbox" className="form-check-input" />
          Public
        </label>
      </div>

      <label className="dropdown-item">
        <input className="form-check-input m-0 me-2" type="radio" /> Radio input
      </label>
      <label className="dropdown-item">
        <input className="form-check-input m-0 me-2" type="checkbox" /> Checkbox input
      </label>
      <label className="dropdown-item form-switch">
        <input className="form-check-input m-0 me-2" type="checkbox" /> Checkbox input
      </label>

      <div className="dropdown-divider" />

      <a href="#" className="dropdown-item">
        Dropdown item 1
      </a>
      <a href="#" className="dropdown-item">
        Dropdown item 2
      </a>
      <a href="#" className="dropdown-item disabled">
        Dropdown disabled
      </a>
      <a href="#" className="dropdown-item active">
        Dropdown active
      </a>

      <div className="dropdown-divider" />

      {people.slice(0, 3).map((person) => (
        <a key={person.id} href="#" className="dropdown-item">
          <Avatar
            size="xs"
            person={person}
            className="rounded me-2"
          />
          {person.full_name}
        </a>
      ))}

      <div className="dropdown-divider" />

      <a href="#" className="dropdown-item">
        <Icon icon="logout" className="dropdown-item-icon" /> Logout
      </a>
    </div>
  )
}
