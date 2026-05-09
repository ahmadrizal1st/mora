import React from 'react';
import { Icon } from '@/shared/components/ui';
import { CreditTypeCards } from '../CreditTypeCards';
import { DebtPayoffPlannerPreview } from '../DebtPayoffPlannerPreview';

const totalDebt = 24_000_000 + 480_000_000; // credit card + kpr outstanding
const totalLimit = 85_000_000;
const monthlyBurden = 1_400_000 + 4_800_000 + 2_100_000 + 1_200_000; // KTA + KPR + CC + PL

const fmt = (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n);

const quickAlerts = [
  { icon: 'alert-triangle', color: 'danger',  text: 'KTA Mandiri jatuh tempo 14 Mei — 3 hari lagi',    action: 'Bayar Sekarang' },
  { icon: 'info-circle',    color: 'warning', text: 'Mastercard Gold utilisasi 56% — di atas batas aman', action: 'Lihat Detail' },
  { icon: 'check',          color: 'success', text: 'Semua 3 provider paylater dalam kondisi aman',        action: null },
];

export function CreditTabOverview() {
  return (
    <>
      {/* Summary Strip */}
      <div className="row g-2 g-lg-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="subheader text-secondary mb-1">Total Hutang</div>
              <div className="h3 fw-bold m-0 text-danger">{fmt(totalDebt)}</div>
              <div className="text-secondary small mt-1">semua jalur kredit</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="subheader text-secondary mb-1">Beban Bulanan</div>
              <div className="h3 fw-bold m-0">{fmt(monthlyBurden)}</div>
              <div className="text-secondary small mt-1">total cicilan/bulan</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="subheader text-secondary mb-1">Jalur Aktif</div>
              <div className="h3 fw-bold m-0">7</div>
              <div className="text-secondary small mt-1">kartu, pinjaman, paylater</div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-3">
              <div className="subheader text-secondary mb-1">DTI Ratio</div>
              <div className="h3 fw-bold m-0 text-success">23%</div>
              <div className="text-secondary small mt-1">
                <span className="badge bg-success-lt text-success border-0 px-2 rounded-1" style={{ fontSize: '10px' }}>Sehat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Alerts */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-header border-0">
          <h3 className="card-title fw-bold">Notifikasi & Peringatan</h3>
          <div className="card-actions">
            <span className="badge bg-blue-lt text-blue border-0">3 item</span>
          </div>
        </div>
        <div className="card-body pt-0">
          <div className="d-flex flex-column gap-3">
            {quickAlerts.map((alert, i) => (
              <div
                key={i}
                className={`d-flex align-items-center gap-3 p-3 rounded-2 bg-${alert.color}-lt`}
              >
                <div className={`avatar avatar-sm bg-${alert.color}-lt text-${alert.color} rounded-circle flex-shrink-0`}
                  style={{ border: `1.5px solid var(--tblr-${alert.color})` }}>
                  <Icon icon={alert.icon} size={14} />
                </div>
                <div className="flex-fill small fw-medium">{alert.text}</div>
                {alert.action && (
                  <button className={`btn btn-sm btn-${alert.color} px-3 flex-shrink-0`}>
                    {alert.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Credit Type Cards */}
      <CreditTypeCards />

      {/* Debt Payoff Planner */}
      <DebtPayoffPlannerPreview />
    </>
  );
}
