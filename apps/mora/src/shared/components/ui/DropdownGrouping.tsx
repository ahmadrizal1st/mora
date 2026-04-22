import { useState } from 'react'
import { clsx } from 'clsx'

const OPTIONS = [
  { label: 'Harian', value: 'day' },
  { label: 'Mingguan', value: 'week' },
  { label: 'Bulanan', value: 'month' },
  { label: 'Tahunan', value: 'year' },
] as const

type GroupOption = typeof OPTIONS[number]['value']

interface DropdownGroupingProps {
  id?: string
  label?: string
  value?: GroupOption
  defaultValue?: GroupOption
  onChange?: (value: GroupOption) => void
  className?: string
}

export function DropdownGrouping({
  id,
  label = 'Pilih pengelompokan',
  value,
  defaultValue = 'day',
  onChange,
  className,
}: DropdownGroupingProps) {
  const [internalSelected, setInternalSelected] = useState<GroupOption>(defaultValue)
  const selected = value !== undefined ? value : internalSelected

  const handleSelect = (val: GroupOption) => {
    setInternalSelected(val)
    onChange?.(val)
  }

  const selectedOption = OPTIONS.find(opt => opt.value === selected)
  const selectedLabel = selectedOption?.label || OPTIONS[0].label

  return (
    <div className={clsx('dropdown', className)}>
      <a
        className="dropdown-toggle text-secondary text-decoration-none shadow-none"
        {...(id ? { id: `${id}-group-dropdown` } : {})}
        href="#"
        data-bs-toggle="dropdown"
        data-bs-boundary="viewport"
        aria-haspopup="true"
        aria-expanded="false"
        aria-label={label}
        style={{ fontSize: '14px', fontWeight: 600, outline: 'none', boxShadow: 'none' }}
      >
        Per {selectedLabel}
      </a>
      <div
        className="dropdown-menu dropdown-menu-end"
        {...(id ? { 'aria-labelledby': `${id}-group-dropdown` } : {})}
      >
        {OPTIONS.map((option) => (
          <a
            key={option.value}
            className={clsx('dropdown-item', option.value === selected && 'active')}
            href="#"
            onClick={(e) => {
              e.preventDefault()
              handleSelect(option.value)
            }}
          >
            {option.label}
          </a>
        ))}
      </div>
    </div>
  )
}
