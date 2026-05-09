import React from 'react';
import { Icon, Chart } from '@/shared/components/ui';

const scoreFactors = [
  { label: 'Riwayat Pembayaran', status: 'Excellent',   color: 'success', icon: 'check', weight: 35, progress: 95 },
  { label: 'Utilisasi Kredit',   status: '28% (Baik)',  color: 'success', icon: 'check', weight: 30, progress: 80 },
  { label: 'Usia Kredit',        status: '3.5 tahun',   color: 'warning', icon: 'minus', weight: 15, progress: 55 },
  { label: 'Variasi Kredit',     status: 'Beragam',     color: 'primary', icon: 'minus', weight: 10, progress: 70 },
  { label: 'Permintaan Baru',    status: '0 bulan ini', color: 'success', icon: 'check', weight: 10, progress: 100 },
];

const scoreRanges = [
  { label: 'Sangat Buruk', range: '300–579', color: '#d63939', active: false },
  { label: 'Cukup',        range: '580–669', color: '#f59f00', active: false },
  { label: 'Baik',         range: '670–739', color: '#2fb344', active: false },
  { label: 'Sangat Baik',  range: '740–799', color: '#0054a6', active: true  },
  { label: 'Istimewa',     range: '800–850', color: '#4299e1', active: false },
];

const SCORE = 742;
const SCORE_PCT = (SCORE - 300) / (850 - 300);
const R = 52;
const CIRCUMFERENCE = 2 * Math.PI * R;

export function CreditScoreDeepDive() {
  return (
    <div className="d-flex flex-column gap-3">

      {/* ── Row 1: Gauge │ Factors │ History insight ── */}
      <div className="row g-3">

        {/* Gauge */}
        <div className="col-12 col-md-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header">
              <h3 className="card-title">SLIK / BI Checking</h3>
            </div>
            <div className="card-body d-flex flex-column align-items-center text-center py-4">
              {/* SVG Gauge */}
              <div
                className="position-relative d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: 120, height: 120 }}
              >
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r={R} fill="none"
                    stroke="var(--tblr-border-color)" strokeWidth="10" />
                  <circle cx="60" cy="60" r={R} fill="none"
                    stroke="var(--tblr-success)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${CIRCUMFERENCE * SCORE_PCT} ${CIRCUMFERENCE}`}
                    strokeDashoffset={CIRCUMFERENCE * 0.25}
                  />
                </svg>
                <div className="position-absolute text-center">
                  <div className="h2 fw-bold text-success m-0 lh-1">{SCORE}</div>
                  <div className="text-muted" style={{ fontSize: '11px' }}>/ 850</div>
                </div>
              </div>

              <span className="badge bg-success-lt text-success border-0 px-3 py-2 rounded-pill fw-bold mb-3">
                Sangat Baik
              </span>

              <ul className="list-group list-group-flush w-100">
                {scoreRanges.map((r, i) => (
                  <li key={i}
                    className={`list-group-item d-flex justify-content-between align-items-center px-0 py-1 ${r.active ? 'fw-semibold' : ''}`}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <span className="rounded-circle flex-shrink-0"
                        style={{ width: 7, height: 7, backgroundColor: r.color, display: 'inline-block' }} />
                      <span className={`small ${r.active ? 'text-body' : 'text-muted'}`}>{r.label}</span>
                    </div>
                    <span className="text-muted" style={{ fontSize: '11px' }}>{r.range}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Scoring Factors */}
        <div className="col-12 col-md-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header">
              <h3 className="card-title">Faktor Penilaian Skor</h3>
            </div>
            <div className="card-body d-flex flex-column justify-content-between">
              {scoreFactors.map((f, i) => (
                <div key={i}>
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <span className={`avatar avatar-xs bg-${f.color}-lt text-${f.color} rounded-circle`}>
                        <Icon icon={f.icon} size={11} />
                      </span>
                      <span className="fw-bold small">{f.label}</span>
                      <span className="text-muted" style={{ fontSize: '10px' }}>({f.weight}%)</span>
                    </div>
                    <span className={`badge bg-${f.color}-lt text-${f.color} border-0 rounded-1`}
                      style={{ fontSize: '10px' }}>
                      {f.status}
                    </span>
                  </div>
                  <div className="progress progress-sm">
                    <div className={`progress-bar bg-${f.color}`} style={{ width: `${f.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* History Chart + Insights (combined) */}
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header">
              <h3 className="card-title">Riwayat 6 Bulan</h3>
              <div className="card-actions">
                <span className="badge bg-success-lt text-success border-0">+32 pts ↑</span>
              </div>
            </div>
            <div className="card-body d-flex flex-column gap-3">
              <Chart
                chartId="credit-score-history"
                height={14}
                chartData={{
                  type: 'bar',
                  stacked: false,
                  series: [{ name: 'Skor', color: 'var(--tblr-primary)', data: [710, 718, 725, 729, 734, 742] }],
                  categories: ['Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'],
                  datalabels: false,
                  legend: false,
                  grid: {
                    strokeDashArray: 4,
                    borderColor: 'var(--tblr-border-color)',
                    padding: { top: 0, right: 0, bottom: 0, left: 0 },
                  },
                  xaxis: {
                    tooltip: { enabled: false },
                    axisBorder: { show: false },
                    labels: { style: { colors: 'var(--tblr-secondary)', fontWeight: 500, fontSize: '11px' } },
                  },
                  yaxis: { show: false, min: 700, max: 750 },
                  extend: {
                    plotOptions: { bar: { borderRadius: 4, columnWidth: '45%' } },
                    colors: [({ value }: any) => value >= 740 ? 'var(--tblr-success)' : 'var(--tblr-primary)'],
                    tooltip: { theme: 'dark', y: { formatter: (v: number) => v.toString() } },
                  },
                }}
              />

              <div className="alert alert-success d-flex align-items-start gap-2 mb-0 py-2">
                <Icon icon="trending-up" size={15} className="mt-1 flex-shrink-0" />
                <div>
                  <div className="fw-bold small">Tren Positif</div>
                  <div className="small">Naik <strong>+32 pts</strong>. Utilisasi 42% → 28%.</div>
                </div>
              </div>

              <div className="alert alert-warning d-flex align-items-start gap-2 mb-0 py-2">
                <Icon icon="bulb" size={15} className="mt-1 flex-shrink-0" />
                <div>
                  <div className="fw-bold small">Rekomendasi</div>
                  <div className="small">Jaga utilisasi &lt; 30% untuk capai 800+.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 2: Tips ── */}
      <div className="row g-3">
        {[
          { icon: 'calendar-check', color: 'success', title: 'Bayar Tepat Waktu',    desc: 'Kontribusi 35% terhadap skor Anda.' },
          { icon: 'chart-pie',      color: 'primary', title: 'Jaga Utilisasi < 30%', desc: 'Utilisasi tinggi turunkan skor signifikan.' },
          { icon: 'clock',          color: 'warning', title: 'Pertahankan Akun Lama', desc: 'Usia kredit panjang meningkatkan rata-rata skor.' },
        ].map((tip, i) => (
          <div key={i} className="col-12 col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex gap-3 align-items-start">
                <span className={`avatar avatar-sm bg-${tip.color}-lt text-${tip.color} rounded-2 flex-shrink-0`}>
                  <Icon icon={tip.icon} size={18} />
                </span>
                <div>
                  <div className="fw-bold small mb-1">{tip.title}</div>
                  <div className="text-muted small">{tip.desc}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
