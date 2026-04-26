import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import { Avatar } from './Avatar'

interface Person {
  id?: number | string
  full_name?: string
  photo?: string
}

interface AvatarListProps {
  people?: Person[]
  limit?: number
  stacked?: boolean
  size?: string
  children?: ReactNode
  className?: string
}

export function AvatarList({
  people = [],
  limit,
  stacked,
  size,
  children,
  className,
}: AvatarListProps) {
  const items = limit ? people.slice(0, limit) : people
  const classes = clsx(
    'avatar-list',
    stacked && 'avatar-list-stacked',
    size && `avatar-list-${size}`,
    className
  )

  return (
    <div className={classes}>
      {items.map((person, i) => (
        <Avatar key={i} person={person} />
      ))}
      {children}
    </div>
  )
}
