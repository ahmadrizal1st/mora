import { clsx } from 'clsx'

export interface DropdownProps {
  mainBtn?: string
  options?: string | string[]
  className?: string
}

export function Dropdown({
  mainBtn = 'Actions',
  options = 'Action, Another action, Third action',
  className,
}: DropdownProps) {
  const optionsArray =
    typeof options === 'string'
      ? options.split(', ').map((o) => o.trim())
      : options

  return (
    <div className={clsx('dropdown', className)}>
      <a href="#" className="btn dropdown-toggle" data-bs-toggle="dropdown">
        {mainBtn}
      </a>
      <div className="dropdown-menu">
        {optionsArray.map((option, i) => (
          <a key={i} className="dropdown-item" href="#">
            {option}
          </a>
        ))}
      </div>
    </div>
  )
}
