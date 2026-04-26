import { clsx } from 'clsx'

const DEFAULT_OPTIONS = ['Last 7 days', 'Last 30 days', 'Last 3 months'] as const

interface DaysDropdownProps {
  id?: string
  label?: string
  value?: string
  options?: string[]
  className?: string
}

export function DaysDropdown({
  id,
  label = 'Select time range',
  value = 'Last 7 days',
  options = [...DEFAULT_OPTIONS],
  className,
}: DaysDropdownProps) {
  return (
    <div className={clsx('dropdown', className)}>
      <a
        className="dropdown-toggle text-secondary"
        {...(id ? { id: `${id}-dropdown` } : {})}
        href="#"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        aria-label={label}
      >
        {value}
      </a>
      <div
        className="dropdown-menu dropdown-menu-end"
        {...(id ? { 'aria-labelledby': `${id}-dropdown` } : {})}
      >
        {options.map((option) => (
          <a
            key={option}
            className={clsx('dropdown-item', option === value && 'active')}
            href="#"
            aria-current={option === value ? 'true' : undefined}
          >
            {option}
          </a>
        ))}
      </div>
    </div>
  )
}
