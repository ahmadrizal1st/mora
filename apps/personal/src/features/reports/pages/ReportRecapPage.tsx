import { useState } from 'react'
import { useParams, useNavigate } from '@tanstack/react-router'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { useReportRecap } from '@/features/transaction/hooks/useTransactions'
import { StoryPlayer } from '@/features/reports/components/StoryPlayer'
import { Button } from '@/shared/components/ui'
import { Icon } from '@/shared/components/ui/Icon'

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

function getPersona(savingRate: number, totalTx: number): { title: string; description: string; emoji: string } {
  if (totalTx === 0) {
    return {
      title: 'Pertapa Finansial',
      description: 'Hening tanpa catatan. Yuk mulai aktif mencatat transaksi pertamamu!',
      emoji: '🧘'
    }
  }
  if (savingRate >= 50) {
    return {
      title: 'Master Investasi',
      description: 'Lebih dari setengah pendapatanmu ditabung. Masa depan finansialmu sangat cerah!',
      emoji: '💎'
    }
  }
  if (savingRate >= 20) {
    return {
      title: 'Sultan Hemat',
      description: 'Nabung konsisten, gaya tetap jalan. Alokasi keuanganmu berada di zona sangat sehat!',
      emoji: '👑'
    }
  }
  if (savingRate >= 5) {
    return {
      title: 'Sultan Santai',
      description: 'Masih aman dan bisa bersenang-senang, tapi tabungan bisa ditingkatkan lagi!',
      emoji: '😎'
    }
  }
  if (savingRate >= 0) {
    return {
      title: 'Pejuang Dompet',
      description: 'Pas-pasan tapi untungnya tidak minus. Sedikit lagi menuju zona tabungan aman!',
      emoji: '🧗'
    }
  }
  return {
    title: 'Menteri Dermawan',
    description: 'Banyak belanja (atau berbagi). Pengeluaran melampaui pemasukan, saatnya rem belanja non-primer!',
    emoji: '💸'
  }
}

