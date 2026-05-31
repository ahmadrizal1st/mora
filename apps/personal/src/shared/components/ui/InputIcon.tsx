import { Icon } from './Icon'
import { Spinner } from './Spinner'

interface InputIconProps {
  icon?: string
  loader?: boolean
  prepend?: boolean
  type?: string
  value?: string | number
  placeholder?: string
  rounded?: boolean
  light?: boolean
  readonly?: boolean
  ariaLabel?: string
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  [key: string]: unknown
}

export function InputIcon({
  icon = 'search',
  loader,
  prepend,
  type = 'text',
  value,
  placeholder = 'Search…',
  rounded,
  light,
  readonly,
  ariaLabel,
  className,
  inputClass,
  iconClass,
  state,
  onChange,
  onBlur,
  ...props
}: InputIconProps) {
  const addon = (
    <span className={`input-icon-addon${iconClass ? ` ${iconClass}` : ''}`}>
      {loader ? <Spinner className="text-secondary" size="sm" /> : <Icon icon={icon} />}
    </span>
  )

  return (
    <div className={`input-icon${className ? ` ${className}` : ''}`}>
      {prepend && addon}
      <input
        {...props}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={[
          'form-control',
          state ? `is-${state}` : '',
          light ? 'form-control-light' : '',
          rounded ? 'form-control-rounded' : '',
          inputClass,
        ]
          .filter(Boolean)
          .join(' ')}
        placeholder={placeholder}
        aria-label={ariaLabel}
        readOnly={readonly}
      />
      {!prepend && addon}
    </div>
  )
}
