import { useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import { Icon } from './Icon'

export interface DatepickerProps {
  id?: string
  layout?: 'default' | 'icon' | 'none'
  inline?: boolean
  placeholder?: string
  value?: string
  className?: string
  onChange?: (value: string) => void
}

export function Datepicker({
  id,
  layout = 'default',
  inline = false,
  placeholder = 'Select date',
  value,
  className,
  onChange,
}: DatepickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!inputRef.current) return

    let picker: { destroy: () => void } | null = null
    let active = true

    import('litepicker')
      .then(({ default: Litepicker }) => {
        if (!active) return

        const lp = new Litepicker({
          element: inputRef.current!,
          inlineMode: inline,
          parentEl: inline ? containerRef.current || undefined : undefined,
          format: 'YYYY-MM-DD',
          buttonText: {
            previousMonth: `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 6l-6 6l6 6" /></svg>`,
            nextMonth: `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l6 6l-6 6" /></svg>`,
          },
          setup: (picker: {
            on: (event: string, cb: (date: { format: (f: string) => string }) => void) => void
          }) => {
            picker.on('selected', (date) => {
              const formatted = date.format('YYYY-MM-DD')
              if (inputRef.current) {
                inputRef.current.value = formatted
              }
              if (onChange) {
                onChange(formatted)
              }
            })
          },
        })
        picker = lp
      })
      .catch(() => {})

    return () => {
      active = false
      if (picker) {
        picker.destroy()
      }
    }
  }, [inline, onChange])

  const commonProps = {
    ref: inputRef,
    id,
    type: inline ? ('hidden' as const) : ('text' as const),
    className: 'form-control',
    placeholder,
    defaultValue: value,
  }

  if (inline) {
    return (
      <div ref={containerRef} className={className}>
        <input {...commonProps} />
      </div>
    )
  }

  if (layout === 'none') {
    return <input {...commonProps} className={clsx(commonProps.className, className)} />
  }

  const wrapperClass = clsx('input-icon', className)

  return (
    <div className={wrapperClass}>
      {layout === 'icon' && (
        <span className="input-icon-addon">
          <Icon icon="calendar" />
        </span>
      )}
      <input {...commonProps} />
      {layout === 'default' && (
        <span className="input-icon-addon">
          <Icon icon="calendar" />
        </span>
      )}
    </div>
  )
}