export function ReportRecapPage() {
  const { periodId } = useParams({ from: '/reports/recap/$periodId' })
  const navigate = useNavigate()
  const { dateFrom, dateTo, label } = parsePeriodId(periodId)
  
  const { data: recap, isLoading } = useReportRecap({ date_from: dateFrom, date_to: dateTo })
  
  const [hideNominal, setHideNominal] = useState(true)
  const [showStory, setShowStory] = useState(false)
  const [activeTheme, setActiveTheme] = useState('auto')

  if (isLoading) {
    return (
      <BaseLayout pageTitle="Morapi Rewind" showBackButton={true}>
        <div className="text-center py-5 my-5">
          <div className="spinner-border text-primary" />
        </div>
      </BaseLayout>
    )
  }

  const income = recap?.income || 0
  const expense = recap?.expense || 0
  const savingRate = recap?.saving_rate || 0
  const totalTx = recap?.total_tx || 0
  
  const kategoriJuaraStr = recap?.kategori_juara || '-'
  const maxExpenseStr = recap?.pengeluaran_terbesar || '-'
  const maxExpenseDayStr = recap?.hari_paling_boros || '-'
  const noSpendDays = recap?.hari_tanpa_belanja || 0
  const mainTimeStr = recap?.waktu_paling_boros || 'Sore Hari · 16:00 - 19:00'
  const mainAccountStr = recap?.dompet_paling_sering || '-'
  const kepatuhanAnggaranStr = recap?.kepatuhan_anggaran || 'Belum Ada Anggaran'
  const pinjamanTerbesarKeStr = recap?.pinjaman_terbesar_ke || '-'
  const perubahanDibandingBulanLaluStr = recap?.perubahan_dibanding_bulan_lalu || '-'

  const maskNominal = (val: string) => {
    if (!val || val === '-') return '-'
    const parts = val.split(' · ')
    if (parts.length < 2) return val
    return `${parts[0]} · ••••`
  }

  const currentPeriodId = new Date().toISOString().substring(0, 7)
  const isCurrentPeriod = periodId === currentPeriodId

  const themeStyle = activeTheme !== 'auto' ? { '--tblr-primary': activeTheme } as React.CSSProperties : {}
  const persona = getPersona(savingRate, totalTx)

  const handleShare = () => {
    const shareUrl = window.location.href
    if (navigator.share) {
      navigator.share({
        title: `Morapi Rewind - ${label}`,
        text: `Lihat Morapi Rewind saya untuk ${label}!`,
        url: shareUrl
      }).catch(err => {
        console.error(err)
      })
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert('Link Morapi Rewind berhasil disalin ke papan klip!')
      }).catch(err => {
        console.error(err)
      })
    }
  }

  return (
    <BaseLayout
      pageTitle="Morapi Rewind"
      showBackButton={true}
    >
      <div>
      {showStory && (
        <div style={themeStyle}>
          <StoryPlayer 
            label={label}
            savingRate={savingRate}
            totalTx={totalTx}
            income={income}
            expense={expense}
            onClose={() => setShowStory(false)}
            kategoriJuara={kategoriJuaraStr}
            pengeluaranTerbesar={maxExpenseStr}
            hariPalingBoros={maxExpenseDayStr}
            hariTanpaBelanja={noSpendDays}
            waktuPalingBoros={mainTimeStr}
            dompetPalingSering={mainAccountStr}
            personaTitle={persona.title}
            personaDesc={persona.description}
            personaEmoji={persona.emoji}
            onClickShare={handleShare}
          />
        </div>
      )}

      <div className="w-100 pb-5">
        
        <div className="container-xl pt-4 pb-5">
          {/* Header Title */}
          <div className="text-center">
            <h2 className="fw-bold mb-1" style={{ fontSize: '22px' }}>{label}</h2>
            <span className="badge rounded-pill" style={{ backgroundColor: isCurrentPeriod ? '#f3ece6' : '#e6f4ea', color: isCurrentPeriod ? '#8c6e5a' : '#137333', fontWeight: '500', fontSize: '11px', padding: '4px 12px' }}>
              {isCurrentPeriod ? 'Masih berjalan' : 'Periode selesai'}
            </span>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3 btn-print-hidden">
            <span className="text-secondary" style={{ fontSize: '13px' }}>
              Rangkuman performa keuangan Anda
            </span>
            <Button
              onClick={() => window.print()}
              ghost
              size="sm"
              icon="printer"
              text="Ekspor PDF"
              className="fw-medium text-body px-2"
            />
          </div>

          <div className="row g-4">
            {/* Left Column: Recap Card & Main controls */}
            <div className="col-12 col-lg-6 d-flex flex-column gap-4">
              {/* Buttons */}
              <div className="row g-2">
                <div className="col-6">
                  <button 
                    className="btn btn-primary w-100 rounded-3 py-2 fw-semibold d-flex justify-content-center align-items-center gap-2 shadow-sm border-0" 
                    style={{ backgroundColor: 'var(--tblr-primary)', fontSize: '14px' }}
                    onClick={() => setShowStory(true)}
                  >
                    <Icon icon="player-play" size={18} stroke={2} />
                    Putar Morapi Rewind
                  </button>
                </div>
                <div className="col-6">
                  <button 
                    className="btn w-100 rounded-3 py-2 d-flex justify-content-center align-items-center gap-2 border bg-surface text-secondary" 
                    style={{ fontSize: '13px' }}
                    onClick={() => setHideNominal(!hideNominal)}
                  >
                    {hideNominal ? (
                      <Icon icon="eye-off" size={16} stroke={2} />
                    ) : (
                      <Icon icon="eye" size={16} stroke={2} />
                    )}
                    {hideNominal ? 'Tampilkan Angka' : 'Sembunyikan Angka'}
                  </button>
                </div>
              </div>

              {/* Main Recap Card */}
              <div 
                className="card rounded-4 border-0 text-white overflow-hidden" 
                style={{ 
                  ...themeStyle,
                  backgroundColor: 'var(--tblr-primary)', 
                  transition: 'background-color 0.3s ease' 
                }}
              >
                <div className="card-body p-4 d-flex flex-column h-100">
                  
                  {/* Header inside card */}
                  <div className="d-flex justify-content-between align-items-center mb-5">
                    <div className="d-flex align-items-center gap-2 fw-semibold" style={{ fontSize: '15px' }}>
                      <div 
                        style={{ 
                          width: '20px', 
                          height: '20px', 
                          backgroundColor: 'var(--tblr-bg-surface)',
                          WebkitMaskImage: 'url("/logo/logo-nobg-fill.png")',
                          maskImage: 'url("/logo/logo-nobg-fill.png")',
                          WebkitMaskSize: 'contain',
                          maskSize: 'contain',
                          WebkitMaskRepeat: 'no-repeat',
                          maskRepeat: 'no-repeat',
                          WebkitMaskPosition: 'center',
                          maskPosition: 'center',
                        }} 
                      />
                      <span style={{ fontFamily: "'Slackey', cursive", letterSpacing: '-0.03rem' }}>morapi</span>
                    </div>
                    <div style={{ fontSize: '13px', opacity: 0.8 }}>
                      {label}
                    </div>
                  </div>

                  {/* Persona Illustration */}
                  <div className="text-center flex-grow-1 d-flex flex-column justify-content-center align-items-center mb-5">
                    <div className="mb-4" style={{ fontSize: '64px' }}>
                      {persona.emoji}
                    </div>
                    <div style={{ fontSize: '12px', opacity: 0.9 }} className="mb-1">
                      Persona finansialmu
                    </div>
                    <h3 className="fw-bold mb-2" style={{ fontSize: '24px' }}>
                      {persona.title}
                    </h3>
                    <p className="mb-4" style={{ fontSize: '14px', opacity: 0.9 }}>
                      {persona.description}
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
                        <div className="fw-bold fs-4">{totalTx}</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-4 p-3 mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <div className="mb-1" style={{ fontSize: '12px', opacity: 0.9 }}>Kategori juara</div>
                    <div className="fw-bold" style={{ fontSize: '15px' }}>{kategoriJuaraStr}</div>
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
                    <div className="bg-surface rounded p-1">
                      <Icon icon="qrcode" size={24} stroke={1.5} style={{ color: 'var(--tblr-primary)' }} />
                    </div>
                    <span className="badge rounded-pill" style={{ backgroundColor: 'rgba(255,255,255,0.2)', fontSize: '11px', padding: '6px 10px', fontWeight: '500' }}>
                      morapi.localhost
                    </span>
                  </div>
                  
                </div>
              </div>

              {/* Theme Colors Row */}
              <div className="d-flex justify-content-center align-items-center gap-3 mb-4">
                <span 
                  className="badge rounded-pill" 
                  style={{ 
                    backgroundColor: activeTheme === 'auto' ? 'var(--tblr-primary)' : 'var(--tblr-bg-surface-secondary)', 
                    color: activeTheme === 'auto' ? '#ffffff' : 'var(--tblr-secondary-color)', 
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

              <button 
                onClick={handleShare}
                className="btn btn-primary w-100 rounded-3 py-2 mb-4 fw-semibold d-flex justify-content-center align-items-center gap-2 shadow-sm" 
                style={{ backgroundColor: 'var(--tblr-primary)', borderColor: 'var(--tblr-primary)', fontSize: '14px' }}
              >
                <Icon icon="upload" size={16} stroke={2} />
                Bagikan Morapi Rewind
              </button>
            </div>

            {/* Right Column: Detailed Recap list & Supporting Stats */}
            <div className="col-12 col-lg-6 d-flex flex-column gap-4">
              {/* Personal Recommendation Card */}
              <div className="card rounded-4 border-0 shadow-sm" style={{ backgroundColor: 'var(--tblr-primary-lt)' }}>
                <div className="card-body p-4">
                  <div className="d-flex gap-3 align-items-start">
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0" style={{ width: '36px', height: '36px' }}>
                      <Icon icon="bulb" size={20} />
                    </div>
                    <div>
                      <h4 className="fw-bold text-primary mb-2" style={{ fontSize: '14px' }}>Rekomendasi Finansial</h4>
                      <p className="mb-0 text-body opacity-75 leading-tight" style={{ fontSize: '13px' }}>
                        {savingRate >= 20 
                          ? "Pertahankan performamu! Tingkat menabung Anda berada di zona aman (di atas 20%). Disarankan untuk mulai mengalokasikan dana dingin Anda ke tabungan impian (Goals) atau instrumen investasi pasif." 
                          : "Tingkat menabung Anda masih berada di bawah target ideal 20%. Cobalah meninjau pengeluaran non-primer di kategori Makanan & Minuman untuk meningkatkan saldo tersimpan bulan depan."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details List */}
              <div className="card rounded-4 border-0 shadow-sm">
                <div className="card-header bg-transparent border-0 pt-4 px-4 pb-0">
                  <h3 className="card-title fw-bold m-0" style={{ fontSize: '15px' }}>Detail Metrik</h3>
                </div>
                <div className="card-body p-0">
                  {[
                    { label: 'Arus bersih', value: hideNominal ? '••••' : `+ ${(income - expense).toLocaleString('id-ID')}` },
                    { label: 'Kategori juara', value: kategoriJuaraStr },
                    { label: 'Pengeluaran terbesar', value: hideNominal ? maskNominal(maxExpenseStr) : maxExpenseStr },
                    { label: 'Hari paling boros', value: hideNominal ? maskNominal(maxExpenseDayStr) : maxExpenseDayStr },
                    { label: 'Hari tanpa belanja', value: `${noSpendDays} Hari` },
                    { label: 'Waktu paling boros', value: mainTimeStr },
                    { label: 'Kepatuhan anggaran', value: kepatuhanAnggaranStr },
                    { label: 'Dompet paling sering', value: mainAccountStr },
                    { label: 'Pinjaman terbesar ke', value: hideNominal ? '••••' : pinjamanTerbesarKeStr },
                    { label: 'Perubahan net worth', value: hideNominal ? '••••' : `+ ${(income - expense).toLocaleString('id-ID')}` },
                  ].map((item, idx, arr) => (
                    <div key={idx} className="d-flex justify-content-between px-4 py-3 border-bottom" style={{ borderBottomColor: idx < arr.length - 1 ? 'var(--tblr-border-color)' : 'transparent', fontSize: '13px' }}>
                      <span className="text-secondary">{item.label}</span>
                      <span className="fw-semibold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metrik Proyeksi Masa Depan Card */}
              <div className="card rounded-4 border-0 shadow-sm">
                <div className="card-body p-4">
                  <h4 className="fw-bold text-secondary mb-3 text-uppercase" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>Proyeksi Masa Depan</h4>
                  <div className="d-flex justify-content-between mb-2 text-secondary" style={{ fontSize: '13px' }}>
                    <span>Perubahan dibanding bulan lalu</span>
                    <span className="fw-semibold text-success">{perubahanDibandingBulanLaluStr}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 text-secondary" style={{ fontSize: '13px' }}>
                    <span>Prediksi Pengeluaran Bulan Depan</span>
                    <span className="fw-semibold text-body">Rp {(expense * 1.05).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2 text-secondary" style={{ fontSize: '13px' }}>
                    <span>Potensi Tabungan 1 Tahun</span>
                    <span className="fw-semibold text-success">+ Rp {((income - expense) * 12).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="d-flex justify-content-between text-secondary" style={{ fontSize: '13px' }}>
                    <span>Estimasi Hari Bebas Belanja (Bulan Ini)</span>
                    <span className="fw-semibold text-body">{noSpendDays} Hari</span>
                  </div>
                </div>
              </div>

              <button 
                className="btn w-100 rounded-3 py-3 d-flex justify-content-center align-items-center gap-2 border-0 bg-surface text-secondary" 
                style={{ fontSize: '13px' }}
                onClick={() => navigate({ to: `/reports/recap/${dateFrom.substring(0, 4)}` })}
              >
                <Icon icon="file-check" size={16} stroke={2} />
                Lihat Morapi Rewind {dateFrom.substring(0, 4)}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </BaseLayout>
  )
}
