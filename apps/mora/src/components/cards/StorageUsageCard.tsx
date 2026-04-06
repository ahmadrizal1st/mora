// src/components/cards/StorageUsageCard.tsx

interface StorageItem {
  label: string
  color: string
  width: number
  size?: string
}

interface StorageUsageCardProps {
  used?: string
  total?: string
  items?: StorageItem[]
}

const defaultItems: StorageItem[] = [
  { label: 'Regular', color: 'primary', width: 44, size: '915MB' },
  { label: 'System', color: 'info', width: 19, size: '415MB' },
  { label: 'Shared', color: 'success', width: 9, size: '201MB' },
  { label: 'Free', color: 'secondary-lt', width: 28, size: '612MB' },
]

export function StorageUsageCard({
  used = '6854.45 MB',
  total = '8 GB',
  items = defaultItems,
}: StorageUsageCardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <p className="mb-3">
          Using Storage <strong>{used} </strong>of {total}
        </p>
        <div className="progress progress-separated mb-3">
          {items.filter(item => item.width > 0).map((item, i) => (
            <div
              key={i}
              className={`progress-bar bg-${item.color}`}
              role="progressbar"
              style={{ width: `${item.width}%` }}
              aria-label={item.label}
            />
          ))}
        </div>
        <div className="row">
          {items.map((item, i) => (
            <div key={i} className={`col-auto d-flex align-items-center ${i === 0 ? 'pe-2' : i === items.length - 1 ? 'ps-2' : 'px-2'}`}>
              <span className={`legend me-2${item.color ? ` bg-${item.color}` : ''}`} />
              <span>{item.label}</span>
              {item.size && (
                <span className="d-none d-md-inline d-lg-none d-xxl-inline ms-2 text-secondary">
                  {item.size}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
