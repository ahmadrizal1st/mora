import { formatCurrency } from '@/shared/utils/currencyUtils'
import { Icon } from '@/shared/components/ui/Icon'
import { Link } from '@tanstack/react-router'

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

export function SubscriptionCategoryBreakdown({
  subscriptions = []
}: {
  subscriptions?: any[]
}) {
  // Define categories structure
  const categoriesList = [
    { name: 'Hiburan', amount: 0, color: 'var(--tblr-warning)', icon: 'device-tv' },
    { name: 'Kerja', amount: 0, color: 'var(--tblr-primary)', icon: 'briefcase' },
    { name: 'Edukasi', amount: 0, color: 'var(--tblr-success)', icon: 'school' },
    { name: 'Lainnya', amount: 0, color: 'var(--tblr-secondary)', icon: 'dots' },
  ]

  let total = 0
  subscriptions.forEach(sub => {
    const catName = getSubCategory(sub.name)
    const price = Number(sub.amount || 0)
    total += price
    const matched = categoriesList.find(c => c.name === catName)
    if (matched) {
      matched.amount += price
    } else {
      categoriesList.find(c => c.name === 'Lainnya')!.amount += price
    }
  })

  const hasData = total > 0

  // Calculate percentage and find top category
  let topCategory = categoriesList[0]
  const processedCategories = categoriesList.map(cat => {
    const pct = total > 0 ? Math.round((cat.amount / total) * 100) : 0
    const item = { ...cat, percentage: pct }
    if (item.amount > topCategory.amount) {
      topCategory = item
    }
    return item
  })

  // Set description message for top category
  let topDesc = ''
  if (topCategory.name === 'Hiburan') {
    topDesc = 'Pengeluaran terbesar bulan ini dialokasikan untuk layanan hiburan.'
  } else if (topCategory.name === 'Kerja') {
    topDesc = 'Pengeluaran terbesar bulan ini dialokasikan untuk penunjang produktivitas.'
  } else if (topCategory.name === 'Edukasi') {
    topDesc = 'Pengeluaran terbesar bulan ini dialokasikan untuk pembelajaran & edukasi.'
  } else {
    topDesc = 'Pengeluaran terbesar bulan ini dialokasikan untuk utilitas & kebutuhan lainnya.'
  }

  return (
    <div className="card shadow-none border" style={{ borderRadius: '12px' }}>
      <div className="card-body p-3">
        {hasData ? (
          <div className="row align-items-center g-4">
            <div className="col-md-3 border-md-end pe-md-4">
              <div className="d-flex align-items-center gap-3 mb-2">
                <div 
                  className="avatar rounded text-white flex-shrink-0" 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    backgroundColor: topCategory.color,
                  }}
                >
                  <Icon icon={topCategory.icon as any} size="sm" stroke={1.5} className="text-white" />
                </div>
                <div>
                  <div
                    className="text-secondary small fw-bold text-uppercase"
                    style={{ fontSize: '9px', letterSpacing: '0.05em', lineHeight: 1 }}
                  >
                    Kategori Utama
                  </div>
                  <h3 className="fw-bold mb-0 text-dark" style={{ fontSize: '14px', marginTop: '2px' }}>
                    {topCategory.name} <span className="fw-medium text-secondary ms-1" style={{ fontSize: '11px' }}>(Porsi {Math.round((topCategory.amount / total) * 100)}%)</span>
                  </h3>
                </div>
              </div>
              <p className="small text-secondary mb-0 leading-normal" style={{ fontSize: '11px' }}>
                {topDesc}
              </p>
            </div>
            <div className="col-md-9 ps-md-4">
              <div className="row g-3">
                {processedCategories.map((cat, i) => (
                  <div key={i} className="col-sm-6 col-lg-3">
                    <div className="d-flex justify-content-between align-items-baseline mb-1.5">
                      <div className="fw-bold text-body" style={{ fontSize: '11px' }}>
                        {cat.name} <span className="fw-normal text-secondary ms-1" style={{ fontSize: '10px' }}>({cat.percentage}%)</span>
                      </div>
                      <div className="fw-bold text-dark" style={{ fontSize: '11px' }}>
                        {formatCurrency(cat.amount)}
                      </div>
                    </div>
                    <div
                      className="progress"
                      style={{
                        height: '6px',
                        backgroundColor: 'var(--tblr-border-color)',
                        borderRadius: '10px',
                      }}
                    >
                      <div
                        className="progress-bar"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color,
                          borderRadius: '10px',
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-5 d-flex flex-column align-items-center justify-content-center">
            <Icon icon="chart-bar" size={32} stroke={1.5} className="text-secondary opacity-50 mb-3" />
            <div className="fw-bold text-body mb-1" style={{ fontSize: '14px' }}>Belum Ada Rincian Pengeluaran</div>
            <div className="text-secondary" style={{ fontSize: '12px', lineHeight: '1.5' }}>Tambahkan langganan untuk melihat rincian</div>
          </div>
        )}
      </div>
    </div>
  )
}
