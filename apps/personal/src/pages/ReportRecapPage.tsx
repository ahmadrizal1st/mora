import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { useTransactionSummary, useTransactions } from '@/features/transaction/hooks/useTransactions'
import { StoryPlayer } from '@/features/reports/components/StoryPlayer'

function parsePeriodId(periodId: string): { dateFrom: string; dateTo: string, label: string } {
  if (/^\d{4}-\d{2}$/.test(periodId)) {
    const [year, month] = periodId.split('-').map(Number)
    const lastDay = new Date(year, month, 0).getDate()
    const date = new Date(year, month - 1, 1)
    return {
      dateFrom: `${year}-${String(month).padStart(2, '0')}-01`,
      dateTo: `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`,
      label: date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
    }
  }
  if (/^\d{4}$/.test(periodId)) {
    const year = Number(periodId)
    return {
      dateFrom: `${year}-01-01`,
      dateTo: `${year}-12-31`,
      label: `Tahun ${year}`
    }
  }
  const now = new Date()
  return {
    dateFrom: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`,
    dateTo: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, '0')}`,
    label: now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
  }
}

export function ReportRecapPage() {
  const { periodId } = useParams({ from: '/reports/recap/$periodId' })
  const navigate = useNavigate()
  const { dateFrom, dateTo, label } = parsePeriodId(periodId)
  
  const { data: summary } = useTransactionSummary({ date_from: dateFrom, date_to: dateTo })
  const { data: txData } = useTransactions({ date_from: dateFrom, date_to: dateTo, per_page: 1 })

  const income = summary?.total_income || 0
  const expense = summary?.total_expense || 0
  const savingRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0
  

  const [hideNominal, setHideNominal] = useState(true)
  const [showStory, setShowStory] = useState(false)
  const [activeTheme, setActiveTheme] = useState('auto')

  const themeStyle = activeTheme !== 'auto' ? { '--tblr-primary': activeTheme } as React.CSSProperties : {}

  return (
    <BaseLayout
      pageTitle="Kilas Balik"
      showBackButton={true}
    >
      <div style={themeStyle}>
      {showStory && (
        <StoryPlayer 
          label={label}
          savingRate={savingRate}
          totalTx={txData?.total || 0}
          income={income}
          expense={expense}
          onClose={() => setShowStory(false)}
        />
      )}

      <div className="w-100 pb-5">
        
        <div className="container-xl pt-4 pb-5">
          {/* Header Title */}
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-1" style={{ fontSize: '18px' }}>{label}</h2>
            <span className="badge rounded-pill" style={{ backgroundColor: '#f3ece6', color: '#8c6e5a', fontWeight: '500', fontSize: '12px', padding: '4px 12px' }}>
              Masih berjalan
            </span>
          </div>

          {/* Buttons */}
          <button 
            className="btn btn-primary w-100 rounded-3 py-2 mb-3 fw-semibold d-flex justify-content-center align-items-center gap-2 shadow-sm" 
            style={{ backgroundColor: 'var(--tblr-primary)', borderColor: 'var(--tblr-primary)', fontSize: '15px' }}
            onClick={() => setShowStory(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4v16l13 -8z" /></svg>
            Putar kilas balik
          </button>
          
          <button 
            className="btn w-100 rounded-3 py-2 mb-4 d-flex justify-content-center align-items-center gap-2" 
            style={{ backgroundColor: '#f0f2f5', color: '#64748b', fontSize: '14px', border: 'none' }}
            onClick={() => setHideNominal(!hideNominal)}
          >
            {hideNominal ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" /><path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" /><path d="M3 3l18 18" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
            )}
            {hideNominal ? 'Nominal disembunyikan (ketuk untuk tampilkan)' : 'Nominal ditampilkan (ketuk untuk sembunyikan)'}
          </button>

          {/* Main Recap Card */}
          <div className="card rounded-4 border-0 text-white overflow-hidden mb-4" style={{ backgroundColor: 'var(--tblr-primary)', transition: 'background-color 0.3s ease' }}>
            <div className="card-body p-4 d-flex flex-column h-100">
              
              {/* Header inside card */}
              <div className="d-flex justify-content-between align-items-center mb-5">
                <div className="d-flex align-items-center gap-2 fw-semibold" style={{ fontSize: '15px' }}>
                  <div className="rounded bg-white bg-opacity-25 d-flex align-items-center justify-content-center" style={{ width: '22px', height: '22px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /><path d="M9 14l2 2l4 -4" /></svg>
                  </div>
                  PFinTrack
                </div>
                <div style={{ fontSize: '13px', opacity: 0.8 }}>
                  {label}
                </div>
              </div>

              {/* Persona Illustration */}
              <div className="text-center flex-grow-1 d-flex flex-column justify-content-center align-items-center mb-5">
                <div className="mb-4" style={{ fontSize: '64px' }}>
                  👑
                </div>
                <div style={{ fontSize: '12px', opacity: 0.9 }} className="mb-1">
                  Persona finansialmu
                </div>
                <h3 className="fw-bold mb-2" style={{ fontSize: '24px' }}>
                  Sultan Hemat
                </h3>
                <p className="mb-4" style={{ fontSize: '14px', opacity: 0.9 }}>
                  Nabung terus, gaya tetap oke. Ini baru sultan.
                </p>
              </div>

              {/* Stats Rows */}
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <div className="rounded-4 p-3 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <div className="mb-2" style={{ fontSize: '12px', opacity: 0.9 }}>Saving rate</div>
                    <div className="fw-bold fs-4">{savingRate}%</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="rounded-4 p-3 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <div className="mb-2" style={{ fontSize: '12px', opacity: 0.9 }}>Transaksi</div>
                    <div className="fw-bold fs-4">{txData?.total || 0}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-4 p-3 mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <div className="mb-1" style={{ fontSize: '12px', opacity: 0.9 }}>Kategori juara</div>
                <div className="fw-bold" style={{ fontSize: '15px' }}>Makanan & Minuman &middot; 41%</div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6">
                  <div className="rounded-4 p-3 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <div className="mb-1" style={{ fontSize: '12px', opacity: 0.9 }}>Pemasukan</div>
                    <div className="fw-bold" style={{ fontSize: '16px', letterSpacing: hideNominal ? '4px' : '0' }}>{hideNominal ? '••••' : `+ ${income.toLocaleString('id-ID')}`}</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="rounded-4 p-3 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <div className="mb-1" style={{ fontSize: '12px', opacity: 0.9 }}>Pengeluaran</div>
                    <div className="fw-bold" style={{ fontSize: '16px', letterSpacing: hideNominal ? '4px' : '0' }}>{hideNominal ? '••••' : `- ${expense.toLocaleString('id-ID')}`}</div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center align-items-center gap-2">
                <div className="bg-white rounded p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="var(--tblr-primary)" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M14 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M14 14l3 0" /><path d="M17 14l0 3" /><path d="M20 14l0 3" /><path d="M14 17l3 0" /><path d="M17 17l0 3" /><path d="M20 17l0 3" /></svg>
                </div>
                <span className="badge rounded-pill" style={{ backgroundColor: 'rgba(255,255,255,0.2)', fontSize: '11px', padding: '6px 10px', fontWeight: '500' }}>
                  pfintrack.site
                </span>
              </div>
              
            </div>
          </div>

          {/* Theme Colors Row */}
          <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
            <span 
              className="badge rounded-pill" 
              style={{ 
                backgroundColor: activeTheme === 'auto' ? 'var(--tblr-primary)' : 'rgba(0,0,0,0.05)', 
                color: activeTheme === 'auto' ? 'white' : 'rgba(0,0,0,0.5)', 
                fontSize: '11px', 
                padding: '6px 12px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => setActiveTheme('auto')}
            >Otomatis</span>
            {['#3b82f6', '#3f9349', '#f59e0b', '#a855f7', '#ef4444'].map(color => (
              <div 
                key={color}
                className="rounded-circle d-flex justify-content-center align-items-center" 
                style={{ 
                  width: activeTheme === color ? '18px' : '14px', 
                  height: activeTheme === color ? '18px' : '14px', 
                  backgroundColor: color, 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: activeTheme === color ? `0 0 0 2px white, 0 0 0 4px ${color}` : 'none'
                }}
                onClick={() => setActiveTheme(color)}
              ></div>
            ))}
          </div>

          <button className="btn btn-primary w-100 rounded-3 py-2 mb-4 fw-semibold d-flex justify-content-center align-items-center gap-2 shadow-sm" style={{ backgroundColor: 'var(--tblr-primary)', borderColor: 'var(--tblr-primary)', fontSize: '14px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 9l5 -5l5 5" /><path d="M12 4l0 12" /></svg>
            Bagikan kilas balik
          </button>

          {/* Details List */}
          <div className="card rounded-4 border-0 mb-4 shadow-sm">
            <div className="card-body p-0">
              {[
                { label: 'Arus bersih', value: hideNominal ? '••••' : `+ ${(income - expense).toLocaleString('id-ID')}` },
                { label: 'Kategori juara', value: 'Makanan & Minuman · 41%' },
                { label: 'Pengeluaran terbesar', value: hideNominal ? 'Baju & Sepatu · ••••' : 'Baju & Sepatu · 150.000' },
                { label: 'Hari paling boros', value: hideNominal ? 'Rab, 24 Jun 2026 · ••••' : 'Rab, 24 Jun 2026 · 500.000' },
                { label: 'Hari tanpa belanja', value: '1' },
                { label: 'Dompet paling sering', value: 'GoPay · 28×' },
                { label: 'Pinjaman terbesar ke', value: hideNominal ? 'Andi · ••••' : 'Andi · 50.000' },
                { label: 'Perubahan net worth', value: hideNominal ? '••••' : '+ 100.000' },
              ].map((item, idx, arr) => (
                <div key={idx} className="d-flex justify-content-between px-4 py-3" style={{ borderBottom: idx < arr.length - 1 ? '1px solid #f0f0f0' : undefined, fontSize: '13px' }}>
                  <span className="text-secondary">{item.label}</span>
                  <span className="fw-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            className="btn w-100 rounded-3 py-3 d-flex justify-content-center align-items-center gap-2" 
            style={{ backgroundColor: '#f0f2f5', color: '#64748b', fontSize: '13px', border: 'none' }}
            onClick={() => navigate({ to: `/reports/recap/${dateFrom.substring(0, 4)}` })}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M14 3v4a1 1 0 0 0 1 1h4" /><path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" /><path d="M9 15l2 2l4 -4" /></svg>
            Lihat Kilas Balik {dateFrom.substring(0, 4)}
          </button>
        </div>
      </div>
      </div>
    </BaseLayout>
  )
}
