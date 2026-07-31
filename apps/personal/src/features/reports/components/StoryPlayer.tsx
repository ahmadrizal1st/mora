import { useState, useEffect, useRef } from 'react'
import { useCountUp } from '@/shared/hooks/useCountUp'
import { Icon } from '@/shared/components/ui/Icon'

interface StoryPlayerProps {
  label: string
  savingRate: number
  totalTx: number
  income: number
  expense: number
  onClose: () => void
  kategoriJuara?: string
  pengeluaranTerbesar?: string
  hariPalingBoros?: string
  hariTanpaBelanja?: number
  waktuPalingBoros?: string
  dompetPalingSering?: string
  personaTitle?: string
  personaDesc?: string
  personaEmoji?: string
  onClickShare?: () => void
}

const DURATION_PER_SLIDE = 5000 // 5 seconds

export function StoryPlayer({ 
  label, 
  savingRate, 
  totalTx, 
  income, 
  expense, 
  onClose,
  kategoriJuara = 'Makanan & Minuman · 41%',
  pengeluaranTerbesar = 'Baju & Sepatu · 150.000',
  hariPalingBoros = '-',
  hariTanpaBelanja = 0,
  waktuPalingBoros = 'Sore Hari · 16:00 - 19:00',
  dompetPalingSering = '-',
  personaTitle = 'Sultan Hemat',
  personaDesc = 'Nabung terus, gaya tetap oke. Ini baru sultan.',
  personaEmoji = '👑',
  onClickShare
}: StoryPlayerProps) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const totalSlides = 10
  const progressInterval = useRef<number | null>(null)

  // Auto-advance logic
  useEffect(() => {
    setProgress(0)
    
    progressInterval.current = window.setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          if (activeSlide < totalSlides - 1) {
            setActiveSlide(s => s + 1)
            return 0
          } else {
            // End of story
            clearInterval(progressInterval.current!)
            return 100
          }
        }
        return p + (100 / (DURATION_PER_SLIDE / 50)) // Update every 50ms
      })
    }, 50)

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [activeSlide, totalSlides])

  const handleTapLeft = () => {
    if (activeSlide > 0) {
      setActiveSlide(s => s - 1)
    }
  }

  const handleTapRight = () => {
    if (activeSlide < totalSlides - 1) {
      setActiveSlide(s => s + 1)
    } else {
      // Re-trigger animation or end
      setProgress(100)
    }
  }

  // Count animations for respective slides
  const animIncome = useCountUp(activeSlide >= 1 ? income : 0, 1000, 0, 100)
  const animExpense = useCountUp(activeSlide >= 2 ? expense : 0, 1000, 0, 100)
  const animSavingRate = useCountUp(activeSlide >= 3 ? savingRate : 0, 1000, 0, 100)
  const animTx = useCountUp(activeSlide >= 4 ? totalTx : 0, 1000, 0, 100)

  const handleShare = () => {
    if (onClickShare) {
      onClickShare()
      return
    }
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
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column" 
      style={{ 
        zIndex: 9999, 
        backgroundColor: '#000000',
        color: 'white',
        overflow: 'hidden'
      }}
    >
      {/* Progress Bars */}
      <div className="d-flex w-100 px-2 pt-2 position-absolute top-0 start-0 z-3" style={{ gap: '4px' }}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <div key={index} className="flex-grow-1 rounded-pill overflow-hidden" style={{ height: '3px', backgroundColor: 'rgba(255,255,255,0.3)' }}>
            <div 
              className="h-100 bg-surface rounded-pill" 
              style={{ 
                width: index < activeSlide ? '100%' : index === activeSlide ? `${progress}%` : '0%',
                transition: index === activeSlide ? 'width 50ms linear' : 'none'
              }} 
            />
          </div>
        ))}
      </div>

      {/* Tap Navigation Overlays */}
      <div className="position-absolute top-0 start-0 w-25 h-100 z-2" onClick={handleTapLeft} />
      <div className="position-absolute top-0 end-0 w-75 h-100 z-2" onClick={handleTapRight} />

      {/* Slide 0: Splash */}
      <div 
        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center position-absolute top-0 start-0 transition-opacity"
        style={{ 
          opacity: activeSlide === 0 ? 1 : 0, 
          pointerEvents: activeSlide === 0 ? 'auto' : 'none',
          background: 'linear-gradient(135deg, var(--tblr-primary) 0%, color-mix(in srgb, var(--tblr-primary), black 35%) 100%)',
          transition: 'opacity 0.6s ease-in-out'
        }}
      >
        <div className="text-center" style={{ transform: activeSlide === 0 ? 'scale(1)' : 'scale(0.9)', transition: 'transform 0.5s ease-out' }}>
          <div className="mb-4" style={{ fontSize: '80px' }}>🎉</div>
          <div className="mb-2" style={{ fontSize: '13px', opacity: 0.8 }}>{label}</div>
          <h2 className="fw-bold mb-3" style={{ fontSize: '32px' }}>Morapi Rewind</h2>
          <p style={{ fontSize: '15px', opacity: 0.9 }}>Sebulan penuh kamu sudah catat. Yuk lihat hasilnya.</p>
        </div>
        <div className="position-absolute bottom-0 mb-4 pb-4 text-center" style={{ fontSize: '11px', opacity: 0.6 }}>
          Ketuk layar kanan untuk lanjut<br/>
          Dibuat dengan Morapi AI
        </div>
      </div>

      {/* Slide 1: Pemasukan (Income) */}
      <div 
        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center position-absolute top-0 start-0 transition-opacity"
        style={{ 
          opacity: activeSlide === 1 ? 1 : 0, 
          pointerEvents: activeSlide === 1 ? 'auto' : 'none',
          background: 'linear-gradient(135deg, #1e40af 0%, #1e3b8a 100%)',
          transition: 'opacity 0.6s ease-in-out'
        }}
      >
        <div className="container-xl d-flex flex-column align-items-center w-100" style={{ maxWidth: '400px', transform: activeSlide === 1 ? 'translateY(0)' : 'translateY(20px)', transition: 'transform 0.5s ease-out' }}>
          <div className="text-center mb-5">
            <div style={{ fontSize: '72px' }} className="mb-3">💰</div>
            <h3 className="fw-bold mb-2" style={{ fontSize: '24px' }}>Uang Masuk</h3>
            <p className="opacity-75" style={{ fontSize: '14px' }}>Semua dimulai dari sini. Kerja kerasmu terbayarkan!</p>
          </div>
          <div className="p-4 rounded-4 w-100 text-center shadow" style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
            <div className="opacity-75 mb-2" style={{ fontSize: '12px' }}>TOTAL PEMASUKAN</div>
            <h1 className="fw-bold" style={{ fontSize: '32px', color: '#38bdf8' }}>
              + Rp {animIncome.toLocaleString('id-ID')}
            </h1>
          </div>
        </div>
      </div>

      {/* Slide 2: Pengeluaran (Expense) */}
      <div 
        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center position-absolute top-0 start-0 transition-opacity"
        style={{ 
          opacity: activeSlide === 2 ? 1 : 0, 
          pointerEvents: activeSlide === 2 ? 'auto' : 'none',
          background: 'linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%)',
          transition: 'opacity 0.6s ease-in-out'
        }}
      >
        <div className="container-xl d-flex flex-column align-items-center w-100" style={{ maxWidth: '400px', transform: activeSlide === 2 ? 'translateY(0)' : 'translateY(20px)', transition: 'transform 0.5s ease-out' }}>
          <div className="text-center mb-5">
            <div style={{ fontSize: '72px' }} className="mb-3">💸</div>
            <h3 className="fw-bold mb-2" style={{ fontSize: '24px' }}>Uang Keluar</h3>
            <p className="opacity-75" style={{ fontSize: '14px' }}>Untuk menunjang kebutuhan dan gayamu bulan ini...</p>
          </div>
          <div className="p-4 rounded-4 w-100 text-center shadow" style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
            <div className="opacity-75 mb-2" style={{ fontSize: '12px' }}>TOTAL PENGELUARAN</div>
            <h1 className="fw-bold" style={{ fontSize: '32px', color: '#f87171' }}>
              - Rp {animExpense.toLocaleString('id-ID')}
            </h1>
          </div>
        </div>
      </div>

      {/* Slide 3: Arus Kas Bersih (Saving Rate) */}
      <div 
        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center position-absolute top-0 start-0 transition-opacity"
        style={{ 
          opacity: activeSlide === 3 ? 1 : 0, 
          pointerEvents: activeSlide === 3 ? 'auto' : 'none',
          background: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)',
          transition: 'opacity 0.6s ease-in-out'
        }}
      >
        <div className="container-xl d-flex flex-column align-items-center w-100" style={{ maxWidth: '400px', transform: activeSlide === 3 ? 'translateY(0)' : 'translateY(20px)', transition: 'transform 0.5s ease-out' }}>
          <div className="text-center mb-4">
            <div style={{ fontSize: '72px' }} className="mb-3">📈</div>
            <h3 className="fw-bold mb-2" style={{ fontSize: '24px' }}>Arus Bersih & Saving Rate</h3>
            <p className="opacity-75" style={{ fontSize: '14px' }}>Seberapa hemat kamu di {label}?</p>
          </div>
          <div className="p-4 rounded-4 w-100 text-center shadow mb-3" style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
            <div className="opacity-75 mb-1" style={{ fontSize: '12px' }}>SISA DANA TERIMPIT</div>
            <h2 className="fw-bold text-white" style={{ fontSize: '24px' }}>
              Rp {(income - expense).toLocaleString('id-ID')}
            </h2>
          </div>
          <div className="p-3 rounded-4 w-100 text-center shadow" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <div className="opacity-75 mb-1" style={{ fontSize: '12px' }}>SAVING RATE</div>
            <h2 className="fw-bold" style={{ fontSize: '28px', color: '#34d399' }}>
              {animSavingRate}%
            </h2>
          </div>
        </div>
      </div>

      {/* Slide 4: Frekuensi Transaksi (Transaction Count) */}
      <div 
        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center position-absolute top-0 start-0 transition-opacity"
        style={{ 
          opacity: activeSlide === 4 ? 1 : 0, 
          pointerEvents: activeSlide === 4 ? 'auto' : 'none',
          background: 'linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%)',
          transition: 'opacity 0.6s ease-in-out'
        }}
      >
        <div className="container-xl d-flex flex-column align-items-center w-100" style={{ maxWidth: '400px', transform: activeSlide === 4 ? 'translateY(0)' : 'translateY(20px)', transition: 'transform 0.5s ease-out' }}>
          <div className="text-center mb-5">
            <div style={{ fontSize: '72px' }} className="mb-3">✍️</div>
            <h3 className="fw-bold mb-2" style={{ fontSize: '24px' }}>Rajin Mencatat</h3>
            <p className="opacity-75" style={{ fontSize: '14px' }}>Setiap transaksi adalah langkah menuju merdeka finansial!</p>
          </div>
          <div className="p-4 rounded-4 w-100 text-center shadow" style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
            <div className="opacity-75 mb-2" style={{ fontSize: '12px' }}>TOTAL TRANSAKSI</div>
            <h1 className="fw-bold text-white" style={{ fontSize: '32px' }}>
              {animTx} Kali
            </h1>
          </div>
        </div>
      </div>

      {/* Slide 5: Kategori Terboros (Top Category) */}
      <div 
        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center position-absolute top-0 start-0 transition-opacity"
        style={{ 
          opacity: activeSlide === 5 ? 1 : 0, 
          pointerEvents: activeSlide === 5 ? 'auto' : 'none',
          background: 'linear-gradient(135deg, #c2410c 0%, #7c2d12 100%)',
          transition: 'opacity 0.6s ease-in-out'
        }}
      >
        <div className="container-xl d-flex flex-column align-items-center w-100" style={{ maxWidth: '400px', transform: activeSlide === 5 ? 'translateY(0)' : 'translateY(20px)', transition: 'transform 0.5s ease-out' }}>
          <div className="text-center mb-5">
            <div style={{ fontSize: '72px' }} className="mb-3">🍕</div>
            <h3 className="fw-bold mb-2" style={{ fontSize: '24px' }}>Kategori Terboros</h3>
            <p className="opacity-75" style={{ fontSize: '14px' }}>Kategori yang paling banyak memakan anggaranmu:</p>
          </div>
          <div className="p-4 rounded-4 w-100 text-center shadow" style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
            <div className="opacity-75 mb-2" style={{ fontSize: '12px' }}>KATEGORI JUARA</div>
            <h2 className="fw-bold text-warning" style={{ fontSize: '22px' }}>
              {kategoriJuara}
            </h2>
          </div>
        </div>
      </div>

      {/* Slide 6: Pengeluaran Terbesar (Max Expense) */}
      <div 
        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center position-absolute top-0 start-0 transition-opacity"
        style={{ 
          opacity: activeSlide === 6 ? 1 : 0, 
          pointerEvents: activeSlide === 6 ? 'auto' : 'none',
          background: 'linear-gradient(135deg, #991b1b 0%, #450a0a 100%)',
          transition: 'opacity 0.6s ease-in-out'
        }}
      >
        <div className="container-xl d-flex flex-column align-items-center w-100" style={{ maxWidth: '400px', transform: activeSlide === 6 ? 'translateY(0)' : 'translateY(20px)', transition: 'transform 0.5s ease-out' }}>
          <div className="text-center mb-5">
            <div style={{ fontSize: '72px' }} className="mb-3">🦖</div>
            <h3 className="fw-bold mb-2" style={{ fontSize: '24px' }}>Pengeluaran Terbesar</h3>
            <p className="opacity-75" style={{ fontSize: '14px' }}>Nominal belanja sekali bayar yang paling besar:</p>
          </div>
          <div className="p-4 rounded-4 w-100 text-center shadow" style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
            <div className="opacity-75 mb-2" style={{ fontSize: '12px' }}>SINGLE PURCHASE TERBESAR</div>
            <h2 className="fw-bold" style={{ fontSize: '22px', color: '#f87171' }}>
              {pengeluaranTerbesar}
            </h2>
          </div>
        </div>
      </div>

      {/* Slide 7: Waktu Belanja Teraktif (Peak Spending Hours) */}
      <div 
        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center position-absolute top-0 start-0 transition-opacity"
        style={{ 
          opacity: activeSlide === 7 ? 1 : 0, 
          pointerEvents: activeSlide === 7 ? 'auto' : 'none',
          background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
          transition: 'opacity 0.6s ease-in-out'
        }}
      >
        <div className="container-xl d-flex flex-column align-items-center w-100" style={{ maxWidth: '400px', transform: activeSlide === 7 ? 'translateY(0)' : 'translateY(20px)', transition: 'transform 0.5s ease-out' }}>
          <div className="text-center mb-5">
            <div style={{ fontSize: '72px' }} className="mb-3">⏰</div>
            <h3 className="fw-bold mb-2" style={{ fontSize: '24px' }}>Waktu Belanja</h3>
            <p className="opacity-75" style={{ fontSize: '14px' }}>Jam-jam rawan di mana jempolmu gemar berbelanja:</p>
          </div>
          <div className="p-4 rounded-4 w-100 text-center shadow" style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
            <div className="opacity-75 mb-2" style={{ fontSize: '12px' }}>JAM TERSIBUK DOMPET</div>
            <h2 className="fw-bold text-info" style={{ fontSize: '22px' }}>
              {waktuPalingBoros}
            </h2>
          </div>
        </div>
      </div>

      {/* Slide 8: Hari Tanpa Belanja (No-Spend Days) */}
      <div 
        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center position-absolute top-0 start-0 transition-opacity"
        style={{ 
          opacity: activeSlide === 8 ? 1 : 0, 
          pointerEvents: activeSlide === 8 ? 'auto' : 'none',
          background: 'linear-gradient(135deg, #047857 0%, #064e3b 100%)',
          transition: 'opacity 0.6s ease-in-out'
        }}
      >
        <div className="container-xl d-flex flex-column align-items-center w-100" style={{ maxWidth: '400px', transform: activeSlide === 8 ? 'translateY(0)' : 'translateY(20px)', transition: 'transform 0.5s ease-out' }}>
          <div className="text-center mb-5">
            <div style={{ fontSize: '72px' }} className="mb-3">🌿</div>
            <h3 className="fw-bold mb-2" style={{ fontSize: '24px' }}>Hari Bebas Belanja</h3>
            <p className="opacity-75" style={{ fontSize: '14px' }}>Kamu berhasil mengontrol diri dan tidak mengeluarkan uang pada:</p>
          </div>
          <div className="p-4 rounded-4 w-100 text-center shadow" style={{ backgroundColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
            <div className="opacity-75 mb-2" style={{ fontSize: '12px' }}>TOTAL HARI BEBAS BELANJA</div>
            <h1 className="fw-bold" style={{ fontSize: '42px', color: '#34d399' }}>
              {hariTanpaBelanja} Hari
            </h1>
          </div>
        </div>
      </div>

      {/* Slide 9: Persona Card & Final Share */}
      <div 
        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center position-absolute top-0 start-0 transition-opacity"
        style={{ 
          opacity: activeSlide === 9 ? 1 : 0, 
          pointerEvents: activeSlide === 9 ? 'auto' : 'none', 
          zIndex: 3,
          background: 'linear-gradient(135deg, var(--tblr-primary) 0%, color-mix(in srgb, var(--tblr-primary), black 35%) 100%)',
          transition: 'opacity 0.6s ease-in-out'
        }}
      >
        <div 
          className="container-xl d-flex flex-column align-items-center" 
          style={{ 
            maxWidth: '400px', 
            transform: activeSlide === 9 ? 'translateY(0)' : 'translateY(20px)', 
            transition: 'transform 0.5s ease-out',
            pointerEvents: activeSlide === 9 ? 'auto' : 'none'
          }}
        >
          
          <div className="card rounded-4 text-white overflow-hidden w-100 mb-4 shadow-lg position-relative z-3" style={{ backgroundColor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(12px)' }}>
            <div className="card-body p-4 d-flex flex-column">
              
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2 fw-semibold" style={{ fontSize: '14px' }}>
                  <div 
                    style={{ 
                      width: '18px', 
                      height: '18px', 
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
                <div style={{ fontSize: '11px', opacity: 0.8 }}>{label}</div>
              </div>

              <div className="text-center flex-grow-1 d-flex flex-column justify-content-center align-items-center mb-4 pt-2">
                <div className="mb-3" style={{ fontSize: '56px' }}>{personaEmoji}</div>
                <div style={{ fontSize: '11px', opacity: 0.9 }} className="mb-1">Persona finansialmu</div>
                <h3 className="fw-bold mb-2" style={{ fontSize: '22px' }}>{personaTitle}</h3>
                <p className="mb-2" style={{ fontSize: '13px', opacity: 0.9 }}>
                  {personaDesc}
                </p>
              </div>

              <div className="row g-2 mb-2">
                <div className="col-6">
                  <div className="rounded-3 p-3 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <div className="mb-1" style={{ fontSize: '11px', opacity: 0.9 }}>Saving rate</div>
                    <div className="fw-bold fs-5">{animSavingRate}%</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="rounded-3 p-3 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <div className="mb-1" style={{ fontSize: '11px', opacity: 0.9 }}>Transaksi</div>
                    <div className="fw-bold fs-5">{animTx}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-3 p-3 mb-2" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                <div className="mb-1" style={{ fontSize: '11px', opacity: 0.9 }}>Kategori juara</div>
                <div className="fw-bold" style={{ fontSize: '14px' }}>{kategoriJuara}</div>
              </div>

              <div className="row g-2 mb-4">
                <div className="col-6">
                  <div className="rounded-3 p-3 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <div className="mb-1" style={{ fontSize: '11px', opacity: 0.9 }}>Pemasukan</div>
                    <div className="fw-bold" style={{ fontSize: '14px' }}>+ {animIncome.toLocaleString('id-ID')}</div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="rounded-3 p-3 h-100" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                    <div className="mb-1" style={{ fontSize: '11px', opacity: 0.9 }}>Pengeluaran</div>
                    <div className="fw-bold" style={{ fontSize: '14px' }}>- {animExpense.toLocaleString('id-ID')}</div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-center align-items-center gap-2">
                <div className="bg-surface rounded p-1">
                  <Icon icon="qrcode" size={20} stroke={1.5} style={{ color: 'var(--tblr-primary)' }} />
                </div>
                <span className="badge rounded-pill" style={{ backgroundColor: 'rgba(255,255,255,0.2)', fontSize: '10px', padding: '4px 8px', fontWeight: '500' }}>
                  morapi.localhost
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleShare}
            className="btn bg-surface text-body w-100 rounded-3 py-2 mb-3 fw-bold d-flex justify-content-center align-items-center gap-2 shadow position-relative z-3" 
            style={{ color: 'var(--tblr-primary)', fontSize: '14px' }}
          >
            <Icon icon="upload" size={16} stroke={2} />
            Bagikan Morapi Rewind
          </button>
          
          <button 
            className="btn d-flex justify-content-center align-items-center gap-2 position-relative z-3" 
            style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', border: 'none', background: 'transparent' }}
            onClick={() => {
              setActiveSlide(0)
              setProgress(0)
            }}
          >
            <Icon icon="refresh" size={14} stroke={2} />
            Putar ulang
          </button>
        </div>
      </div>

      {/* Top Controls (Rendered at the bottom to stay on top of all overlays) */}
      <div 
        className="d-flex justify-content-between align-items-center w-100 p-3 position-absolute top-0 start-0 mt-3"
        style={{ zIndex: 10050 }}
      >
        <div />
        <div className="d-flex gap-2 btn-print-hidden">
          <button 
            onClick={onClose} 
            className="btn btn-sm btn-icon rounded-circle d-flex align-items-center justify-content-center" 
            style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: 'white', width: '36px', height: '36px', border: 'none' }}
          >
            <Icon icon="x" size={18} stroke={2.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
