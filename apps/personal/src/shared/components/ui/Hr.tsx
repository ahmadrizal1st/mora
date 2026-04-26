import { clsx } from 'clsx'

export interface HrProps {
  text?: string
  position?: 'left' | 'right' | 'center'
  color?: string
  className?: string
}

export function Hr({ text = 'Label', position, color, className }: HrProps) {
  const classes = clsx(
    'hr-text',
    position && `hr-text-${position.toLowerCase()}`,
    color && `text-${color}`,
    className
  )

  return <div className={classes}>{text}</div>
}