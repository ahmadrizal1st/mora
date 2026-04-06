// src/components/cards/charts/HeatmapCard.tsx
import { ChartHeatmap } from '../../ui/ChartHeatmap'

interface HeatmapCardProps {
  title?: string
  id?: string
  colors?: string
  scale?: boolean
  labels?: boolean
  noShades?: boolean
  count?: number
  color?: string
}

export function HeatmapCard({ title, id = 'heatmap', color, scale, labels, noShades }: HeatmapCardProps) {
  return (
    <div className="card">
      <div className="card-body">
        {title && <h4 className="card-title">{title}</h4>}
        <ChartHeatmap
          id={id}
          color={color}
          scale={scale}
          labels={labels}
          noShades={noShades}
          height={15}
        />
      </div>
    </div>
  )
}