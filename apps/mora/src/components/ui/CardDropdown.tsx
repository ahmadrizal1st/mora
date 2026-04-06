import { clsx } from 'clsx'
import { Icon } from './Icon'

export interface CardDropdownProps {
  icon?: string
  className?: string
}

export function CardDropdown({ icon = 'dots-vertical', className }: CardDropdownProps) {
  return (
    <div className={clsx('dropdown', className)}>
      <a
        href="#"
        className="btn btn-action"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <Icon icon={icon} />
      </a>
      <div className="dropdown-menu dropdown-menu-end">
        <a href="#" className="dropdown-item">Import</a>
        <a href="#" className="dropdown-item">Export</a>
        <a href="#" className="dropdown-item">Download</a>
        <div className="dropdown-divider" />
        <a href="#" className="dropdown-item text-danger">Delete</a>
      </div>
    </div>
  )
}
