import { clsx } from 'clsx'

export type TrackingBlockStatus = 'success' | 'danger' | 'warning' | 'empty'

export interface TrackingBlock {
  status: TrackingBlockStatus
  tooltip?: string
}

export interface TrackingProps {
  blocks?: number
  items?: TrackingBlock[]
  squares?: boolean
  className?: string
}

function defaultBlocks(count: number): TrackingBlock[] {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1
    if (n === 5 || n === 18) return { status: 'danger', tooltip: 'Downtime' }
    if (n === 22 || n === 23) return { status: 'empty', tooltip: 'No data' }
    if (n === 14) return { status: 'warning', tooltip: 'Big load' }
    return { status: 'success', tooltip: 'Operational' }
  })
}

const statusClass: Record<TrackingBlockStatus, string> = {
  success: 'bg-success',
  danger: 'bg-danger',
  warning: 'bg-warning',
  empty: '',
}

export function Tracking({ blocks = 30, items, squares, className }: TrackingProps) {
  const displayItems = items ?? defaultBlocks(blocks)

  const trackingClass = clsx(
    'tracking',
    squares && 'tracking-squares',
    className
  )

  return (
    <div className={trackingClass}>
      {displayItems.map((block, i) => (
        <div
          key={i}
          className={clsx('tracking-block', block.status !== 'empty' && statusClass[block.status])}
          data-bs-toggle={block.tooltip ? 'tooltip' : undefined}
          data-bs-placement={block.tooltip ? 'top' : undefined}
          title={block.tooltip}
        />
      ))}
    </div>
  )
}
