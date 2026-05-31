import { useEffect, useRef } from 'react'

interface InputMaskProps {
  mask?: string
  placeholder?: string
  visible?: boolean
  reverse?: boolean
  className?: string
  defaultValue?: string
}

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

    import('imask')
      .then(({ default: IMask }) => {
        const maskOptions: Record<string, unknown> = { mask }
        if (reverse) maskOptions.lazy = false

        const maskInstance = IMask(inputRef.current!, maskOptions)
        return () => maskInstance.destroy()
      })
      .catch(() => {})
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
