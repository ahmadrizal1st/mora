export function resolveCSSColor(colorName: string): string {
  if (typeof window === 'undefined') return '#206bc4'

  const style = getComputedStyle(document.documentElement)

  if (colorName.startsWith('#') || colorName.startsWith('rgb(') || colorName.startsWith('hsl(')) {
    return colorName
  }

  const isComplex = colorName.includes('var(') || colorName.includes('color-mix(')

  if (!isComplex) {
    const computedVar = style.getPropertyValue(`--tblr-${colorName}`).trim()
    if (computedVar) return computedVar
  }

  const el = document.createElement('div')
  el.style.color = isComplex ? colorName : `var(--tblr-${colorName})`
  el.className = 'd-none'
  document.body.appendChild(el)
  const computedColor = getComputedStyle(el).color
  document.body.removeChild(el)

  return computedColor && computedColor !== style.color ? computedColor : '#206bc4'
}

export function mapChartData(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...data }
  const mapping: Record<string, string> = {
    'stroke-width': 'strokeWidth',
    'stroke-dash': 'strokeDash',
    'stroke-curve': 'strokeCurve',
    'start-date': 'startDate',
    'hide-grid': 'hideGrid',
    'show-x': 'showX',
    'hide-tooltip': 'hideTooltip',
    'hide-points': 'hidePoints',
    'show-markers': 'showMarkers',
    'show-data-labels': 'showDataLabels',
    'y-max': 'yMax',
    'y-title': 'yTitle',
    'y-tooltip': 'yTooltip',
    'x-formatter': 'xFormatter',
  }

  Object.entries(mapping).forEach(([kebab, camel]) => {
    if (data[kebab] !== undefined) {
      result[camel] = data[kebab]
    }
  })

  return result
}
