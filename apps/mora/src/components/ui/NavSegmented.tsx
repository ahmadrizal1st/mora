import React, { useState } from 'react'
import { clsx } from 'clsx'
import { Icon } from './Icon'

export interface NavSegmentedProps {
  items?: string[]
  icons?: string[]
  disabled?: string | (number | string)[]
  vertical?: boolean
  size?: 'sm' | 'lg'
  fullWidth?: boolean
  name?: string
  defaultActive?: number
  className?: string
  onChange?: (index: number) => void
}

export function NavSegmented({
  items = [],
  icons = [],
  disabled = [],
  vertical = false,
  size,
  fullWidth = false,
  name,
  defaultActive = 1,
  className,
  onChange,
}: NavSegmentedProps) {
  const [active, setActive] = useState(defaultActive)

  const disabledArray = typeof disabled === 'string' 
    ? disabled.split(',').map(s => s.trim()) 
    : disabled.map(String)

  const totalCount = Math.max(items.length, icons.length)

  const handleItemClick = (index: number) => {
    if (disabledArray.includes(String(index))) return
    setActive(index)
    onChange?.(index)
  }

  const navClasses = clsx(
    'nav',
    'nav-segmented',
    vertical && 'nav-segmented-vertical',
    size && `nav-${size}`,
    fullWidth && 'w-100',
    className
  )

  const indices = Array.from({ length: totalCount }, (_, i) => i + 1)

  return (
    <nav className={navClasses} role="tablist" aria-orientation={vertical ? 'vertical' : undefined}>
      {indices.map((index) => {
        const isSelected = active === index
        const isDisabled = disabledArray.includes(String(index))
        const iconName = icons[index - 1]
        const itemText = items[index - 1]

        const content = (
          <>
            {iconName && <Icon icon={iconName} className="nav-link-icon" />}
            {itemText}
          </>
        )

        if (name) {
          const inputId = `segmented-${name}-${index}`
          return (
            <React.Fragment key={index}>
              <input
                type="radio"
                className="nav-link-input"
                name={name}
                id={inputId}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => handleItemClick(index)}
              />
              <label
                htmlFor={inputId}
                className={clsx('nav-link', isDisabled && 'disabled')}
                role="tab"
                aria-selected={isSelected}
                aria-disabled={isDisabled}
              >
                {content}
              </label>
            </React.Fragment>
          )
        }

        return (
          <button
            key={index}
            type="button"
            className={clsx('nav-link', isDisabled && 'disabled', isSelected && 'active')}
            role="tab"
            aria-selected={isSelected}
            aria-disabled={isDisabled}
            onClick={() => handleItemClick(index)}
          >
            {content}
          </button>
        )
      })}
    </nav>
  )
}
