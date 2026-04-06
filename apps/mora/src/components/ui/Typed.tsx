import { useEffect, useRef } from 'react'
import { clsx } from 'clsx'

declare global {
  interface Window {
    Typed?: new (
      selector: string,
      options: {
        strings: string[]
        typeSpeed: number
        backSpeed: number
        backDelay: number
        startDelay: number
        loop: boolean
        fade: boolean
      }
    ) => {
      destroy: () => void
    }
  }
}

export interface TypedProps {
  strings?: string | string[]
  id?: string
  typeSpeed?: number
  backSpeed?: number
  backDelay?: number
  startDelay?: number
  loop?: boolean
  className?: string
}

export function Typed({
  strings = 'Hello World|Another string|And another one',
  id = 'typed',
  typeSpeed = 100,
  backSpeed = 50,
  backDelay = 1000,
  startDelay = 1000,
  loop = true,
  className,
}: TypedProps) {
  const spanRef = useRef<HTMLSpanElement>(null)

  const stringsArray =
    typeof strings === 'string'
      ? strings.split('|')
      : strings

  useEffect(() => {
    if (!spanRef.current || !window.Typed) return

    const typed = new window.Typed(`#${id}`, {
      strings: stringsArray,
      typeSpeed,
      backSpeed,
      backDelay,
      startDelay,
      loop,
      fade: true,
    })

    return () => {
      // If Typed.js has a destroy method, we use it for cleanup
      if (typed && typeof typed.destroy === 'function') {
        typed.destroy()
      }
    }
  }, [id, stringsArray, typeSpeed, backSpeed, backDelay, startDelay, loop])

  return (
    <span
      ref={spanRef}
      id={id}
      className={clsx('text-primary', className)}
    >
      {stringsArray[0]}
    </span>
  )
}
