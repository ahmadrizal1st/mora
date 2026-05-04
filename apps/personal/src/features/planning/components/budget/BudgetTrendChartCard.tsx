import { Chart } from '@/shared/components/ui/Chart';

export function BudgetTrendChartCard() {
  const budgetData = Array(30).fill(10);
  const actualData = [
    8.5, 9.2, 11.5, 8.8, 9.5, 6.5, 7.8, 8.2, 10.5, 9.1, 7.5, 6.2, 8.8, 9.4, 7.0,
    7.2, 8.5, 12.0, 9.8, 8.2, 7.5, 6.8, 7.9, 8.4, 11.2, 9.5, 8.8, 7.2, 6.5, 8.0
  ];
  
  const totalBudget = 300;
  const totalActual = Math.round(actualData.reduce((a, b) => a + b, 0));
  const efficiency = Math.round(((totalBudget - totalActual) / totalBudget) * 100);

  const chartData = {
    type: 'area' as const,
    height: 22, // Further increased height
    series: [


      { name: 'Budget', data: budgetData, color: 'primary' },
      { name: 'Actual', data: actualData, color: 'success' }
    ],
    sparkline: false,
    extend: {
      stroke: { width: 2, curve: 'straight' },
      fill: {
        type: 'solid',
        opacity: 0
      },
      xaxis: {
        categories: Array.from({ length: 30 }, (_, i) => `${i + 1} Mei`),
        labels: { 
          show: true,
          style: { fontSize: '8px', fontWeight: 600 },
          rotate: -45,
          offsetY: 5,
          hideOverlappingLabels: true
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },

      yaxis: {
        show: true,
        labels: { 
          style: { fontSize: '9px', fontWeight: 600 },
          formatter: (val: number) => `Rp ${val}jt`
        }
      },
      grid: {
        show: true,
        borderColor: '#f1f4f9',
        strokeDashArray: 4,
        padding: { top: 0, right: 10, left: 0, bottom: 0 }
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        offsetY: -5, // Sits naturally now that icon is gone
        fontSize: '11px',
        fontWeight: 600,
        markers: { radius: 12 }
      },


      markers: {
        size: 0
      }
    }
  };




  return (
    <div className="card shadow-sm border-0 h-100 overflow-hidden" style={{ borderRadius: '16px' }}>
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <h3 className="fw-bold m-0">Budget Trend</h3>
            <p className="text-secondary small m-0">Bulan berjalan (1-30 Mei)</p>
          </div>
        </div>
        
        <div className="flex-fill" style={{ margin: '0 -10px' }}>
          <Chart chartId="budgetTrendMain" chartData={chartData as any} />
        </div>

        <div className="mt-3 pt-3 border-top">
          <div className="row g-2 text-center">
            <div className="col-4">
              <div className="text-muted small fw-bold text-uppercase mb-1" style={{ fontSize: '9px' }}>Total Budget</div>
              <div className="h4 fw-bold mb-0">Rp {totalBudget}jt</div>
            </div>
            <div className="col-4 border-start border-end">
              <div className="text-muted small fw-bold text-uppercase mb-1" style={{ fontSize: '9px' }}>Total Actual</div>
              <div className="h4 fw-bold mb-0 text-success">Rp {totalActual}jt</div>
            </div>
            <div className="col-4">
              <div className="text-muted small fw-bold text-uppercase mb-1" style={{ fontSize: '9px' }}>Efficiency</div>
              <div className="h4 fw-bold mb-0 text-primary">{efficiency}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




