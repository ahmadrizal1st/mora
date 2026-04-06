import { clsx } from 'clsx'

export interface PlaceholderProps {
  width?: number
  height?: number
  size?: number
  border?: boolean
  ratio?: boolean
  className?: string
}

export function Placeholder({
  width: widthProp,
  height: heightProp,
  size,
  border,
  ratio,
  className,
}: PlaceholderProps) {
  const width = widthProp ?? size ?? 400
  const height = heightProp ?? size ?? 200

  const svgClasses = clsx(
    border && 'w-100 border rounded',
    className
  )

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={svgClasses}
      preserveAspectRatio={ratio ? 'xMidYMid meet' : 'none'}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="transparent"
      stroke="var(--tblr-border-color, #b8cef1)"
    >
      <line x1="0" y1="0" x2={width} y2={height} />
      <line x1="0" y1={height} x2={width} y2="0" />
    </svg>
  )
}
