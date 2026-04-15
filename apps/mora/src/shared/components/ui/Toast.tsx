import type { ReactNode } from 'react'
import { clsx } from 'clsx'
import { Avatar } from './Avatar'

export interface ToastProps {
  id?: string
  show?: boolean
  hideHeader?: boolean
  person?: {
    full_name?: string
    photo?: string
  }
  personId?: number
  date?: string
  text?: string
  cookies?: boolean
  children?: ReactNode
  className?: string
  onDismiss?: () => void
}

export function Toast({
  id,
  show,
  hideHeader,
  person,
  personId,
  date = '11 mins ago',
  text = 'Hello, world! This is a toast message.',
  cookies,
  children,
  className,
  onDismiss,
}: ToastProps) {
  const classes = clsx('toast', show && 'show', className)

  return (
    <div
      className={classes}
      id={id}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      data-bs-autohide="false"
    >
      {!hideHeader && (
        <div className="toast-header">
          {(person || personId !== undefined) && (
            <Avatar person={person} personId={personId} size="xs" className="me-2" />
          )}
          <strong className="me-auto">{person?.full_name || 'Notification'}</strong>
          <small>{date}</small>
          <button
            type="button"
            className="ms-2 btn-close"
            data-bs-dismiss="toast"
            aria-label="Close"
            onClick={(e) => {
              e.preventDefault()
              onDismiss?.()
            }}
          />
        </div>
      )}

      <div className="toast-body">
        {children ??
          (cookies ? (
            <>
              🍪&nbsp;Our site uses cookies. By continuing to use our site, you agree to our Cookie Policy.
              <div className="mt-2 pt-2 border-top">
                <a
                  href="#"
                  className="btn btn-primary btn-sm"
                  onClick={(e) => {
                    e.preventDefault()
                    onDismiss?.()
                  }}
                >
                  I understand
                </a>
              </div>
            </>
          ) : (
            text
          ))}
      </div>
    </div>
  )
}
