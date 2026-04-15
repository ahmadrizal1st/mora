import { useState } from 'react'
import { clsx } from 'clsx'

const OPTIONS = ['Last 7 days', 'Last 30 days', 'Last 3 months'] as const
type Option = typeof OPTIONS[number]

interface DropdownDaysProps {
  id?: string
  label?: string
  defaultValue?: Option
  onChange?: (value: Option) => void
  className?: string
}

export function DropdownDays({
  id,
  label = 'Select time range',
  defaultValue = 'Last 7 days',
  onChange,
  className,
}: DropdownDaysProps) {
  const [selected, setSelected] = useState<Option>(defaultValue)

  const handleSelect = (option: Option) => {
    setSelected(option)
    onChange?.(option)
  }

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
        {selected}
      </a>
      <div
        className="dropdown-menu dropdown-menu-end"
        {...(id ? { 'aria-labelledby': `${id}-dropdown` } : {})}
      >
        {OPTIONS.map((option) => (
          <a
            key={option}
            className={clsx('dropdown-item', option === selected && 'active')}
            href="#"
            aria-current={option === selected ? 'true' : undefined}
            onClick={(e) => {
              e.preventDefault()
              handleSelect(option)
            }}
          >
            {option}
          </a>
        ))}
      </div>
    </div>
  )
}