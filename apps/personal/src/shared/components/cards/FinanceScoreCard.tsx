import { Icon } from '@/shared/components/ui/Icon';

export function FinanceScoreCard() {
  return (
    <div className="card shadow-sm border-0 h-100" style={{ background: 'var(--tblr-primary-lt)' }}>
      <div className="card-header border-0 pb-0 pt-4 px-4 bg-transparent">
        <h3 className="card-title fw-bold">Kesehatan Keuangan</h3>
        <div className="card-actions">
          <div className="dropdown">
            <a
              href="#"
              className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
              data-bs-toggle="dropdown"
            >
              <span className="text-decoration-underline-hover">Baik</span>
              <Icon icon="chevron-down" size="xs" />
            </a>
            <div className="dropdown-menu dropdown-menu-end">
              <button className="dropdown-item">Lihat Detail</button>
              <button className="dropdown-item">Pengaturan</button>
            </div>
          </div>
        </div>
      </div>
      <div className="card-body p-4 pt-3">
        <div className="d-flex justify-content-between align-items-end mb-3">
          <div>
            <div className="text-secondary small fw-medium mb-1">Status Keuangan</div>
            <div className="h1 fw-bold mb-0 lh-1 text-primary" style={{ fontSize: '1.8rem' }}>
              Baik
            </div>
          </div>
          <div className="h1 fw-bold mb-0 lh-1 text-primary" style={{ fontSize: '2rem', letterSpacing: '-0.5px' }}>Tinggi</div>
        </div>
        <div className="d-flex gap-2">
          <div className="rounded-1 bg-primary" style={{ height: '12px', flex: '4' }}></div>
          <div className="rounded-1" style={{ height: '12px', flex: '1', background: 'rgba(var(--tblr-primary-rgb), 0.3)' }}></div>
        </div>
      </div>
    </div>
  );
}
