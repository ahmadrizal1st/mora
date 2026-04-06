import { useEffect, useRef } from 'react'
import { clsx } from 'clsx'
import 'nouislider/dist/nouislider.css'

export interface RangeProps {
  id?: string
  min?: number
  max?: number
  step?: number
  value?: string | number
  connect?: boolean
  className?: string
  color?: string
}

export function Range({
  id,
  min = 0,
  max = 100,
  step = 10,
  value = '50',
  connect,
  className,
  color,
}: RangeProps) {
  const elementId = useRef(id || `range-${Math.random().toString(36).substring(2, 9)}`)
  const containerRef = useRef<HTMLDivElement>(null)
  const isMulti = value.toString().includes(',')
  const parsedValues = value.toString().split(',').map((v) => parseFloat(v.trim()))

  useEffect(() => {
    if (!containerRef.current) return

    const el = containerRef.current
    let active = true
    let picker: any = null

    import('nouislider').then(({ default: noUiSlider }) => {
      if (!active || !el) return

      if ((el as any).noUiSlider) {
        (el as any).noUiSlider.destroy()
      }

      let connectOption: any = connect
      if (isMulti) {
        connectOption = []
        for (let i = 2; i <= parsedValues.length; i++) {
          connectOption.push((i - 2) % 2 === 1)
        }
        connectOption.push(true)
        connectOption.push(false)
      } else if (connect === true) {
        connectOption = 'lower'
      }

      picker = noUiSlider.create(el, {
        start: isMulti ? parsedValues : parsedValues[0],
        connect: connectOption,
        step,
        range: { min, max },
      })

      const isGreen = color === 'green' || className?.includes('text-green')
      const themeColor = isGreen ? '#2fb344' : '#206bc4'

      const styleTag = document.createElement('style')
      styleTag.innerHTML = `
        #${elementId.current}.form-range { 
          height: 4px !important; 
          border: 1px solid transparent !important; 
          box-shadow: none !important; 
          background: rgba(151, 163, 184, 0.2) !important; 
          margin: 1rem 0 !important;
          padding: 0 !important;
        }
        #${elementId.current} .noUi-connect { 
          background: ${themeColor} !important; 
          height: 4px !important;
        }
        #${elementId.current} .noUi-handle { 
          width: 14px !important; 
          height: 14px !important; 
          right: -7px !important; 
          top: -6px !important; 
          background: ${themeColor} !important; 
          box-shadow: 0 0 0 2px #fff, 0 0 0 3px rgba(0, 0, 0, 0.05) !important; 
          border: 0 !important; 
          border-radius: 4px !important; 
          cursor: pointer !important;
        }
        #${elementId.current} .noUi-handle:before, #${elementId.current} .noUi-handle:after { 
          display: none !important; 
        }
        #${elementId.current} .noUi-base {
          height: 4px !important;
        }
      `
      el.appendChild(styleTag)
    })

    return () => {
      active = false
      if (picker) {
        picker.destroy()
      } else if ((el as any).noUiSlider) {
        (el as any).noUiSlider.destroy()
      }
    }
  }, [min, max, step, value, connect, isMulti, color, className])

  return (
    <div
      ref={containerRef}
      id={elementId.current}
      className={clsx('form-range', 'mb-4', 'position-relative', className)}
      style={{ border: '0', background: 'transparent' }}
    />
  )
}
