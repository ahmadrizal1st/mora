// src/components/cards/IconsCard.tsx
import { useMemo } from 'react'
import * as TablerIcons from '@tabler/icons-react'

interface IconsCardProps {
  title: string
  type?: 'outline' | 'filled'
}

function pascalToKebab(name: string): string {
  // Strip "Icon" prefix and optional "Filled" suffix
  let stripped = name.replace(/^Icon/, '')
  stripped = stripped.replace(/Filled$/, '')
  return stripped
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

export function IconsCard({ title, type = 'outline' }: IconsCardProps) {
  const iconEntries = useMemo(() => {
    const entries: { name: string; kebab: string; Component: any }[] = []
    const allKeys = Object.keys(TablerIcons)

    for (const key of allKeys) {
      if (!key.startsWith('Icon')) continue

      const isFilled = key.endsWith('Filled')

      if (type === 'filled' && !isFilled) continue
      if (type === 'outline' && isFilled) continue
      // Skip "Off" variants for a cleaner display
      if (type === 'outline' && key.endsWith('Off')) continue

      const Component = (TablerIcons as any)[key]
      if (!Component) continue

      const kebab = pascalToKebab(key)
      entries.push({ name: key, kebab, Component })
    }

    return entries
  }, [type])

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">{title}</div>
      </div>
      <div className="card-body p-0">
        <div className="demo-icons-list-wrap">
          <div className="demo-icons-list">
            {iconEntries.map(({ name, kebab, Component }) => (
              <a
                key={name}
                href={`https://tabler.io/icons/icon/${kebab}`}
                target="_blank"
                rel="noopener"
                className="demo-icons-list-item"
                title={kebab}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
              >
                <Component className="icon" size={24} strokeWidth={2} />
              </a>
            ))}
            {/* Spacer divs for flex alignment */}
            {Array.from({ length: 21 }).map((_, i) => (
              <div key={`spacer-${i}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
