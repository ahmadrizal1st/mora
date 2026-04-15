import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import { Icon } from './Icon'

export interface CardTitleProps {
  title?: string
  more?: boolean
  className?: string
  children?: ReactNode
  onMore?: () => void
}

export function CardTitle({ title = 'Card title', more, className, children, onMore }: CardTitleProps) {
  return (
    <div className="d-flex">
      <h3 className={clsx('card-title', className)}>
        {children ?? title}
      </h3>
      {more && (
        <div className="ms-auto">
          <button
            type="button"
            className="btn btn-action btn-sm"
            onClick={onMore}
            aria-label="More options"
          >
            <Icon icon="dots" />
          </button>
        </div>
      )}
    </div>
  )
}

export interface CardDropdownItem {
  label: string
  href?: string
  danger?: boolean
  onClick?: () => void
}

export interface CardDropdownProps {
  icon?: string
  items?: CardDropdownItem[]
  className?: string
}

const defaultDropdownItems: CardDropdownItem[] = [
  { label: 'Import' },
  { label: 'Export' },
  { label: 'Download' },
  { label: 'Delete', danger: true },
]

export function CardDropdown({
  icon = 'dots-vertical',
  items = defaultDropdownItems,
  className,
}: CardDropdownProps) {
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
        {items.map((item, i) => (
          <a
            key={i}
            href={item.href ?? '#'}
            className={clsx('dropdown-item', item.danger && 'text-danger')}
            onClick={item.onClick}
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  )
}
