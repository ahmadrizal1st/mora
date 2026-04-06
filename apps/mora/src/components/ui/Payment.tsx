import { clsx } from 'clsx'

interface PaymentProps {
  payment?: string
  size?: string
  dark?: boolean
  className?: string
}

export function Payment({ payment = 'visa', size, dark, className }: PaymentProps) {
  const classes = clsx(
    'payment',
    size && `payment-${size}`,
    `payment-provider-${payment}${dark ? '-dark' : ''}`,
    className
  )

  return <span className={classes} />
}