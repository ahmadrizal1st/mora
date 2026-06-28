import { useMemo } from 'react'
import { Icon, Chart } from '@/shared/components/ui'
import { useCreditSummary } from '../hooks/useCreditSummary'

const scoreRanges = [
  { label: 'Sangat Buruk', range: '300–579', color: '#d63939' },
  { label: 'Cukup', range: '580–669', color: '#f59f00' },
  { label: 'Baik', range: '670–739', color: '#2fb344' },
  { label: 'Sangat Baik', range: '740–799', color: '#0054a6' },
  { label: 'Istimewa', range: '800–850', color: '#4299e1' },
]

const R = 52
const CIRCUMFERENCE = 2 * Math.PI * R

export function CreditScoreDeepDive() {
  const summary = useCreditSummary()
  const { isLoading } = summary

  const { score, scoreLabel, scoreColor, factors } = useMemo(() => {
    if (isLoading) return { score: 700, scoreLabel: 'Baik', scoreColor: 'success', factors: [] }

    const util = summary.utilizationPct
    const utilScore = util < 10 ? 250 : util < 30 ? 200 : util < 50 ? 150 : 100

    const varietyScore = summary.activeCount > 5 ? 100 : summary.activeCount > 2 ? 80 : 50

    const finalScore = 300 + utilScore + 180 + 100 + varietyScore + 60
    const limitedScore = Math.min(850, Math.max(300, finalScore))

    const labelObj =
      scoreRanges.find((r) => {
        const [min, max] = r.range.split('–').map(Number)
        return limitedScore >= min && limitedScore <= max
      }) || scoreRanges[2]

    const currentFactors = [
      {
        label: 'Riwayat Pembayaran',
        status: 'Excellent',
        color: 'success',
        icon: 'check',
        weight: 35,
        progress: 95,
      },
      {
        label: 'Utilisasi Kredit',
        status: `${util.toFixed(1)}% (${util < 30 ? 'Baik' : 'Tinggi'})`,
        color: util < 30 ? 'success' : util < 60 ? 'warning' : 'danger',
        icon: util < 30 ? 'check' : 'alert-circle',
        weight: 30,
        progress: Math.max(0, 100 - util),
      },
      {
        label: 'Usia Kredit',
        status: '3.5 tahun',
        color: 'warning',
        icon: 'minus',
        weight: 15,
        progress: 55,
      },
      {
        label: 'Variasi Kredit',
        status: summary.activeCount > 3 ? 'Beragam' : 'Terbatas',
        color: summary.activeCount > 3 ? 'primary' : 'warning',
        icon: 'minus',
        weight: 10,
        progress: summary.activeCount * 20,
      },
      {
        label: 'Permintaan Baru',
        status: '0 bulan ini',
        color: 'success',
        icon: 'check',
        weight: 10,
        progress: 100,
      },
    ]

    return {
      score: limitedScore,
      scoreLabel: labelObj.label,
      scoreColor: labelObj.color,
      factors: currentFactors,
    }
  }, [summary, isLoading])

  const scorePct = (score - 300) / (850 - 300)

  return (
    <div className="d-flex flex-column gap-3">
      <div className="d-flex flex-column flex-md-row gap-3">
        <div className="w-100" style={{ flex: '1 1 25%' }}>
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header">
              <h3 className="card-title">SLIK / BI Checking</h3>
            </div>
            <div className="card-body d-flex flex-column align-items-center text-center py-4">
              <div
                className="position-relative d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: 120, height: 120 }}
              >
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={R}
                    fill="none"
                    stroke="var(--tblr-border-color)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={R}
                    fill="none"
                    stroke={scoreColor}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${CIRCUMFERENCE * scorePct} ${CIRCUMFERENCE}`}
                    strokeDashoffset={CIRCUMFERENCE * 0.25}
                  />
                </svg>
                <div className="position-absolute text-center">
                  <div className="h2 fw-bold m-0 lh-1" style={{ color: scoreColor }}>
                    {score}
                  </div>
                  <div className="text-muted" style={{ fontSize: '11px' }}>
                    / 850
                  </div>
                </div>
              </div>

              <span
                className="badge border-0 px-3 py-2 rounded-pill fw-bold mb-3"
                style={{ backgroundColor: `${scoreColor}20`, color: scoreColor }}
              >
                {scoreLabel}
              </span>

              <ul className="list-group list-group-flush w-100">
                {scoreRanges.map((r, i) => {
                  const [min, max] = r.range.split('–').map(Number)
                  const active = score >= min && score <= max
                  return (
                    <li
                      key={i}
                      className={`list-group-item d-flex justify-content-between align-items-center px-0 py-1 ${active ? 'fw-semibold' : ''}`}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span
                          className="rounded-circle flex-shrink-0"
                          style={{
                            width: 7,
                            height: 7,
                            backgroundColor: r.color,
                            display: 'inline-block',
                          }}
                        />
                        <span className={`small ${active ? 'text-body' : 'text-muted'}`}>
                          {r.label}
                        </span>
                      </div>
                      <span className="text-muted" style={{ fontSize: '11px' }}>
                        {r.range}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="w-100" style={{ flex: '3 1 75%' }}>
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header">
              <h3 className="card-title">Faktor Penilaian Skor</h3>
            </div>
            <div className="card-body d-flex flex-column justify-content-between">
              {factors.map((f, i) => (
                <div key={i}>
                  <div className="d-flex align-items-center justify-content-between mb-1">
                    <div className="d-flex align-items-center gap-2">
                      <span
                        className={`avatar avatar-xs bg-${f.color}-lt text-${f.color} rounded-circle`}
                      >
                        <Icon icon={f.icon} size={11} />
                      </span>
                      <span className="fw-bold small">{f.label}</span>
                      <span className="text-muted" style={{ fontSize: '10px' }}>
                        ({f.weight}%)
                      </span>
                    </div>
                    <span
                      className={`badge bg-${f.color}-lt text-${f.color} border-0 rounded-1`}
                      style={{ fontSize: '10px' }}
                    >
                      {f.status}
                    </span>
                  </div>
                  <div className="progress progress-sm">
                    <div
                      className={`progress-bar bg-${f.color}`}
                      style={{ width: `${f.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header">
              <h3 className="card-title">Analisis AI</h3>
            </div>
            <div className="card-body d-flex flex-column gap-3">
              <Chart
                chartId="credit-score-history"
                height={12}
                chartData={{
                  type: 'bar',
                  stacked: false,
                  series: [
                    {
                      name: 'Skor',
                      color: 'var(--tblr-primary)',
                      data: [score - 40, score - 30, score - 25, score - 15, score - 5, score],
                    },
                  ],
                  categories: ['Des', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei'],
                  datalabels: false,
                  legend: false,
                  grid: {
                    strokeDashArray: 4,
                    borderColor: 'var(--tblr-border-color)',
                    padding: { top: 0, right: 0, bottom: 0, left: 0 },
                  },
                  xaxis: {
                    axisBorder: { show: false },
                    labels: { style: { colors: 'var(--tblr-secondary)', fontSize: '11px' } },
                  },
                  yaxis: { show: false, min: 300, max: 850 },
                  extend: {
                    plotOptions: { bar: { borderRadius: 4, columnWidth: '45%' } },
                    tooltip: { theme: 'dark' },
                  },
                }}
              />

              <div className="alert alert-success d-flex align-items-start gap-2 mb-0 py-2">
                <Icon icon="trending-up" size={15} className="mt-1 flex-shrink-0" />
                <div>
                  <div className="fw-bold small">Status Saat Ini</div>
                  <div className="small">
                    Skor Anda <strong>{score}</strong> dengan utilisasi{' '}
                    <strong>{summary.utilizationPct.toFixed(1)}%</strong>.
                  </div>
                </div>
              </div>

              <div className="alert alert-warning d-flex align-items-start gap-2 mb-0 py-2">
                <Icon icon="bulb" size={15} className="mt-1 flex-shrink-0" />
                <div>
                  <div className="fw-bold small">Rekomendasi</div>
                  <div className="small">
                    {summary.utilizationPct > 30
                      ? 'Turunkan utilisasi di bawah 30% untuk skor 750+.'
                      : 'Jaga konsistensi pembayaran untuk capai 800+.'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-column flex-md-row gap-3">
        {[
          {
            icon: 'calendar-check',
            color: 'success',
            title: 'Bayar Tepat Waktu',
            desc: 'Kontribusi 35% terhadap skor Anda.',
          },
          {
            icon: 'chart-pie',
            color: 'primary',
            title: 'Jaga Utilisasi < 30%',
            desc: 'Utilisasi tinggi turunkan skor signifikan.',
          },
          {
            icon: 'clock',
            color: 'warning',
            title: 'Pertahankan Akun Lama',
            desc: 'Usia kredit panjang meningkatkan rata-rata skor.',
          },
        ].map((tip, i) => (
          <div key={i} className="flex-fill" style={{ minWidth: 0 }}>
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex gap-3 align-items-start">
                <span
                  className={`avatar avatar-sm bg-${tip.color}-lt text-${tip.color} rounded-2 flex-shrink-0`}
                >
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
  )
}
