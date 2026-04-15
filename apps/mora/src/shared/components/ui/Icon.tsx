import { clsx } from 'clsx'
import * as TablerIcons from '@tabler/icons-react'

interface IconProps {
  icon: string
  className?: string
  color?: string
  size?: string | number
  inline?: boolean
  filled?: boolean
  stroke?: string | number
  style?: React.CSSProperties
}

function toPascalCase(name: string): string {
  return 'Icon' + name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

export function Icon({ icon, className, color, size, inline, filled, stroke, style }: IconProps) {
  const componentName = toPascalCase(filled ? `${icon}-filled` : icon)
  const fallbackName = toPascalCase(icon)

  let IconComponent =
    (TablerIcons as any)[componentName] ||
    (TablerIcons as any)[fallbackName] ||
    (TablerIcons as any)[icon]

  if (!IconComponent) {
    const alternateName = 'Icon' + icon.split('-').map(p => p.toLowerCase() === 'x' ? 'X' : p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join('')
    IconComponent = (TablerIcons as any)[alternateName]
  }

  if (!IconComponent) {
    return (
      <span
        style={{
          width: '1em',
          height: '1em',
          display: 'inline-block',
          border: '1px dashed currentColor',
          borderRadius: '2px',
          fontSize: '0.8em',
          textAlign: 'center',
          lineHeight: '1',
          opacity: 0.5
        }}
        title={`Missing icon: ${icon}`}
      >?</span>
    )
  }

  const isBuiltInSize = typeof size === 'string' && ['xxs', 'xs', 'sm', 'md', 'lg', 'xl'].includes(size)

  const classes = clsx(
    'icon',
    className,
    color && `text-${color}`,
    inline && 'icon-inline',
    size && typeof size === 'string' && !isBuiltInSize && `icon-${size}`
  )

  const sizeMap: Record<string, number> = {
    xxs: 12,
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  }

  const normalizedSize = typeof size === 'string' ? sizeMap[size] || size : size

  return (
    <IconComponent
      className={classes}
      size={normalizedSize}
      stroke={stroke}
      strokeWidth={stroke}
      style={{ 
        strokeWidth: stroke,
        width: typeof normalizedSize === 'number' ? `${normalizedSize}px` : undefined,
        height: typeof normalizedSize === 'number' ? `${normalizedSize}px` : undefined,
        ...style 
      }}
      aria-hidden="true"
      focusable={false}
    />
  )
}