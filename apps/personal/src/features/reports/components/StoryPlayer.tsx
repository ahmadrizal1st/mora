import { useState, useEffect, useRef } from 'react'
import { useCountUp } from '@/shared/hooks/useCountUp'

interface StoryPlayerProps {
  label: string
  savingRate: number
  totalTx: number
  income: number
  expense: number
  onClose: () => void
}

const DURATION_PER_SLIDE = 5000 // 5 seconds

export function StoryPlayer({ label, savingRate, totalTx, income, expense, onClose }: StoryPlayerProps) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [progress, setProgress] = useState(0)
  const totalSlides = 2
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

  // Count animations for Slide 2
  const animSavingRate = useCountUp(activeSlide === 1 ? savingRate : 0, 1500, 0, 300)
  const animTx = useCountUp(activeSlide === 1 ? totalTx : 0, 1500, 0, 500)
  const animIncome = useCountUp(activeSlide === 1 ? income : 0, 1500, 0, 700)
  const animExpense = useCountUp(activeSlide === 1 ? expense : 0, 1500, 0, 900)

  return (
    <div 
      className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column" 
      style={{ 
        zIndex: 9999, 
        background: 'linear-gradient(135deg, var(--tblr-primary) 0%, color-mix(in srgb, var(--tblr-primary), black 30%) 100%)',
        color: 'white',
        overflow: 'hidden'
      }}
    >
      {/* Progress Bars */}
      <div className="d-flex w-100 px-2 pt-2 position-absolute top-0 start-0 z-3" style={{ gap: '4px' }}>
        {[0, 1].map(index => (
          <div key={index} className="flex-grow-1 rounded-pill overflow-hidden" style={{ height: '3px', backgroundColor: 'rgba(255,255,255,0.3)' }}>
            <div 
              className="h-100 bg-white rounded-pill" 
              style={{ 
                width: index < activeSlide ? '100%' : index === activeSlide ? `${progress}%` : '0%',
                transition: index === activeSlide ? 'width 50ms linear' : 'none'
              }} 
            />
          </div>
        ))}
      </div>

      {/* Top Controls */}
      <div className="d-flex justify-content-between align-items-center w-100 p-3 position-absolute top-0 start-0 z-3 mt-3">
        <div /> {/* Placeholder for alignment */}
        <div className="d-flex gap-2">
          <button className="btn btn-sm btn-icon rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: 'white', width: '32px', height: '32px', border: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 9l5 -5l5 5" /><path d="M12 4l0 12" /></svg>
          </button>
          <button onClick={onClose} className="btn btn-sm btn-icon rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.2)', color: 'white', width: '32px', height: '32px', border: 'none' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
          </button>
        </div>
      </div>

      {/* Tap Navigation Overlays */}
      <div className="position-absolute top-0 start-0 w-25 h-100 z-2" onClick={handleTapLeft} />
      <div className="position-absolute top-0 end-0 w-75 h-100 z-2" onClick={handleTapRight} />

      {/* Slide 1: Splash */}
      <div 
        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center position-absolute top-0 start-0 transition-opacity"
        style={{ opacity: activeSlide === 0 ? 1 : 0, pointerEvents: activeSlide === 0 ? 'auto' : 'none' }}
      >
        <div className="text-center" style={{ transform: activeSlide === 0 ? 'scale(1)' : 'scale(0.9)', transition: 'transform 0.5s ease-out' }}>
          <div className="mb-4" style={{ fontSize: '80px' }}>🎉</div>
          <div className="mb-2" style={{ fontSize: '13px', opacity: 0.8 }}>{label}</div>
          <h2 className="fw-bold mb-3" style={{ fontSize: '32px' }}>Kilas Balik</h2>
          <p style={{ fontSize: '15px', opacity: 0.9 }}>Sebulan penuh kamu sudah catat. Yuk lihat hasilnya.</p>
        </div>
        
        <div className="position-absolute bottom-0 mb-4 pb-2 text-center" style={{ fontSize: '11px', opacity: 0.6 }}>
          Ketuk untuk lanjut<br/>
          Dibuat dengan PFinTrack v1.14.1 · pfintrack.site
        </div>
      </div>

      {/* Slide 2: Persona Card */}
      <div 
        className="w-100 h-100 d-flex flex-column align-items-center justify-content-center position-absolute top-0 start-0 transition-opacity"
        style={{ opacity: activeSlide === 1 ? 1 : 0, pointerEvents: activeSlide === 1 ? 'auto' : 'none' }}
      >
        <div className="container-xl d-flex flex-column align-items-center" style={{ maxWidth: '400px', transform: activeSlide === 1 ? 'translateY(0)' : 'translateY(20px)', transition: 'transform 0.5s ease-out' }}>
          
          <div className="card rounded-4 border-0 text-white overflow-hidden w-100 mb-4 shadow-lg position-relative z-3" style={{ backgroundColor: '#3f9349' }}>
            <div className="card-body p-4 d-flex flex-column">
              
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div className="d-flex align-items-center gap-2 fw-semibold" style={{ fontSize: '14px' }}>
                  <div className="rounded bg-white bg-opacity-25 d-flex align-items-center justify-content-center" style={{ width: '20px', height: '20px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2" /><path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z" /><path d="M9 14l2 2l4 -4" /></svg>
                  </div>
                  PFinTrack
                </div>
                <div style={{ fontSize: '11px', opacity: 0.8 }}>{label}</div>
              </div>

              <div className="text-center flex-grow-1 d-flex flex-column justify-content-center align-items-center mb-4 pt-2">
                <div className="mb-3" style={{ fontSize: '56px' }}>👑</div>
                <div style={{ fontSize: '11px', opacity: 0.9 }} className="mb-1">Persona finansialmu</div>
                <h3 className="fw-bold mb-2" style={{ fontSize: '22px' }}>Sultan Hemat</h3>
                <p className="mb-2" style={{ fontSize: '13px', opacity: 0.9 }}>Nabung terus, gaya tetap oke. Ini baru sultan.</p>
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
                <div className="fw-bold" style={{ fontSize: '14px' }}>Makanan & Minuman &middot; 41%</div>
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
                <div className="bg-white rounded p-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="var(--tblr-primary)" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M4 14m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M14 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" /><path d="M14 14l3 0" /><path d="M17 14l0 3" /><path d="M20 14l0 3" /><path d="M14 17l3 0" /><path d="M17 17l0 3" /><path d="M20 17l0 3" /></svg>
                </div>
                <span className="badge rounded-pill" style={{ backgroundColor: 'rgba(255,255,255,0.2)', fontSize: '10px', padding: '4px 8px', fontWeight: '500' }}>
                  pfintrack.site
                </span>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-center gap-3 mb-4 position-relative z-3">
            <button className="badge rounded-pill text-white border-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)', fontSize: '11px', padding: '6px 16px' }}>9:16</button>
            <button className="badge rounded-pill text-white border-0" style={{ backgroundColor: 'rgba(255,255,255,0.2)', fontSize: '11px', padding: '6px 16px' }}>1:1</button>
          </div>

          <button className="btn bg-white w-100 rounded-3 py-2 mb-3 fw-bold d-flex justify-content-center align-items-center gap-2 shadow position-relative z-3" style={{ color: 'var(--tblr-primary)', fontSize: '14px' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M7 9l5 -5l5 5" /><path d="M12 4l0 12" /></svg>
            Bagikan kilas balik
          </button>
          
          <button 
            className="btn d-flex justify-content-center align-items-center gap-2 position-relative z-3" 
            style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', border: 'none', background: 'transparent' }}
            onClick={() => {
              setActiveSlide(0)
              setProgress(0)
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" /></svg>
            Putar ulang
          </button>
        </div>
      </div>
    </div>
  )
}
