// src/components/ui/InputIcon.tsx
import { Icon } from './Icon'
import { Spinner } from './Spinner'

interface InputIconProps {
  icon?: string
  loader?: boolean
  prepend?: boolean
  type?: string
  value?: string
  placeholder?: string
  rounded?: boolean
  light?: boolean
  readonly?: boolean
  ariaLabel?: string
  className?: string
  inputClass?: string
  iconClass?: string
  state?: 'valid' | 'invalid'
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
}: InputIconProps) {
  const addon = (
    <span className={`input-icon-addon${iconClass ? ` ${iconClass}` : ''}`}>
      {loader
        ? <Spinner className="text-secondary" size="sm" />
        : <Icon icon={icon} />
      }
    </span>
  )

  return (
    <div className={`input-icon${className ? ` ${className}` : ''}`}>
      {prepend && addon}
      <input
        type={type}
        defaultValue={value}
        className={[
          'form-control',
          state ? `is-${state}` : '',
          light ? 'form-control-light' : '',
          rounded ? 'form-control-rounded' : '',
          inputClass,
        ].filter(Boolean).join(' ')}
        placeholder={placeholder}
        aria-label={ariaLabel}
        readOnly={readonly}
      />
      {!prepend && addon}
    </div>
  )
}