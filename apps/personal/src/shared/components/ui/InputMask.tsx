// src/components/ui/InputMask.tsx
import { useEffect, useRef } from 'react'

interface InputMaskProps {
  mask?: string
  placeholder?: string
  visible?: boolean
  reverse?: boolean
  className?: string
  defaultValue?: string
}

/**
 * InputMask component — wraps IMask library for masked inputs.
 * Requires `imask` installed: npm install imask
 *
 * In the original Liquid template this used the `data-mask` attribute
 * processed by the `imask` page-lib. Here we integrate directly via the
 * IMask JS library using a useEffect hook.
 */
export function InputMask({
  mask,
  placeholder,
  visible,
  reverse,
  className,
  defaultValue,
}: InputMaskProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!mask || !inputRef.current) return

    // Dynamically import IMask to keep it optional
    import('imask').then(({ default: IMask }) => {
      const maskOptions: Record<string, unknown> = { mask }
      if (reverse) maskOptions.lazy = false

      const maskInstance = IMask(inputRef.current!, maskOptions)
      return () => maskInstance.destroy()
    }).catch(() => {
      // imask not installed — inputs still render without masking
    })
  }, [mask, reverse])

  return (
    <input
      ref={inputRef}
      type="text"
      className={`form-control${className ? ` ${className}` : ''}`}
      placeholder={visible ? mask?.replace(/0/g, '_') : placeholder}
      defaultValue={defaultValue}
      data-mask={mask}
    />
  )
}
