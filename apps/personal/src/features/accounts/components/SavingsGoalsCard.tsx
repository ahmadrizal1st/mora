import React from 'react';

interface Goal {
  ico: string;
  n: string;
  c: number;
  t: number;
  col: string;
}

interface SavingsGoalsCardProps {
  goals: Goal[];
}

export function SavingsGoalsCard({ goals }: SavingsGoalsCardProps) {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-3">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <span className="text-secondary text-uppercase fw-semibold fs-5">Savings Goals</span>
          <a href="#" className="text-primary small fw-medium">+ Tambah</a>
        </div>
        
        <div className="divide-y">
          {goals.map((g, i) => {
            const pct = Math.min(100, Math.round((g.c / g.t) * 100));
            return (
              <div key={i} className="py-2 border-0">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center gap-2">
                    <span className="fs-3">{g.ico}</span>
                    <span className="text-body fw-bold small">{g.n}</span>
                  </div>
                  <span className="fw-bold font-monospace" style={{ color: g.col, fontSize: '0.8rem' }}>{pct}%</span>
                </div>
                <div className="progress progress-xs mb-2">
                  <div className="progress-bar" style={{ width: `${pct}%`, backgroundColor: g.col }}></div>
                </div>
                <div className="d-flex justify-content-between text-secondary" style={{ fontSize: '0.65rem' }}>
                  <span className="font-monospace">{(g.c / 1000000).toFixed(1)}jt</span>
                  <span className="font-monospace text-uppercase">Target {(g.t / 1000000).toFixed(1)}jt</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
