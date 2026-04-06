import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import { Icon } from './Icon'
import { Flag } from './Flag'
import { Avatar } from './Avatar'
import { Badge } from './Badge'
import { Payment } from './Payment'

export interface TagProps {
  text?: ReactNode
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
  onClose?: () => void
  className?: string
  href?: string
}

export function Tag({
  text,
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
  closable = true,
  onClose,
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
      {text}
      {badge !== undefined && (
        <Badge color={badgeColor} className="tag-badge" text={badge.toString()} scale="sm" />
      )}
      {closable && (
        <a
          href="#"
          className="btn-close"
          onClick={(e) => {
            e.preventDefault()
            onClose?.()
          }}
          aria-label="Remove tag"
        />
      )}
    </>
  )

  const classes = clsx('tag', className)

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    )
  }

  return <span className={classes}>{content}</span>
}
