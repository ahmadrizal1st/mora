import { Icon } from '@/shared/components/ui/Icon';

export function SubscriptionMetricStrip() {
  const metrics = [
    { label: 'Layanan Aktif', value: '12', icon: 'apps', color: 'primary' },
    { label: 'Sisa Bulan Ini', value: 'Rp 800rb', icon: 'calendar-due', color: 'primary' },
    { label: 'Potensi Hemat', value: 'Rp 100rb', icon: 'trending-down', color: 'success' },
    { label: 'Trial Berakhir', value: '2', icon: 'hourglass', color: 'primary' }
  ];

  return (
    <>
      {metrics.map((m, i) => (
        <div key={i} className="col-6 col-md-3">
          <div className="card border-0 shadow-sm" style={{ borderRadius: '16px' }}>
            <div className="card-body p-3">
              <div className="d-flex align-items-center gap-3">
                <div className={`p-2 bg-${m.color}-lt rounded-circle text-${m.color} d-flex align-items-center justify-content-center`} style={{ width: '38px', height: '38px' }}>
                  <Icon icon={m.icon as any} size="sm" />
                </div>
                <div>
                  <div className="text-secondary fw-bold text-uppercase" style={{ fontSize: '9px', letterSpacing: '0.05em' }}>{m.label}</div>
                  <div className="h4 fw-bold text-dark mb-0">{m.value}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}