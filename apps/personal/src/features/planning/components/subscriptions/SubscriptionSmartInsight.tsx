import { Icon } from '@/shared/components/ui/Icon';

export function SubscriptionSmartInsight() {
  return (
    <div className="card border-0 h-100 overflow-hidden text-white bg-primary shadow-sm" style={{ borderRadius: '16px' }}>
      <div className="card-body p-4 d-flex flex-column h-100 position-relative">
        {/* Large Background Icon */}
        <div 
          className="position-absolute" 
          style={{ 
            top: '-20px', 
            right: '-30px',
            opacity: '0.2',
            zIndex: 0
          }}
        >
          <Icon icon="bulb" size="2xl" className="text-white" style={{ fontSize: '180px', width: '180px', height: '180px' }} />
        </div>

        <div className="flex-grow-1 d-flex flex-column justify-content-center text-center position-relative" style={{ zIndex: 1 }}>
          <div className="p-3 bg-white text-primary rounded-circle d-inline-flex mb-3 mx-auto shadow-sm">
            <Icon icon="bolt" size="md" />
          </div>
          <h3 className="fw-bold mb-2 text-white">Smart Optimization</h3>
          <p className="small mb-4 fw-medium text-white opacity-90 leading-relaxed">
            Anda bisa menghemat hingga <strong>Rp 1.2jt/tahun</strong> dengan menggabungkan paket streaming atau membatalkan layanan yang jarang digunakan.
          </p>
          
          {/* Optimization Progress Tracker */}
          <div className="d-flex justify-content-center gap-2 mb-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-1 bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '24px', height: '24px' }}>
                <Icon icon="check" size="xs" className="text-primary" stroke={3} />
              </div>
            ))}
            <div className="p-1 bg-white rounded-circle d-flex align-items-center justify-content-center border border-white-subtle opacity-50" style={{ width: '24px', height: '24px' }}>
              <span className="text-primary fw-bold" style={{ fontSize: '10px' }}>+2</span>
            </div>
          </div>
          <div className="small fw-bold text-white text-uppercase" style={{ fontSize: '9px', letterSpacing: '0.05em', opacity: '0.8' }}>
            3 recommendations found
          </div>
        </div>

        <div className="mt-4 pt-3 border-top border-white-subtle text-center position-relative" style={{ zIndex: 1 }}>
          <button 
            className="btn btn-white w-100 rounded-pill fw-bold text-primary border-0 shadow-sm" 
            style={{ padding: '12px 24px', fontSize: '13px', letterSpacing: '0.02em' }}
          >
            Lihat Rekomendasi
          </button>
        </div>
      </div>
    </div>
  );
}
