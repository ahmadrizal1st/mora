// src/components/ui/FormCheck.tsx

interface FormCheckProps {
  title?: string
  name?: string
  type?: 'checkbox' | 'radio' | 'switch'
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  className?: string
  id?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function FormCheck({
  title,
  name,
  type = 'checkbox',
  checked,
  defaultChecked,
  disabled,
  className,
  id,
  onChange,
}: FormCheckProps) {
  const inputType = type === 'switch' ? 'checkbox' : type

  const classes = [
    'form-check',
    type === 'switch' ? 'form-switch' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const checkId = id || (name ? `check-${name}-${title}` : undefined)

  return (
    <div className={classes}>
      <input
        className="form-check-input"
        type={inputType}
        id={checkId}
        name={name}
        checked={checked}
        defaultChecked={defaultChecked}
        disabled={disabled}
        role={type === 'switch' ? 'switch' : undefined}
        onChange={onChange}
      />
      {title && (
        <label className="form-check-label" htmlFor={checkId}>
          {title}
        </label>
      )}
    </div>
  )
}
