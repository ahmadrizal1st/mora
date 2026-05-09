import React, { useState } from 'react';
import { Icon } from '@/shared/components/ui';

type Strategy = 'avalanche' | 'snowball';

const bills = [
  { date: '14 Mei', daysLeft: 3, name: 'Personal Loan',  bank: 'Bank Mandiri', amount: 'Rp 1.400.000', urgent: true },
  { date: '20 Mei', daysLeft: 9, name: 'Visa Platinum',  bank: 'Bank BCA',     amount: 'Rp 750.000',   urgent: false },
  { date: '25 Mei', daysLeft: 14, name: 'KPR BTN',       bank: 'Bank BTN',     amount: 'Rp 4.800.000', urgent: false },
];

export function DebtPayoffPlannerPreview() {
  const [strategy, setStrategy] = useState<Strategy>('avalanche');

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

              <div className="alert alert-primary mb-0">
                <div className="d-flex align-items-start gap-2">
                  <Icon icon="info-circle" size={16} className="mt-1 flex-shrink-0" />
                  <div>
                    <div className="fw-bold small">Rekomendasi AI</div>
                    <div className="small">
                      Metode <strong>Avalanche</strong> hemat <strong>Rp 12,4 jt</strong> bunga vs Snowball.
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
                <span className="badge bg-blue-lt text-blue border-0">30 Hari ke Depan</span>
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
                  {bills.map((b, i) => (
                    <tr key={i}>
                      <td>
                        <div className="fw-bold small">{b.date}</div>
                        <div className={`small ${b.urgent ? 'text-danger' : 'text-muted'}`}>
                          {b.daysLeft} hari lagi
                        </div>
                      </td>
                      <td>
                        <div className="fw-bold small">{b.name}</div>
                        <div className="text-muted small">{b.bank}</div>
                      </td>
                      <td className="text-end">
                        <div className="fw-bold small">{b.amount}</div>
                      </td>
                      <td>
                        <button className={`btn btn-sm ${b.urgent ? 'btn-danger' : 'btn-ghost-secondary'}`}>
                          {b.urgent ? 'Bayar' : 'Detail'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
