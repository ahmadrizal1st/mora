import { useState, useMemo } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { useBudgets } from '../../hooks/usePlanning'
import { formatCurrency } from '@/shared/utils/currencyUtils'
import { Pagination } from '@/shared/components/ui'

const PAGE_SIZE = 10
const styles = `
  .budget-row:hover {
    background-color: var(--tblr-table-hover-bg, rgba(0, 0, 0, 0.04));
  }
`

export function BudgetDetailedTable() {
  const { data: budgetData } = useBudgets()
  const records = budgetData?.categories || []
  
  const [activeTab, setActiveTab] = useState<'Semua' | 'Needs' | 'Wants' | 'Savings'>('Semua')
  const [page, setPage] = useState(1)

  const filteredData = useMemo(() => {
    let data = records
    if (activeTab === 'Needs') data = data.filter((d: any) => d.type === 'needs')
    if (activeTab === 'Wants') data = data.filter((d: any) => d.type === 'wants')
    if (activeTab === 'Savings') data = data.filter((d: any) => d.type === 'savings')
    return data
  }, [activeTab, records])

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE)
  const paginatedData = filteredData.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleTabChange = (tab: typeof activeTab) => { setActiveTab(tab); setPage(1) }

  return (
    <>
      <style>{styles}</style>
      <div className="card shadow-sm border-0" style={{ borderRadius: '24px', overflow: 'hidden' }}>
        {/* Tabs */}
        <div className="card-header d-flex align-items-center justify-content-between">
          <ul className="nav gap-3" style={{ borderBottom: 'none' }}>
            {(['Semua', 'Needs', 'Wants', 'Savings'] as const).map((tab) => (
              <li className="nav-item" key={tab}>
                <button
                  onClick={() => handleTabChange(tab)}
                  className="bg-transparent border-0 fw-semibold"
                  style={{
                    fontSize: '14px',
                    color: activeTab === tab ? 'var(--tblr-body-color)' : 'var(--tblr-secondary)',
                    transition: 'color 0.15s',
                  }}
                >
                  {tab}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-body p-0 d-flex flex-column">
          {/* Header */}
          <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom flex-shrink-0">
            <span className="fw-bold" style={{ fontSize: '13px' }}>Daftar Kategori Budget</span>
            <span className="text-secondary" style={{ fontSize: '12px' }}>{filteredData.length} item</span>
          </div>

          {/* List */}
          <div className="d-flex flex-column flex-grow-1">
            {filteredData.length === 0 ? (
              <div className="text-center py-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
                <div className="d-flex justify-content-center text-secondary mb-3">
                  <Icon icon="category-2" size={40} stroke={1.5} style={{ opacity: 0.6 }} />
                </div>
                <div className="fw-bold text-body mb-1">Belum Ada Data</div>
                <div className="text-muted small mb-3">Anda belum memiliki catatan budget di kategori ini.</div>
              </div>
            ) : (
              paginatedData.map((cat: any, i: number) => {
                const remaining = cat.limit - cat.spent
                const isOver = remaining < 0
                
                const typeColor = cat.type === 'needs' ? '#f76707' : cat.type === 'wants' ? '#f59f00' : '#2fb344'
                const textColor = isOver ? '#e53e3e' : '#38a169'
                
                return (
                  <div
                    key={cat.id}
                    className="d-flex justify-content-between align-items-center px-3 py-2 budget-row"
                    style={{ 
                      borderBottom: i < paginatedData.length - 1 ? '1px solid #f1f5f9' : undefined,
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <div className="flex-grow-1 overflow-hidden me-2">
                      <div className="fw-semibold text-truncate text-body" style={{ fontSize: '13.5px', marginBottom: '2px' }}>
                        {cat.name}
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-wrap" style={{ fontSize: '11px', color: 'var(--tblr-gray-500)' }}>
                        {cat.type && (
                          <>
                            <span
                              className="rounded-pill px-2 fw-bold d-inline-flex align-items-center justify-content-center text-capitalize"
                              style={{ background: `${typeColor}15`, color: typeColor, fontSize: '9px', height: '18px' }}
                            >
                              {cat.type}
                            </span>
                            <span>·</span>
                          </>
                        )}
                        <span className={`fw-semibold ${isOver ? 'text-danger' : 'text-success'}`}>{isOver ? 'Overbudget' : 'Sesuai Plan'}</span>
                        <span>·</span>
                        <span>Limit: {formatCurrency(cat.limit)}</span>
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <div className="fw-bold flex-shrink-0" style={{ color: textColor, fontSize: '13.5px' }}>
                        {formatCurrency(cat.spent)}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card-footer d-flex flex-column flex-md-row align-items-center justify-content-between bg-transparent border-top py-2 gap-3">
              <div className="text-secondary small d-flex align-items-center">
                Menampilkan&nbsp;<strong>{(page - 1) * PAGE_SIZE + 1}</strong>&nbsp;–&nbsp;
                <strong>{Math.min(page * PAGE_SIZE, filteredData.length)}</strong>&nbsp;dari&nbsp;<strong>{filteredData.length}</strong>
                &nbsp;data
              </div>
              <div className="pagination-wrapper">
                <Pagination
                  activeItem={page}
                  count={totalPages}
                  className="m-0 pagination-sm"
                  onPageChange={(p) => setPage(p)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
