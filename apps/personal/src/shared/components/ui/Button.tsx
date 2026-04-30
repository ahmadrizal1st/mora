import { clsx } from 'clsx'
import { useLinkProps } from '@tanstack/react-router'
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
  to?: string
  params?: Record<string, unknown>
  search?: Record<string, unknown>
  hash?: string
  external?: boolean
  element?: 'a' | 'button' | 'div'
  type?: 'button' | 'submit' | 'reset'
  id?: string
  modalId?: string
  toastId?: string
  dismiss?: boolean
  className?: string
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  roundedCircle?: boolean
  white?: boolean
  [key: string]: unknown
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
  to,
  params,
  search,
  hash,
  external,
  element,
  type,
  id,
  modalId,
  toastId,
  dismiss,
  className,
  onClick,
  roundedCircle,
  white,
  children,
  ...props
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

  const handleOnClick = (e: React.MouseEvent<HTMLElement>) => {
    if (El === 'a' && href === '#' && onClick) {
      e.preventDefault()
    }
    if (onClick) {
      onClick(e as React.MouseEvent<HTMLElement>)
    }
  }

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
    white && 'btn-white border shadow-sm',
    roundedCircle && 'rounded-circle',
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

  // Generate TanStack Router link props if 'to' is provided
  const linkProps = useLinkProps({
    to: (to || '') as string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params: params as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    search: search as any,
    hash,
    disabled,
  })

  // Only apply routing props when 'to' is explicitly passed
  const routingProps = to ? linkProps : {}

  const content = (
    <>
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
    </>
  )

  return (
    <El
      href={El === 'a' && !to ? href : undefined}
      {...(El === 'button' ? { type: type || 'button' } : {})}
      id={id}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClick={handleOnClick as any}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...(routingProps as any)}
      {...extraProps}
      {...props}
      className={classes}
    >
      {content}
    </El>
  )
}