import { clsx } from 'clsx'

interface StatusProps {
  text?: string
  color?: string
  lite?: boolean
  dot?: boolean
  animated?: boolean
}

export function Status({ text = 'Status', color, lite, dot, animated }: StatusProps) {
  return (
    <span className={clsx('status', color && `status-${color}`, lite && 'status-lite')}>
      {dot && (
        <span className={clsx('status-dot', animated && 'status-dot-animated')} />
      )}
      {text}
    </span>
  )
}