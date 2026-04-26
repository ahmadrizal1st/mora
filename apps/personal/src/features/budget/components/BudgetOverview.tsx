import React from 'react';
import { Chart, CardTitle, Icon, Trending } from '@/shared/components/ui';
import { type BudgetUtilization } from '../types/budget.types';
import { cn } from '@/shared/utils/cn';

interface BudgetOverviewProps {
  utilization: BudgetUtilization;
  className?: string;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({ utilization, className }) => {
  const totalSpent = utilization.items.reduce((acc, item) => acc + item.spent, 0);
  const totalLimit = utilization.items.reduce((acc, item) => acc + item.limit, 0);
  const totalPercent = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  const chartData = {
    type: 'donut' as const,
    height: 15,
    donutLabel: 'Total Spent',
    donutValue: `Rp ${(totalSpent / 1000).toFixed(0)}k`,
    hollowSize: '80%',
    series: utilization.items.map(item => ({
      name: item.name,
      data: [item.spent || 0.1],
      color: item.color || 'primary'
    })),
  };

  return (
    <div className={cn("card", className)}>
      <div className="card-body">
        <CardTitle title="Analisis Budget" />
        <div className="text-muted small mb-3">{utilization.period_start} - {utilization.period_end}</div>
        
        <div className="row align-items-center mt-4">
          <div className="col-md-5">
            <Chart 
              chartId="budget-donut"
              chartData={chartData}
            />
          </div>
          <div className="col-md-7">
            <div className="mb-4">
              <div className="text-muted small mb-1">Total Konsumsi</div>
              <div className="h1 mb-0 d-flex align-items-center">
                Rp {totalSpent.toLocaleString('id-ID')}
                <Trending 
                  value={Math.round(totalPercent)} 
                  className="ms-2"
                />
              </div>
            </div>

            <div className="space-y-3">
              {utilization.items.map(item => (
                <div key={item.id} className="d-flex align-items-center">
                  <span className={`badge bg-${item.color} badge-dot me-2`}></span>
                  <div className="flex-fill small text-muted">{item.name}</div>
                  <div className="font-weight-bold small">
                    Rp {item.spent.toLocaleString('id-ID')}
                  </div>
                  <div className="ms-2 small text-muted" style={{ minWidth: '40px' }}>
                    ({Math.round((item.spent / (totalSpent || 1)) * 100)}%)
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-top">
              <div className="d-flex align-items-center text-primary">
                <Icon icon="bulb" size="sm" className="me-2" />
                <span className="small font-weight-medium">
                  {totalPercent > 90 
                    ? "Waspada! Pengeluaran Anda hampir mencapai batas." 
                    : "Bagus! Pengeluaran Anda masih terkendali."}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
