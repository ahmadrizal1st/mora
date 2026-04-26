import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import { Icon } from './Icon'
import { Flag } from './Flag'
import { Avatar } from './Avatar'
import { Badge } from './Badge'
import { Payment } from './Payment'

export interface TagProps {
  text?: ReactNode
  children?: ReactNode
  flag?: string
  icon?: string
  person?: {
    full_name?: string
    photo?: string
  }
  personId?: number
  payment?: string
  status?: string
  legend?: string
  checkbox?: boolean
  checked?: boolean
  badge?: string | number
  badgeColor?: string
  closable?: boolean
  active?: boolean
  color?: string
  rounded?: boolean
  style?: React.CSSProperties
  onClose?: () => void
  onClick?: () => void
  className?: string
  href?: string
}

export function Tag({
  text,
  children,
  flag,
  icon,
  person,
  personId,
  payment,
  status,
  legend,
  checkbox,
  checked,
  badge,
  badgeColor,
  closable,
  active,
  color,
  rounded,
  style,
  onClose,
  onClick,
  className,
  href,
}: TagProps) {
  const content = (
    <>
      {flag && <Flag flag={flag} size="xxs" className="tag-flag" />}
      {icon && <Icon icon={icon} size="xxs" className="tag-icon" />}
      {(person || personId !== undefined) && (
        <Avatar person={person} personId={personId} size="xxs" className="tag-avatar" />
      )}
      {payment && <Payment payment={payment} size="xxs" className="tag-payment" />}
      {status && <Badge color={status} className="tag-status badge-dot" text="" />}
      {legend && <span className={clsx('legend', `bg-${legend}`)} />}
      {checkbox && (
        <input
          type="checkbox"
          className="form-check-input tag-check"
          defaultChecked={checked}
        />
      )}
      {text || children}
      {badge !== undefined && (
        <Badge color={badgeColor} className="tag-badge" text={badge.toString()} scale="sm" />
      )}
      {(closable || onClose) && (
        <a
          href="#"
          className="btn-close"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onClose?.()
          }}
          aria-label="Remove tag"
        />
      )}
    </>
  )

  const classes = clsx(
    'tag', 
    active && 'tag-active',
    rounded && 'tag-rounded',
    color && !color.startsWith('#') && `bg-${color}-lt`,
    className
  )

  const customStyle: React.CSSProperties = {
    ...style,
    backgroundColor: color && color.startsWith('#') ? (active ? color : `${color}22`) : undefined,
    color: color && color.startsWith('#') ? (active ? '#fff' : color) : undefined,
    borderColor: color && color.startsWith('#') ? color : undefined,
    cursor: onClick ? 'pointer' : undefined
  }
  if (href) {
    return (
      <a href={href} className={classes} style={customStyle} onClick={onClick}>
        {content}
      </a>
    )
  }

  return (
    <span className={classes} style={customStyle} onClick={onClick}>
      {content}
    </span>
  )
}
