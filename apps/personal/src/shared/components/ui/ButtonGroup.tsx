// src/components/ui/ButtonGroup.tsx
import React from 'react'
import { Icon } from './Icon'

export interface ButtonGroupProps {
  /** Text labels for buttons */
  items?: string[]
  /** Icon names for icon-only buttons */
  icons?: string[]
  id?: string
  /** Use radio inputs */
  radio?: boolean
  vertical?: boolean
  fluid?: boolean
  /** Show a dropdown at the end */
  dropdown?: boolean
  className?: string
  /** Index of the button to be selected by default */
  selectedIndex?: number
}

export function ButtonGroup({
  items = [],
  icons = [],
  id = 'group',
  radio,
  vertical,
  fluid,
  dropdown,
  className,
  selectedIndex,
}: ButtonGroupProps) {
  const groupClass = [
    vertical ? 'btn-group-vertical' : 'btn-group',
    fluid ? 'w-100' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={groupClass} role="group">
      {items.map((item, i) => {
        const isFirst = i === 0
        const idSuffix = `${id}-${i + 1}`
        const btnClass = `btn${!radio && isFirst ? ' active' : ''}`

        if (radio) {
          return (
            <React.Fragment key={i}>
              <input
                type="radio"
                className="btn-check"
                name={`btn-radio-${id}`}
                id={`btn-radio-${idSuffix}`}
                autoComplete="off"
                defaultChecked={selectedIndex !== undefined ? selectedIndex === i : isFirst}
              />
              <label htmlFor={`btn-radio-${idSuffix}`} className={btnClass}>
                {item}
              </label>
            </React.Fragment>
          )
        }

        return (
          <button key={i} type="button" className={btnClass}>
            {item}
          </button>
        )
      })}

      {icons.map((icon, i) => {
        const isFirst = i === 0 && items.length === 0
        const idSuffix = `${id}-icon-${i + 1}`
        const btnClass = `btn btn-icon${!radio && isFirst ? ' active' : ''}`

        if (radio) {
          return (
            <React.Fragment key={i}>
              <input
                type="radio"
                className="btn-check"
                name={`btn-radio-${id}`}
                id={`btn-radio-${idSuffix}`}
                autoComplete="off"
                defaultChecked={selectedIndex !== undefined ? selectedIndex === i : isFirst}
              />
              <label htmlFor={`btn-radio-${idSuffix}`} className={btnClass}>
                <Icon icon={icon} />
              </label>
            </React.Fragment>
          )
        }

        return (
          <button key={i} type="button" className={btnClass}>
            <Icon icon={icon} />
          </button>
        )
      })}

      {dropdown && (
        <div className="btn-group" role="group">
          <button
            className="btn dropdown-toggle"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Other
          </button>
          <div className="dropdown-menu dropdown-menu-end">
            {['Option 4', 'Option 5', 'Option 6'].map((opt) => (
              <a key={opt} className="dropdown-item" href="#">{opt}</a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
