import { clsx } from 'clsx'
import { Icon } from './Icon'
import { Spinner } from './Spinner'

export interface ButtonProps {
  text?: string
  color?: string
  outline?: boolean
  ghost?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  height?: string
  disabled?: boolean
  square?: boolean
  loading?: boolean
  action?: boolean
  pill?: boolean
  block?: boolean
  link?: boolean
  iconOnly?: boolean
  icon?: string
  iconEnd?: string
  iconColor?: string
  spinner?: boolean
  dots?: boolean
  href?: string
  external?: boolean
  element?: 'a' | 'button' | 'div'
  type?: 'button' | 'submit' | 'reset'
  id?: string
  modalId?: string
  toastId?: string
  dismiss?: boolean
  className?: string
  onClick?: () => void
  children?: React.ReactNode
}

export function Button({
  text = 'Button',
  color,
  outline,
  ghost,
  size,
  height,
  disabled,
  square,
  loading,
  action,
  pill,
  block,
  link,
  iconOnly,
  icon,
  iconEnd,
  iconColor,
  spinner,
  dots,
  href = '#',
  external,
  element,
  type,
  id,
  modalId,
  toastId,
  dismiss,
  className,
  onClick,
  children,
}: ButtonProps) {
  const El = element || 'a'
  const hasContent = !iconOnly && (children || text)
  const spinnerClass = hasContent ? 'me-2' : undefined

  const iconSizeMap: Record<string, number> = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  }
  const strokeWidthMap: Record<string, number> = {
    sm: 1.25,
    md: 1.5,
    lg: 1.5,
    xl: 1.5,
  }
  const iconSize = size ? iconSizeMap[size] : 20
  const strokeWidth = size ? strokeWidthMap[size] : 2

  const classes = clsx(
    'btn',
    height && `btn-${height}`,
    color && `btn-${outline ? 'outline-' : ghost ? 'ghost-' : ''}${color}`,
    disabled && 'disabled',
    square && 'btn-square',
    loading && 'btn-loading',
    action && 'btn-action',
    pill && 'btn-pill',
    size && `btn-${size}`,
    block && 'w-100',
    link && 'btn-link',
    iconOnly && 'btn-icon d-inline-flex align-items-center justify-content-center',
    className
  )

  const extraProps: Record<string, unknown> = {}
  if (external) {
    extraProps.target = '_blank'
    extraProps.rel = 'noreferrer'
  }
  if (modalId) {
    extraProps['data-bs-toggle'] = 'modal'
    extraProps['data-bs-target'] = `#modal-${modalId}`
  }
  if (toastId) {
    extraProps['data-bs-toggle'] = 'toast'
    extraProps['data-bs-target'] = `#toast-${toastId}`
  }
  if (dismiss) extraProps['data-bs-dismiss'] = 'modal'
  if (iconOnly) extraProps['aria-label'] = typeof text === 'string' ? text : 'Button'

  return (
    <El
      href={El === 'a' ? href : undefined}
      type={El === 'button' ? type : undefined}
      id={id}
      className={classes}
      onClick={onClick}
      {...extraProps}
    >
      {spinner && (
        <Spinner size="sm" className={spinnerClass} element="span" />
      )}
      {icon && (
        <Icon
          icon={icon}
          color={iconColor}
          size={iconSize}
          stroke={strokeWidth}
          className={hasContent ? 'me-2' : ''}
        />
      )}
      {hasContent && (
        <>
          {children || text}
          {dots && <span className="animated-dots" />}
        </>
      )}
      {iconEnd && hasContent && (
        <Icon
          icon={iconEnd}
          size={iconSize}
          stroke={strokeWidth}
          className="ms-2 icon-end"
        />
      )}
    </El>
  )
}