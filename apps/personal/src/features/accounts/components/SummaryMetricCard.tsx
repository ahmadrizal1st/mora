import { clsx } from 'clsx'
import { Icon } from '@/shared/components/ui/Icon'

interface SummaryMetricCardProps {
  title: string
  value: string
  subtext: string
  icon: string
  valueColor?: 'success' | 'danger' | 'primary' | 'warning'
}

export function SummaryMetricCard({
  title,
  value,
  subtext,
  icon,
  valueColor,
}: SummaryMetricCardProps) {
  const color = valueColor || 'primary'
  const colorMap = {
    primary: '#066fd1',
    danger: '#d63939',
    success: '#2fb344',
    warning: '#f76707',
  }
  const activeColor = colorMap[color] || colorMap.primary

  const textClass =
    clsx({
      'text-body': color === 'primary',
      'text-danger': color === 'danger',
      'text-success': color === 'success',
      'text-warning': color === 'warning',
    }) || 'text-body'

  return (
    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
      <div className="card-body p-3 p-lg-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <div
            className="d-flex align-items-center justify-content-center text-white"
            style={{
              borderRadius: '10px',
              width: '32px',
              height: '32px',
              backgroundColor: activeColor,
            }}
          >
            <Icon icon={icon} size="sm" className="text-white" />
          </div>
          <div
            className="subheader text-muted m-0 fw-bold"
            style={{ letterSpacing: '0.05em', fontSize: '10px' }}
          >
            {title.toUpperCase()}
          </div>
        </div>
        <div
          className={clsx('h1 mb-1 fw-bold lh-1 text-nowrap', textClass)}
          style={{ letterSpacing: '-0.5px' }}
        >
          {value}
        </div>
        <div className="text-muted small" style={{ fontSize: '11px' }}>
          {subtext}
        </div>
      </div>
    </div>
  )
}
