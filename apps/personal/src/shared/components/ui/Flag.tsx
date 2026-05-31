import { clsx } from 'clsx'
import flagsJson from '../../data/flags.json'

export interface FlagData {
  name: string
  flag: string
}

export const FLAGS: FlagData[] = flagsJson
export const FLAG_CODES = FLAGS.map((f) => f.flag)
export type FlagCode = string

export interface FlagProps {
  flag?: FlagCode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxs'
  className?: string
}

export function Flag({ flag = 'pl', size = 'xs', className }: FlagProps) {
  const code = flag.toLowerCase()
  const classes = clsx('flag', `flag-${size}`, `flag-country-${code}`, className)

  const style: React.CSSProperties = {
    backgroundImage: `url(/static/flags/${code}.svg)`,
    overflow: 'hidden',
    borderRadius: '4px',
  }

  return (
    <span className={classes} style={style}>
      <img
        src={`/static/flags/${code}.svg`}
        alt=""
        style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
      />
    </span>
  )
}
