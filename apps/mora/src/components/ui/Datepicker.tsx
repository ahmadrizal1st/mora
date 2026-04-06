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
}

export function Datepicker({
  id,
  layout = 'default',
  inline = false,
  placeholder = 'Select date',
  value,
  className,
}: DatepickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!inputRef.current) return

    let picker: any = null
    let active = true

    import('litepicker').then(({ default: Litepicker }) => {
      if (!active) return

      picker = new Litepicker({
        element: inputRef.current!,
        inlineMode: inline,
        parentEl: inline ? containerRef.current || undefined : undefined,
        format: 'YYYY-MM-DD',
        setup: (picker) => {
          picker.on('selected', (date: any) => {
            if (inputRef.current) {
              inputRef.current.value = date.format('YYYY-MM-DD')
            }
          })
        },
      })
    }).catch(() => {
    })

    return () => {
      active = false
      if (picker) {
        picker.destroy()
      }
    }
  }, [inline])

  const commonProps = {
    ref: inputRef,
    id,
    type: inline ? 'hidden' as const : 'text' as const,
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
