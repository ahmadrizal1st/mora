import { Icon } from '@/shared/components/ui/Icon'
import { formatCurrency } from '@/shared/utils/currencyUtils'

const getSubCategory = (subName: string): string => {
  const name = subName.toLowerCase()
  if (
    name.includes('netflix') ||
    name.includes('spotify') ||
    name.includes('youtube') ||
    name.includes('disney') ||
    name.includes('hbo')
  )
    return 'Hiburan'
  if (
    name.includes('indihome') ||
    name.includes('internet') ||
    name.includes('zoom') ||
    name.includes('slack') ||
    name.includes('canva') ||
    name.includes('figma')
  )
    return 'Kerja'
  if (
    name.includes('udemy') ||
    name.includes('coursera') ||
    name.includes('duolingo') ||
    name.includes('skillshare') ||
    name.includes('ruangguru') ||
    name.includes('zenius')
  )
    return 'Edukasi'
  return 'Lainnya'
}

interface SubscriptionMetricStripProps {
  subscriptions?: any[]
  totalMonthly?: number
  paidThisMonth?: number
}

export function SubscriptionMetricStrip({
  subscriptions = [],
  totalMonthly = 0,
  paidThisMonth = 0,
}: SubscriptionMetricStripProps) {
  // Calculate unique categories
  const categories = new Set(subscriptions.map(s => getSubCategory(s.name)))
  
  // Find max subscription
  let maxSub = { name: '-', amount: 0 }
  subscriptions.forEach(s => {
    if (s.amount > maxSub.amount) {
      maxSub = { name: s.name, amount: s.amount }
    }
  })

  const metrics = [
    {
      label: 'Layanan Aktif',
      value: `${subscriptions.length}`,
      icon: 'apps',
      bgClass: 'bg-primary',
      textClass: 'text-dark',
      detail: `Dari ${categories.size} kategori utama`,
    },
    {
      label: 'Total Tagihan',
      value: formatCurrency(totalMonthly),
      icon: 'calendar-event',
      bgClass: 'bg-orange',
      textClass: 'text-orange',
      detail: 'Pengeluaran bulanan rutin',
    },
    {
      label: 'Sudah Dibayar',
      value: formatCurrency(paidThisMonth),
      icon: 'trending-down',
      bgClass: 'bg-success',
      textClass: 'text-success',
      detail: 'Dibayarkan bulan ini',
    },
    {
      label: 'Tagihan Terbesar',
      value: maxSub.amount > 0 ? formatCurrency(maxSub.amount) : '-',
      icon: 'hourglass',
      bgClass: 'bg-danger',
      textClass: 'text-danger',
      detail: maxSub.amount > 0 ? `Layanan: ${maxSub.name}` : 'Belum ada data',
    },
  ]

  return (
    <div className="d-flex flex-wrap gap-3">
      {metrics.map((m, i) => (
        <div key={i} style={{ flex: '1 1 200px', minWidth: '180px' }}>
          <div className="card shadow-none border h-100" style={{ borderRadius: '12px' }}>
            <div className="card-body p-3 d-flex flex-column gap-3">
              <div className="d-flex align-items-center gap-3">
                <div
                  className={`avatar rounded ${m.bgClass} text-white d-flex align-items-center justify-content-center`}
                  style={{ width: '32px', height: '32px' }}
                >
                  <Icon icon={m.icon as any} size="sm" stroke={1.5} className="text-white" />
                </div>
                <div
                  className="text-muted fw-bold text-uppercase m-0"
                  style={{ fontSize: '11px', letterSpacing: '0.04em' }}
                >
                  {m.label}
                </div>
              </div>

              <div className="d-flex flex-column gap-1">
                <div className={`h2 m-0 fw-bold ${m.textClass}`} style={{ letterSpacing: '-0.5px' }}>
                  {m.value}
                </div>
                <div className="text-muted m-0 lh-1" style={{ fontSize: '12px' }}>
                  {m.detail}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
