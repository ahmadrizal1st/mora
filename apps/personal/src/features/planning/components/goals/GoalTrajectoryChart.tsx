import React from 'react';
import { Chart } from '@/shared/components/ui/Chart';

export function GoalTrajectoryChart() {
  const chartData = {
    type: 'line' as const,
    height: 12,
    series: [
      { name: 'Target', data: [20, 40, 60, 80, 100, 120], color: 'secondary' },
      { name: 'Actual', data: [25, 45, 55, 75, 95, 105], color: 'primary' }
    ],
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
    extend: {
      stroke: { width: [2, 4], dashArray: [5, 0] },
      markers: { size: 4 }
    }
  };

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-body p-4 d-flex flex-column h-100">
        <h4 className="fw-bold text-secondary small text-uppercase mb-4">Savings Trajectory</h4>
        <div className="mx-n2 flex-grow-1 d-flex align-items-center">
          <div className="w-100">
            <Chart chartId="goalTrajectory" chartData={{ ...chartData, height: 15 } as any} />
          </div>
        </div>
        <div className="mt-3 text-center small text-secondary pt-3 border-top">
          Estimasi selesai: <span className="fw-bold text-dark">September 2026</span>
        </div>
      </div>
    </div>
  );
}
