import { useState, useEffect, useRef, type ReactNode } from 'react'
import { clsx } from 'clsx'
import { Icon } from './Icon'
import { Avatar } from './Avatar'

export interface DropdownItem {
  label: string
  href?: string
  active?: boolean
  disabled?: boolean
  danger?: boolean
  divider?: boolean
  header?: boolean
  icon?: string
  badge?: string
}

export interface DropdownMenuProps {
  items?: DropdownItem[]
  menu?: string
  check?: boolean
  radio?: boolean
  people?: boolean
  peopleData?: any[]
  flag?: boolean
  flagData?: { flag: string; name: string }[]
  header?: boolean
  icons?: boolean
  badge?: boolean
  active?: boolean
  disabled?: boolean
  separated?: boolean
  right?: boolean
  show?: boolean
  arrow?: boolean
  dark?: boolean
  triggerless?: boolean
  className?: string
  children?: ReactNode
}

export function DropdownMenu({
  items,
  menu,
  check,
  radio,
  people,
  peopleData = [],
  flag,
  flagData = [],
  header,
  icons,
  badge,
  active,
  disabled,
  separated,
  right,
  show,
  arrow,
  dark,
  triggerless,
  className,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(show ?? false)
  const [selectedFlag, setSelectedFlag] = useState<string | null>(null)
  const [selectedPerson, setSelectedPerson] = useState<number | null>(null)

  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen && !show) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen, show])

  const menuClasses = clsx(
    'dropdown-menu',
    show && 'dropdown-menu-demo',
    right && 'dropdown-menu-end',
    arrow && 'dropdown-menu-arrow',
    (isOpen || show) && 'show',
    className
  )

  const renderMenuItems = () => {
    if (menu) {
      return menu.split(',').map((item, i) => {
        const trimmed = item.trim()
        if (trimmed === '|') return <div key={i} className="dropdown-divider" />
        if (trimmed.startsWith('h:')) {
          return <h3 key={i} className="dropdown-header">{trimmed.replace('h:', '')}</h3>
        }
        if (trimmed.startsWith('a:')) {
          return (
            <a key={i} href="#" className="dropdown-item active" onClick={() => setIsOpen(false)}>
              {trimmed.replace('a:', '')}
            </a>
          )
        }
        if (trimmed.startsWith('d:')) {
          return (
            <a key={i} href="#" className="dropdown-item text-danger" onClick={() => setIsOpen(false)}>
              {trimmed.replace('d:', '')}
            </a>
          )
        }
        return (
          <a key={i} href="#" className="dropdown-item" onClick={() => setIsOpen(false)}>
            {trimmed}
          </a>
        )
      })
    }

    if (check || radio) {
      return [1, 2, 3].map((i) => (
        <label key={i} className="dropdown-item">
          <input
            className="form-check-input m-0 me-2"
            type={radio ? 'radio' : 'checkbox'}
          />{' '}
          Option {i}
        </label>
      ))
    }

    if (people) {
      return peopleData.map((person) => (
        <a
          key={person.id}
          href="#"
          className={clsx('dropdown-item', selectedPerson === person.id && 'active')}
          onClick={(e) => {
            e.preventDefault()
            setSelectedPerson(person.id)
            setIsOpen(false)
          }}
        >
          <Avatar person={person} size="xs" className="me-2" shape="rounded" /> {person.full_name}
        </a>
      ))
    }

    if (flag) {
      return flagData.map((country) => (
        <a
          key={`flag-${country.flag}`}
          href="#"
          className={clsx('dropdown-item', selectedFlag === country.flag && 'active')}
          onClick={(e) => {
            e.preventDefault()
            setSelectedFlag(country.flag)
            setIsOpen(false)
          }}
        >
          <span className={clsx('flag flag-xs me-2', `flag-country-${country.flag}`)} />
          {country.name}
        </a>
      ))
    }

    if (items) {
      return items.map((item, i) => {
        if (item.divider) return <div key={i} className="dropdown-divider" />
        if (item.header) return <h3 key={i} className="dropdown-header">{item.label}</h3>
        return (
          <a
            key={i}
            href={item.href || '#'}
            className={clsx(
              'dropdown-item',
              item.active && 'active',
              item.disabled && 'disabled',
              item.danger && 'text-danger'
            )}
            onClick={(e) => {
              if (!item.disabled) {
                e.preventDefault()
                setIsOpen(false)
              }
            }}
          >
            {item.icon && <Icon icon={item.icon} className="dropdown-item-icon" />}
            {item.label}
            {item.badge && (
              <span className="badge bg-primary text-primary-fg ms-auto">{item.badge}</span>
            )}
          </a>
        )
      })
    }

    return (
      <>
        {header && <span className="dropdown-header">Dropdown header</span>}
        <a className="dropdown-item" href="#" onClick={() => setIsOpen(false)}>
          {icons && <Icon icon="settings" className="dropdown-item-icon" />}
          Action
          {badge && <span className="badge bg-primary text-primary-fg ms-auto">12</span>}
        </a>
        <a className="dropdown-item" href="#" onClick={() => setIsOpen(false)}>
          {icons && <Icon icon="edit" className="dropdown-item-icon" />}
          Another action
          {badge && <span className="badge bg-green ms-auto"></span>}
        </a>
        {active && (
          <a className="dropdown-item active" href="#" onClick={() => setIsOpen(false)}>
            {icons && <Icon icon="activity" className="dropdown-item-icon" />}
            Active action
          </a>
        )}
        {disabled && (
          <a className="dropdown-item disabled" href="#">
            {icons && <Icon icon="user-x" className="dropdown-item-icon" />}
            Disabled action
          </a>
        )}
        {separated && (
          <>
            <div className="dropdown-divider" />
            <a className="dropdown-item" href="#" onClick={() => setIsOpen(false)}>
              {icons && <Icon icon="plus" className="dropdown-item-icon" />}
              Separated link
            </a>
          </>
        )}
      </>
    )
  }

  if (show || triggerless) {
    return (
      <div
        className={menuClasses}
        style={show ? { position: 'relative', display: 'block', visibility: 'visible', opacity: 1, zIndex: 1, marginBottom: '1rem' } : {}}
        {...(dark ? { 'data-bs-theme': 'dark' } : {})}
      >
        {renderMenuItems()}
      </div>
    )
  }

  return (
    <div ref={ref} className="dropdown" style={{ display: 'inline-block' }}>
      <button
        type="button"
        className="btn dropdown-toggle align-text-top"
        data-bs-toggle="dropdown"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
      >
        Actions
      </button>
      <div
        className={menuClasses}
        {...(dark ? { 'data-bs-theme': 'dark' } : {})}
      >
        {renderMenuItems()}
      </div>
    </div>
  )
}