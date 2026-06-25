import { useState } from 'react'
import { Icon } from '@/shared/components/ui/Icon'
import { Modal, ModalHeader } from '@/shared/components/ui'

export function SubscriptionSmartInsight() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className="card border-0 h-100 overflow-hidden text-white bg-primary shadow-sm"
      style={{ borderRadius: '16px' }}
    >
      <div className="card-body p-4 d-flex flex-column h-100 position-relative">
        <div
          className="position-absolute"
          style={{
            top: '-20px',
            right: '-30px',
            opacity: '0.2',
            zIndex: 0,
          }}
        >
          <Icon
            icon="bulb"
            size="2xl"
            className="text-white"
            style={{ fontSize: '180px', width: '180px', height: '180px' }}
          />
        </div>

        <div
          className="flex-grow-1 d-flex flex-column justify-content-center text-center position-relative"
          style={{ zIndex: 1 }}
        >
          <div className="p-3 bg-white text-primary rounded-circle d-inline-flex mb-3 mx-auto shadow-sm">
            <Icon icon="bolt" size="md" />
          </div>
          <h3 className="fw-bold mb-2 text-white">Smart Optimization</h3>
          <p className="small mb-4 fw-medium text-white opacity-90 leading-relaxed">
            Anda bisa menghemat hingga <strong>Rp 1.2jt/tahun</strong> dengan menggabungkan paket
            streaming atau membatalkan layanan yang jarang digunakan.
          </p>

          <div className="d-flex justify-content-center gap-2 mb-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-1 bg-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '24px', height: '24px' }}
              >
                <Icon icon="check" size="xs" className="text-primary" stroke={3} />
              </div>
            ))}
            <div
              className="p-1 bg-white rounded-circle d-flex align-items-center justify-content-center border border-white-subtle opacity-50"
              style={{ width: '24px', height: '24px' }}
            >
              <span className="text-primary fw-bold" style={{ fontSize: '10px' }}>
                +2
              </span>
            </div>
          </div>
          <div
            className="small fw-bold text-white text-uppercase"
            style={{ fontSize: '9px', letterSpacing: '0.05em', opacity: '0.8' }}
          >
            3 recommendations found
          </div>
        </div>

        <div
          className="mt-4 pt-3 border-top border-white-subtle text-center position-relative"
          style={{ zIndex: 1 }}
        >
          <button
            className="btn btn-white w-100 rounded-pill fw-bold text-primary border-0 shadow-sm"
            style={{ padding: '12px 24px', fontSize: '13px', letterSpacing: '0.02em' }}
            onClick={() => setIsOpen(true)}
          >
            Lihat Rekomendasi
          </button>
        </div>
      </div>

      <Modal show={isOpen} onClose={() => setIsOpen(false)} size="lg">
        <ModalHeader title="Rekomendasi Smart Optimization" onClose={() => setIsOpen(false)} />
        <div className="modal-body p-4">
          <p className="text-secondary mb-4">
            Berdasarkan analisis riwayat transaksi dan aktivitas Anda, berikut adalah beberapa cara
            untuk mengoptimalkan pengeluaran langganan bulanan Anda:
          </p>
          <div className="d-flex flex-column gap-3 text-body">
            <div className="p-3 bg-body-tertiary rounded-3 border-0 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="p-2 bg-orange-lt text-orange rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '40px', height: '40px' }}
                >
                  <Icon icon="brand-netflix" size="sm" />
                </div>
                <div>
                  <h4 className="fw-bold mb-1">Gabungkan Akun Netflix</h4>
                  <p className="small text-secondary mb-0">
                    Bagikan paket Family dengan anggota keluarga.
                  </p>
                </div>
              </div>
              <div className="text-end">
                <span
                  className="badge bg-success-lt text-success border-0 px-2 py-1 mb-1"
                  style={{ fontSize: '10px' }}
                >
                  Hemat Rp 45.000/bln
                </span>
                <div>
                  <button
                    className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1"
                    style={{ fontSize: '11px' }}
                  >
                    Terapkan
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-body-tertiary rounded-3 border-0 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="p-2 bg-orange-lt text-orange rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '40px', height: '40px' }}
                >
                  <Icon icon="brand-spotify" size="sm" />
                </div>
                <div>
                  <h4 className="fw-bold mb-1">Batalkan Disney+ Hotstar</h4>
                  <p className="small text-secondary mb-0">
                    Tidak terdeteksi pemakaian dalam 90 hari terakhir.
                  </p>
                </div>
              </div>
              <div className="text-end">
                <span
                  className="badge bg-danger-lt text-danger border-0 px-2 py-1 mb-1"
                  style={{ fontSize: '10px' }}
                >
                  Hemat Rp 39.000/bln
                </span>
                <div>
                  <button
                    className="btn btn-outline-danger btn-sm rounded-pill px-3 py-1"
                    style={{ fontSize: '11px' }}
                  >
                    Batalkan
                  </button>
                </div>
              </div>
            </div>

            <div className="p-3 bg-body-tertiary rounded-3 border-0 d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="p-2 bg-orange-lt text-orange rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '40px', height: '40px' }}
                >
                  <Icon icon="bolt" size="sm" />
                </div>
                <div>
                  <h4 className="fw-bold mb-1">Beralih ke Tagihan Tahunan Canva Pro</h4>
                  <p className="small text-secondary mb-0">
                    Bayar tahunan untuk mendapatkan diskon hingga 16%.
                  </p>
                </div>
              </div>
              <div className="text-end">
                <span
                  className="badge bg-success-lt text-success border-0 px-2 py-1 mb-1"
                  style={{ fontSize: '10px' }}
                >
                  Hemat Rp 120.000/thn
                </span>
                <div>
                  <button
                    className="btn btn-outline-primary btn-sm rounded-pill px-3 py-1"
                    style={{ fontSize: '11px' }}
                  >
                    Beralih
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
