import { Chart } from '@/shared/components/ui/Chart';

export function SubscriptionTrendChart() {
  const chartData = {
    type: 'bar' as const,
    height: 16,
    series: [
      { 
        name: 'Total Pengeluaran', 
        data: [1100000, 1150000, 1250000, 1250000, 1450000, 1450000], 
        color: 'primary' 
      }
    ],
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
    extend: {
      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '45%',
          distributed: false,
        }
      },
      dataLabels: { enabled: false },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.25,
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100]
        },
      },
      tooltip: {
        fixed: { enabled: false },
        x: { show: true },
        y: {
          title: {
            formatter: () => 'Total: '
          }
        },
        marker: { show: false }
      }
    }
  };

  return (
    <div className="card shadow-sm border-0 h-100 overflow-hidden" style={{ borderRadius: '16px' }}>
      <div className="card-body p-4 d-flex flex-column">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h4 className="text-secondary small fw-bold text-uppercase mb-1" style={{ fontSize: '10px', letterSpacing: '0.05em' }}>Spending Trend</h4>
            <div className="d-flex align-items-baseline gap-2">
              <h3 className="fw-bold m-0 text-primary">Rp 1.45jt</h3>
              <span className="badge bg-success-lt border-0 small" style={{ fontSize: '10px' }}>+12%</span>
            </div>
          </div>
          <div className="text-end">
            <div className="text-secondary small fw-medium" style={{ fontSize: '10px' }}>Avg / Mo</div>
            <div className="fw-bold small text-primary">Rp 1.28jt</div>
          </div>
        </div>
        
        <div className="flex-grow-1 mt-auto" style={{ margin: '0 -20px -15px -20px' }}>
          <Chart chartId="subsTrend" chartData={chartData as any} />
        </div>
      </div>
    </div>
  );
}
