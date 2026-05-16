import { useState, useMemo } from 'react';
import { Icon, Chart } from '@/shared/components/ui';
import { useCredits } from '../../hooks/useCredits';

const fmt = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

export function CreditTabPaylater() {
  const { data: allCredits = [], isLoading } = useCredits();
  
  const providers = useMemo(() => {
    return allCredits.filter(acc => acc.credit?.credit_type === 'paylater');
  }, [allCredits]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  // Derived state: Use selected ID or default to the first provider ID
  const activeProviderId = selectedId ?? providers[0]?.id;

  const activeAccount = useMemo(() => {
    return providers.find(p => p.id === activeProviderId) || providers[0];
  }, [providers, activeProviderId]);

  const totalUsed  = providers.reduce((s, p) => s + (p.credit?.total_amount || 0),  0);
  const totalLimit = providers.reduce((s, p) => s + (p.credit?.limit || 0), 0);

  if (isLoading) {
    return <div className="py-5 text-center text-muted">Memuat data Paylater...</div>;
  }

  if (providers.length === 0) {
    return (
      <div className="card border-0 shadow-sm py-5 text-center">
        <div className="card-body">
          <Icon icon="clock-dollar" size={48} className="mb-3 text-muted opacity-50" />
          <h3 className="fw-bold">Belum Ada Paylater</h3>
          <p className="text-muted">Tambahkan profil Paylater Anda melalui menu "Tambah Profil" di atas.</p>
        </div>
      </div>
    );
  }

  const prov = activeAccount!;
  const credit = prov.credit!;
  const usedPct = credit.limit > 0 ? Math.round((credit.total_amount / credit.limit) * 100) : 0;
  const daysLeft = credit.due_date ? Math.ceil((new Date(credit.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  // Placeholder for history/tx
  const spendHistory = [totalUsed * 0.5, totalUsed * 0.7, totalUsed * 0.6, totalUsed * 0.9, totalUsed * 0.8, totalUsed];
  const transactions: any[] = [];

  return (
    <div>
      {/* Summary strip */}
      <div className="row g-2 g-lg-3 mb-4">
        {[
          { label: 'Total Limit',       value: fmt(totalLimit), sub: `${providers.length} provider` },
          { label: 'Total Dipakai',     value: fmt(totalUsed),  sub: `${Math.round(totalLimit > 0 ? (totalUsed / totalLimit * 100) : 0)}% utilisasi` },
          { label: 'Provider Aktif',    value: String(providers.length), sub: 'Semua aktif' },
          { label: 'Tagihan Berikutnya', value: credit.due_date ? new Date(credit.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-', sub: prov.name },
        ].map((item, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="subheader text-muted mb-1">{item.label}</div>
                <div className="h3 fw-bold m-0">{item.value}</div>
                <div className="text-muted small mt-1">{item.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Provider Selector */}
      <div className="row g-3 mb-4">
        {providers.map(p => {
          const pPct = p.credit!.limit > 0 ? Math.round((p.credit!.total_amount / p.credit!.limit) * 100) : 0;
          return (
            <div key={p.id} className="col-12 col-md-4">
              <button
                className="w-100 text-start border-0 p-0 bg-transparent"
                onClick={() => setSelectedId(p.id)}
              >
                <div className={`card shadow-sm h-100 ${activeProviderId === p.id ? `border border-primary` : 'border-0'}`}>
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span className={`avatar avatar-sm bg-primary-lt text-primary rounded-2`}>
                          <Icon icon="device-mobile" size={16} />
                        </span>
                        <div>
                          <div className="fw-bold small">{p.name}</div>
                          <span className="badge bg-primary-lt text-primary border-0 rounded-1" style={{ fontSize: '10px' }}>Aktif</span>
                        </div>
                      </div>
                    </div>
                    <div className="progress progress-sm mb-1">
                      <div className="progress-bar bg-primary" style={{ width: `${pPct}%` }} />
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted" style={{ fontSize: '11px' }}>{fmt(p.credit!.total_amount)}</span>
                      <span className="text-muted" style={{ fontSize: '11px' }}>{fmt(p.credit!.limit)}</span>
                    </div>
                  </div>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* Detail of selected provider */}
      <div className="row g-3">
        {/* Left: Info */}
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header">
              <div className="d-flex align-items-center gap-3">
                <span className={`avatar avatar-sm bg-primary-lt text-primary rounded-2`}>
                  <Icon icon="device-mobile" size={16} />
                </span>
                <div>
                  <div className="card-title fw-bold mb-0">{prov.name}</div>
                  <span className="badge bg-primary-lt text-primary border-0 rounded-1" style={{ fontSize: '10px' }}>Aktif</span>
                </div>
              </div>
              {daysLeft !== null && (
                <div className="card-actions">
                  <span className="text-muted small">{daysLeft} hari lagi</span>
                </div>
              )}
            </div>

            <div className="card-body">
              <ul className="list-group list-group-flush">
                {[
                  { label: 'Limit',       value: fmt(credit.limit) },
                  { label: 'Dipakai',     value: fmt(credit.total_amount),               cls: credit.total_amount > 0 ? 'text-danger' : '' },
                  { label: 'Sisa limit',  value: fmt(Math.max(0, credit.limit - credit.total_amount)),  cls: 'text-success' },
                  { label: 'Utilisasi',   value: `${usedPct}%` },
                  ...(credit.due_date ? [
                    { label: 'Jatuh tempo',      value: new Date(credit.due_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' }) },
                  ] : []),
                ].map((item, i) => (
                  <li key={i} className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span className="text-muted small">{item.label}</span>
                    <span className={`fw-bold small ${item.cls ?? ''}`}>{item.value}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-3">
                <div className="d-flex justify-content-between mb-1">
                  <span className="text-muted small">{usedPct}% dipakai</span>
                  <span className="text-muted small">{100 - usedPct}% tersedia</span>
                </div>
                <div className="progress progress-sm">
                  <div className={`progress-bar bg-primary`} style={{ width: `${usedPct}%` }} />
                </div>
              </div>

              <div className="mt-3">
                <button className="btn btn-primary w-100 fw-bold">
                  <Icon icon="credit-card" size={16} className="me-2" />
                  Bayar Tagihan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chart + Transactions */}
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm mb-3">
            <div className="card-header">
              <h3 className="card-title">Tren Penggunaan</h3>
              <div className="card-actions">
                <span className="text-muted small">Simulasi — {prov.name}</span>
              </div>
            </div>
            <div className="card-body">
              <Chart
                chartId={`paylater-spend-${prov.id}`}
                height={18}
                chartData={{
                  type: 'bar',
                  stacked: false,
                  series: [{ name: 'Penggunaan', color: `var(--tblr-primary)`, data: spendHistory }],
                  categories: ['Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'],
                  datalabels: false,
                  legend: false,
                  grid: {
                    strokeDashArray: 4,
                    borderColor: 'var(--tblr-border-color)',
                    padding: { top: 10, right: 0, bottom: 0, left: 0 },
                  },
                  xaxis: {
                    tooltip: { enabled: false },
                    axisBorder: { show: false },
                    labels: { style: { colors: 'var(--tblr-secondary)', fontWeight: 500 } },
                  },
                  yaxis: {
                    labels: {
                      style: { colors: 'var(--tblr-secondary)', fontWeight: 500 },
                      formatter: (v: number) => v >= 1_000_000 ? (v / 1_000_000).toFixed(1) + 'jt' : (v / 1000).toFixed(0) + 'rb',
                    },
                  },
                  extend: {
                    plotOptions: { bar: { borderRadius: 4, columnWidth: '40%' } },
                    tooltip: { theme: 'dark', y: { formatter: (v: number) => fmt(v) } },
                  },
                }}
              />
            </div>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header">
              <h3 className="card-title">Transaksi Terbaru</h3>
              <div className="card-actions">
                <button className="btn btn-sm btn-ghost-secondary">Lihat semua</button>
              </div>
            </div>
            {transactions.length === 0 ? (
              <div className="card-body text-center py-5 text-muted">
                <Icon icon="receipt-off" size={32} className="mb-2 opacity-50" />
                <div className="small">Tidak ada transaksi aktif</div>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-vcenter card-table">
                  <tbody>
                    {transactions.map((tx, i) => (
                      <tr key={i}>
                        <td className="w-1">
                          <span className="avatar avatar-sm bg-secondary-lt text-secondary rounded-2">
                            <Icon icon="shopping-cart" size={14} />
                          </span>
                        </td>
                        <td>
                          <div className="fw-bold small">{tx.merchant}</div>
                          <div className="text-muted small">{tx.date}</div>
                        </td>
                        <td className="text-end">
                          <div className="fw-bold small text-danger">-{fmt(tx.amount)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
