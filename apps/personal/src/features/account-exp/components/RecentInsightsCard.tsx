import { Icon } from '@/shared/components/ui/Icon';

export function RecentInsightsCard() {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-3">
        <div className="text-secondary text-uppercase fw-semibold fs-5 mb-4">Recent Insights</div>
        
        <div className="d-flex gap-3 align-items-start mb-4">
          <div className="avatar avatar-sm rounded bg-blue-lt text-blue">
            <Icon icon="bulb" size="sm" />
          </div>
          <div>
            <div className="fw-bold text-dark fs-4 mb-1">Potensi Tabungan</div>
            <div className="text-secondary small lh-sm">
              Kurangi 15% pengeluaran 'Food' untuk hemat Rp 450rb bulan ini.
            </div>
          </div>
        </div>

        <div className="d-flex gap-3 align-items-start mb-4">
          <div className="avatar avatar-sm rounded bg-warning-lt text-warning">
            <Icon icon="alert-triangle" size="sm" />
          </div>
          <div>
            <div className="fw-bold text-dark fs-4 mb-1">Langganan Terdeteksi</div>
            <div className="text-secondary small lh-sm">
              Ada 3 tagihan langganan yang akan ditarik minggu depan.
            </div>
          </div>
        </div>

        <div className="d-flex gap-3 align-items-start">
          <div className="avatar avatar-sm rounded bg-green-lt text-green">
            <Icon icon="shield-check" size="sm" />
          </div>
          <div>
            <div className="fw-bold text-dark fs-4 mb-1">Status Keamanan</div>
            <div className="text-secondary small lh-sm">
              Tidak ada aktivitas mencurigakan pada akun ini.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
