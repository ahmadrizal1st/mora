import { Chart } from '@/shared/components/ui/Chart';
import { Icon } from '@/shared/components/ui/Icon';
import { clsx } from 'clsx';

interface CashFlowChartCardProps {
  range: string;
  setRange: (r: string) => void;
  data: {
    lbl: string[];
    inc: number[];
    exp: number[];
  };
}

export function CashFlowChartCard({ range, setRange, data }: CashFlowChartCardProps) {
  const chartData = {
    type: 'bar' as const,
    height: 20,
    series: [
      { name: 'Income', data: data.inc, color: 'primary' },
      { name: 'Expense', data: data.exp, color: 'secondary' }
    ],
    extend: {
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '70%',
          borderRadius: 6,
          borderRadiusApplication: 'around',
          borderRadiusWhenStacked: 'all',
          dataLabels: { position: 'top' }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'vertical',
        shadeIntensity: 0.1,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.8,
        stops: [0, 100]
      }
    },
    grid: {
      show: true,
      borderColor: 'var(--tblr-border-color-light)',
      strokeDashArray: 4,
      padding: { left: 0, right: 0, top: 0, bottom: 0 }
    },
    xaxis: {
      categories: data.lbl,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: 'var(--tblr-secondary)', fontSize: '11px', fontWeight: 500 }
      }
    },
    yaxis: {
      labels: {
        show: false // Keep it clean, use tooltips
      }
    },
    tooltip: {
      theme: 'dark',
      y: {
        formatter: (val: number) => `Rp ${val.toLocaleString('id-ID')}`
      }
    },
    legend: { show: false }
  };

  return (
    <div className="card shadow-sm border-0 h-100 overflow-hidden">
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-2">
            <div className="avatar avatar-xs rounded-circle bg-primary-lt text-primary">
              <Icon icon="arrows-up-down" size="xs" />
            </div>
            <div>
               <span className="text-body fw-bold h3 mb-0 d-block">Cash Flow</span>
               <span className="text-secondary small">Monitoring mutasi saldo harian</span>
            </div>
          </div>
          
          <div className="btn-group shadow-none border rounded-pill p-1 bg-body-tertiary">
            {['W', 'M', '3M', 'Y'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={clsx(
                  'btn btn-sm border-0 rounded-pill px-3',
                  range === r ? 'bg-surface shadow-sm fw-bold text-primary' : 'text-secondary'
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="d-flex gap-4 mb-4">
           <div className="d-flex align-items-center gap-2">
              <span className="badge badge-dot bg-primary"></span>
              <span className="text-secondary small fw-medium">Income</span>
              <span className="text-body fw-bold ms-1">Rp 12.5 jt</span>
           </div>
           <div className="d-flex align-items-center gap-2">
              <span className="badge badge-dot bg-secondary"></span>
              <span className="text-secondary small fw-medium">Expense</span>
              <span className="text-body fw-bold ms-1">Rp 8.2 jt</span>
           </div>
        </div>

        <div className="mx-n3">
          <Chart chartId="cashFlowMain" chartData={chartData as any} />
        </div>
      </div>
    </div>
  );
}
