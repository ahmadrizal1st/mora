import { clsx } from 'clsx'
import type { ReactNode, CSSProperties } from 'react'

export interface ModalHeaderProps {
  title?: string
  children?: ReactNode
  onClose?: () => void
}

export function ModalHeader({ title = 'Modal title', children, onClose }: ModalHeaderProps) {
  return (
    <div className="modal-header">
      <h5 className="modal-title">{children ?? title}</h5>
      <ModalClose onClick={onClose} />
    </div>
  )
}

export interface ModalCloseProps {
  onClick?: () => void
}

export function ModalClose({ onClick }: ModalCloseProps) {
  return (
    <button
      type="button"
      className="btn-close"
      data-bs-dismiss="modal"
      aria-label="Close"
      onClick={onClick}
    />
  )
}

export interface ModalFooterProps {
  children?: ReactNode
  closeLabel?: string
  submitLabel?: string
  onClose?: () => void
  onSubmit?: () => void
}

export function ModalFooter({
  children,
  closeLabel = 'Close',
  submitLabel = 'Save changes',
  onClose,
  onSubmit,
}: ModalFooterProps) {
  if (children) {
    return <div className="modal-footer">{children}</div>
  }

  return (
    <div className="modal-footer">
      <button
        type="button"
        className="btn me-auto"
        data-bs-dismiss="modal"
        onClick={onClose}
      >
        {closeLabel}
      </button>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-dismiss="modal"
        onClick={onSubmit}
      >
        {submitLabel}
      </button>
    </div>
  )
}

export interface ModalProps {
  id?: string
  show?: boolean
  size?: 'sm' | 'lg' | 'xl' | 'full-width' | 'fullscreen'
  top?: boolean
  scrollable?: boolean
  inline?: boolean
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function Modal({
  id,
  show,
  size,
  top,
  scrollable,
  inline,
  children,
  className,
  style,
}: ModalProps) {
  const isShown = show || inline

  const modalClasses = clsx(
    'modal',
    'modal-blur',
    'fade',
    isShown && 'show',
    className
  )

  const dialogClasses = clsx(
    'modal-dialog',
    size && size !== 'full-width' && `modal-${size}`,
    size === 'full-width' && 'modal-full-width',
    !top && 'modal-dialog-centered',
    scrollable && 'modal-dialog-scrollable'
  )

  const combinedStyle: CSSProperties = {
    ...(isShown ? { display: 'block' } : {}),
    ...style,
  }

  return (
    <div
      className={modalClasses}
      id={id}
      style={combinedStyle}
      tabIndex={-1}
      role="dialog"
      aria-hidden={!isShown}
    >
      <div className={dialogClasses} role="document">
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  )
}
