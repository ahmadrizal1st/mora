import React, { useState, useMemo } from 'react';
import { Icon } from '@/shared/components/ui';
import { useCredits } from '../hooks/useCredits';

type Strategy = 'avalanche' | 'snowball';

const fmt = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

export function DebtPayoffPlannerPreview() {
  const [strategy, setStrategy] = useState<Strategy>('avalanche');
  const { data: credits = [], isLoading } = useCredits();

  const strategyDebts = useMemo(() => {
    const validDebts = credits.filter(c => c.credit && (c.credit.total_amount || 0) > 0);
    
    if (strategy === 'avalanche') {
      // Bunga tertinggi dulu
      return [...validDebts].sort((a, b) => (b.credit?.interest_rate || 0) - (a.credit?.interest_rate || 0));
    } else {
      // Saldo terkecil dulu
      return [...validDebts].sort((a, b) => (a.credit?.total_amount || 0) - (b.credit?.total_amount || 0));
    }
  }, [credits, strategy]);

  const upcomingBills = useMemo(() => {
    return credits
      .filter(c => c.credit?.due_date)
      .sort((a, b) => new Date(a.credit!.due_date!).getTime() - new Date(b.credit!.due_date!).getTime())
      .slice(0, 5);
  }, [credits]);

  if (isLoading) return null;
  
  if (credits.length === 0) {
    return (
      <div className="card border-0 shadow-sm mb-4 py-5 text-center">
        <div className="card-body">
           <Icon icon="comet" size={32} className="text-muted opacity-50 mb-2" />
           <p className="text-muted mb-0">Belum ada data hutang untuk dianalisis. Tambahkan profil kredit untuk menggunakan Planner.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="row g-2 g-lg-3">
        {/* Strategy Selection */}
        <div className="col-12 col-md-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header">
              <h3 className="card-title">Strategi Pelunasan</h3>
            </div>
            <div className="card-body">
              <p className="text-muted small mb-3">
                Pilih metode terbaik untuk melunasi hutang Anda lebih cepat.
              </p>

              <div className="d-flex flex-column gap-2 mb-3">
                {([
                  { key: 'avalanche', label: 'Metode Avalanche', sub: 'Bayar bunga tertinggi lebih dulu' },
                  { key: 'snowball',  label: 'Metode Snowball',   sub: 'Bayar hutang terkecil lebih dulu' },
                ] as { key: Strategy; label: string; sub: string }[]).map(s => (
                  <button
                    key={s.key}
                    className={`btn text-start d-flex justify-content-between align-items-center ${strategy === s.key ? 'btn-primary' : 'btn-ghost-secondary'}`}
                    onClick={() => setStrategy(s.key)}
                  >
                    <div>
                      <div className="fw-bold">{s.label}</div>
                      <div className={`small ${strategy === s.key ? 'opacity-75' : 'text-muted'}`}>{s.sub}</div>
                    </div>
                    {strategy === s.key && <Icon icon="check" size={18} />}
                  </button>
                ))}
              </div>

              <div className="alert alert-primary mb-0 p-2">
                <div className="d-flex align-items-start gap-2">
                  <Icon icon="info-circle" size={16} className="mt-1 flex-shrink-0" />
                  <div>
                    <div className="fw-bold small">Rekomendasi AI</div>
                    <div className="small">
                      Prioritas: <strong>{strategyDebts[0]?.name || '-'}</strong> ({strategy === 'avalanche' ? 'Bunga tertinggi' : 'Saldo terkecil'}).
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Bills */}
        <div className="col-12 col-md-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header">
              <h3 className="card-title">Tagihan Mendatang</h3>
              <div className="card-actions">
                <span className="badge bg-blue-lt text-blue border-0">Terdekat</span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table table-vcenter card-table table-nowrap">
                <thead>
                  <tr>
                    <th>Jatuh Tempo</th>
                    <th>Akun</th>
                    <th className="text-end">Jumlah</th>
                    <th className="w-1" />
                  </tr>
                </thead>
                <tbody>
                  {upcomingBills.map((b, i) => {
                    const daysLeft = b.credit!.due_date ? Math.ceil((new Date(b.credit!.due_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
                    const isUrgent = daysLeft <= 7;
                    return (
                      <tr key={i}>
                        <td>
                          <div className="fw-bold small">{new Date(b.credit!.due_date!).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</div>
                          <div className={`small ${isUrgent ? 'text-danger' : 'text-muted'}`}>
                            {daysLeft} hari lagi
                          </div>
                        </td>
                        <td>
                          <div className="fw-bold small">{b.name}</div>
                          <div className="text-muted small">{b.provider?.name || 'Bank'}</div>
                        </td>
                        <td className="text-end">
                          <div className="fw-bold small">{fmt(b.credit?.installment_amount || b.credit?.total_amount || 0)}</div>
                        </td>
                        <td>
                          <button className={`btn btn-sm ${isUrgent ? 'btn-danger' : 'btn-ghost-secondary'}`}>
                            {isUrgent ? 'Bayar' : 'Detail'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
