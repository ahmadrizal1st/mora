import type { CSSProperties } from 'react'

export interface SvgProps {
  width?: number
  height?: number

  size?: number

  border?: boolean

  ratio?: boolean

  fullWidth?: boolean
  className?: string
}

export function Svg({
  width: widthProp,
  height: heightProp,
  size,
  border,
  ratio,
  fullWidth,
  className,
}: SvgProps) {
  const width = widthProp ?? size ?? 20
  const height = heightProp ?? size ?? 20

  const svgStyle: CSSProperties = fullWidth || border ? { width: '100%', height: 'auto' } : {}

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      preserveAspectRatio={ratio ? 'xMidYMid meet' : 'none'}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="transparent"
      stroke="var(--tblr-border-color, #b8cef1)"
      style={svgStyle}
    >
      {border && <rect x="0.5" y="0.5" width={width - 1} height={height - 1} rx="2" />}
      <line x1="0" y1="0" x2={width} y2={height} />
      <line x1="0" y1={height} x2={width} y2="0" />
    </svg>
  )
}
