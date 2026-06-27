import React from 'react'
import { Icon } from '@/shared/components/ui/Icon'

interface Bill {
  ico: string
  name: string
  due: string
  amt: string
  imageUrl?: string
}

interface UpcomingBillsCardProps {
  bills: Bill[]
}

export function UpcomingBillsCard({ bills }: UpcomingBillsCardProps) {
  return (
    <div className="card shadow-sm border-0 flex-grow-1">
      <div className="card-body p-3 d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <span className="text-secondary text-uppercase fw-semibold fs-5">Tagihan Mendatang</span>
          <a href="#" className="text-primary small fw-medium">
            Semua ›
          </a>
        </div>

        <div className="list-group list-group-flush flex-grow-1">
          {bills.length === 0 ? (
            <div className="text-center py-4 flex-grow-1 d-flex flex-column justify-content-center align-items-center">
              <div className="d-flex justify-content-center text-secondary mb-3">
                <Icon icon="calendar-off" size={40} stroke={1.5} opacity={0.6} />
              </div>
              <div className="fw-bold text-body mb-1">Tidak Ada Tagihan</div>
              <div className="text-muted small mb-3">Anda sudah membayar semuanya!</div>
              <button className="btn btn-primary btn-sm d-flex align-items-center gap-2">
                <Icon icon="plus" size={16} stroke={2} />
                Tambah Tagihan
              </button>
            </div>
          ) : (
            bills.map((b, i) => (
              <div key={i} className="list-group-item px-0 border-0 py-2">
                <div className="d-flex align-items-center gap-3">
                  <div>
                    <div 
                      className="avatar avatar-sm rounded bg-body-tertiary text-secondary d-flex align-items-center justify-content-center"
                      style={b.imageUrl ? { backgroundImage: `url(${b.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
                    >
                      {!b.imageUrl && <Icon icon={b.ico} size={20} stroke={1.5} />}
                    </div>
                  </div>
                  <div className="flex-fill min-w-0">
                    <div className="text-body fw-bold text-truncate" style={{ fontSize: '0.85rem' }}>
                      {b.name}
                    </div>
                    <div className="text-secondary small" style={{ fontSize: '0.7rem' }}>
                      {b.due}
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold font-monospace text-body" style={{ fontSize: '0.85rem' }}>
                      {b.amt}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
