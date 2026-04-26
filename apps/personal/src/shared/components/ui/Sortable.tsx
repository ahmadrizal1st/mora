import { useEffect, useRef, type ReactNode } from 'react'
import SortableJS, { type Options } from 'sortablejs'

export interface SortableProps {
  children: ReactNode
  options?: Options
  tag?: React.ElementType
  className?: string
  id?: string
}

export function Sortable({
  children,
  options = {},
  tag: Tag = 'div',
  className,
  id,
}: SortableProps) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const sortable = SortableJS.create(containerRef.current, {
      animation: 150,
      ...options,
    })

    return () => {
      sortable.destroy()
    }
  }, [options])

  return (
    <Tag ref={containerRef} className={className} id={id}>
      {children}
    </Tag>
  )
}
