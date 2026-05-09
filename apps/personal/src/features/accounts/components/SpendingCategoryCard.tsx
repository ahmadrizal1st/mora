import React from 'react';
import { Chart } from '@/shared/components/ui/Chart';

interface Category {
  ico: string;
  bg: string;
  n: string;
  pct: number;
  v: string;
  col: string;
}

interface SpendingCategoryCardProps {
  categories: Category[];
}

export function SpendingCategoryCard({ categories }: SpendingCategoryCardProps) {
  const donutChartData = {
    type: 'donut' as const,
    height: 6,
    series: categories.map(c => ({ name: c.n, data: [c.pct], color: c.col })),
    hollowSize: '75%',
    hideTooltip: true,
    legend: false,
    sparkline: true
  };

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-3">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <span className="text-secondary text-uppercase fw-semibold fs-5">Pengeluaran</span>
          <span className="text-secondary small">Mei 2025</span>
        </div>
        
        <div className="row g-2 align-items-center mb-4">
          <div className="col-5">
            <div style={{ height: '100px' }}>
              <Chart chartId="spendingDonut" chartData={donutChartData as any} />
            </div>
          </div>
          <div className="col-7">
            <div className="row g-2">
              {categories.slice(0, 4).map((c, i) => (
                <div key={i} className="col-6">
                  <div className="d-flex align-items-center gap-1">
                    <span className="badge badge-dot" style={{ backgroundColor: c.col, width: '6px', height: '6px' }}></span>
                    <span className="text-secondary text-truncate" style={{ fontSize: '0.65rem' }}>{c.n}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="divide-y">
          {categories.map((c, i) => (
            <div key={i} className="py-2 border-0">
              <div className="d-flex align-items-center justify-content-between mb-1">
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-4">{c.ico}</span>
                  <span className="text-body fw-bold small">{c.n}</span>
                </div>
                <span className="text-body fw-bold font-monospace small">{c.v}</span>
              </div>
              <div className="progress progress-xs" style={{ backgroundColor: 'var(--tblr-border-color)' }}>
                <div className="progress-bar" style={{ width: `${c.pct}%`, backgroundColor: c.col }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
