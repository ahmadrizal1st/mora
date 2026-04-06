import { useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import colorsData from '../../data/colors.json'
import '@melloware/coloris/dist/coloris.css'

export interface ColorPickerProps {
  id?: string
  value?: string
  format?: 'hex' | 'rgb' | 'hsl' | 'mixed'
  alpha?: boolean
  swatchesOnly?: boolean
  className?: string
  onChange?: (color: string) => void
}

export function ColorPicker({
  id,
  value: initialValue = '#000000',
  format = 'hex',
  alpha = false,
  swatchesOnly = false,
  className,
  onChange,
}: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [currentValue, setCurrentValue] = useState(initialValue)

  useEffect(() => {
    if (!inputRef.current) return

    let active = true

    const swatches = [
      ...colorsData.base.map(c => c.value),
      ...colorsData.light.map(c => c.value),
      ...colorsData.social.map(c => c.value)
    ]

    import('@melloware/coloris').then(({ default: Coloris }) => {
      if (!active) return

      Coloris.init()
      Coloris({
        el: inputRef.current!,
        wrap: false,
        selectInput: false,
        alpha: alpha,
        format: format,
        swatchesOnly: swatchesOnly,
        swatches: swatches,
      })
    })

    const handleInput = (e: Event) => {
      const val = (e.target as HTMLInputElement).value
      setCurrentValue(val)
      if (onChange) {
        onChange(val)
      }
    }

    const element = inputRef.current
    element.addEventListener('input', handleInput)

    return () => {
      active = false
      element.removeEventListener('input', handleInput)
    }
  }, [alpha, format, swatchesOnly, onChange])

  return (
    <div 
      className={clsx('clr-field', className)} 
      style={{ color: currentValue, position: 'relative', display: 'block' }}
    >
      <button 
        type="button" 
        aria-labelledby="clr-open-label"
        style={{
          width: '1.25rem',
          height: '1.25rem',
          left: '0.625rem',
          top: '50%',
          transform: 'translateY(-50%)',
          borderRadius: '4px',
          border: 'none',
          position: 'absolute',
          padding: 0,
          margin: 0,
          backgroundColor: 'currentColor'
        }}
      />
      <input
        ref={inputRef}
        id={id}
        type="text"
        className="form-control"
        style={{ paddingLeft: '2.25rem' }}
        defaultValue={initialValue}
        data-coloris
      />
    </div>
  )
}
