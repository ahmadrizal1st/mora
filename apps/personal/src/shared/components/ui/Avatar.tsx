import { clsx } from 'clsx'
import { Icon } from './Icon'

import { type Person } from '@/shared/types/common.types'

interface AvatarPerson {
  full_name?: string
  photo?: string
  avatar?: string
}

interface AvatarProps {
  src?: string
  placeholder?: string
  person?: AvatarPerson
  personId?: number
  people?: Person[]
  size?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shape?: string
  color?: string
  square?: boolean
  thumb?: boolean
  status?: string
  statusText?: string
  statusIcon?: string
  brand?: string
  icon?: string
  link?: boolean
  dropdown?: boolean
  className?: string
  style?: React.CSSProperties
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

function resolveAvatarUrl(url?: string): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http') || url.startsWith('data:')) {
    return url
  }

  let path = url
  if (path.startsWith('/')) {
    path = path.slice(1)
  }

  if (path.startsWith('tabler/')) {
    path = path.slice(7)
  }

  if (/^0\d{2}[mf]\.jpg$/i.test(path)) {
    return `/static/avatars/${path}`
  }

  if (path.startsWith('static/')) {
    return `/${path}`
  }

  if (path.startsWith('avatars/')) {
    return `/static/${path}`
  }

  return `/${path}`
}

export function Avatar({
  src,
  placeholder,
  person,
  personId,
  people = [],
  size,
  shape,
  color,
  square,
  thumb,
  status,
  statusText,
  statusIcon,
  brand,
  icon,
  link,
  dropdown,
  className,
}: AvatarProps) {
  let resolvedSrc = resolveAvatarUrl(src)
  let resolvedPlaceholder = placeholder

  if (personId !== undefined && people.length > 0) {
    const p = people[personId - 1]
    if (p) {
      const pSrc = resolveAvatarUrl(p.photo)
      if (pSrc) resolvedSrc = pSrc
      if (!resolvedSrc) resolvedPlaceholder = getInitials(p.full_name || '')
    }
  } else if (person) {
    const pSrc = resolveAvatarUrl(person.photo || person.avatar)
    if (pSrc) resolvedSrc = pSrc
    if (!resolvedSrc && !placeholder) {
      resolvedPlaceholder = getInitials(person.full_name || '')
    }
  }

  const El = link || dropdown ? 'a' : 'span'

  const classes = clsx(
    'avatar',
    size && `avatar-${size}`,
    thumb && 'avatar-thumb',
    shape && (shape.startsWith('rounded') ? shape : `avatar-${shape}`),
    color && `bg-${color}-lt text-${color}`,
    square && 'avatar-square',
    className
  )

  const style = resolvedSrc ? { backgroundImage: `url(${resolvedSrc})` } : undefined

  return (
    <El
      className={classes}
      style={style}
      {...(link ? { href: '#' } : {})}
      {...(dropdown ? { 'data-bs-toggle': 'dropdown' } : {})}
    >
      {status && (
        <span className={clsx('badge', `bg-${status}`)}>
          {statusText}
          {statusIcon && <Icon icon={statusIcon} className="avatar-status-icon" />}
        </span>
      )}
      {brand && (
        <span
          className="avatar-brand"
          style={{ backgroundImage: `url(/static/brands/${brand}.svg)` }}
        />
      )}
      {!resolvedSrc && resolvedPlaceholder && resolvedPlaceholder}
      {!resolvedSrc && !resolvedPlaceholder && (
        <Icon icon={icon || 'user'} className="avatar-icon" />
      )}
    </El>
  )
}
