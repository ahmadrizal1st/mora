import { Chart, type ChartData } from '@/shared/components/ui/Chart';
import { Icon } from '@/shared/components/ui/Icon';
import { formatCurrency } from '@/shared/utils/currencyUtils';

interface AssetAllocationCardProps {
  data: {
    cash: number;
    investment: number;
    saving: number;
  };
}

export function AssetAllocationCard({ data }: AssetAllocationCardProps) {
  const total = data.cash + data.investment + data.saving;
  const cashPct = total > 0 ? (data.cash / total) * 100 : 0;
  const investPct = total > 0 ? (data.investment / total) * 100 : 0;
  const savingPct = total > 0 ? (data.saving / total) * 100 : 0;

  const customRadialData: ChartData = {
    type: "radialBar",
    series: [
      {
        name: "Investment",
        color: "orange",
        data: [Number(investPct.toFixed(1))]
      },
      {
        name: "Saving",
        color: "primary",
        data: [Number(savingPct.toFixed(1))]
      },
      {
        name: "Cash",
        color: "primary-lt",
        data: [Number(cashPct.toFixed(1))]
      }
    ],
    hollowSize: "25%",
    startAngle: -90,
    endAngle: 270,
    trackMargin: 5,
    lineCap: "round",
    legend: false
  };

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-header border-0 pb-0 pt-4 px-4">
        <h3 className="card-title fw-bold">Asset Allocation</h3>
      </div>

      <div className="card-body p-4 pt-0 d-flex flex-column">
        <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center mb-1">
          <Chart
            chartId="visual-asset-radial"
            chartData={{...customRadialData, height: 18}}
          />
        </div>

        <div className="mt-2">
          <div className="subheader text-muted mb-1 text-uppercase">Total Assets</div>
          <div className="d-flex align-items-center gap-2 mb-4">
             <span className="h1 fw-bold mb-0 lh-1" style={{ fontSize: '2rem', letterSpacing: '-0.5px' }}>{formatCurrency(total)}</span>
          </div>

          <div className="d-flex flex-column gap-3">
             <div className="d-flex align-items-center">
                <div className="bg-orange rounded-1 flex-shrink-0 me-3" style={{ width: '12px', height: '12px' }}></div>
                <div className="flex-grow-1">
                  <div className="fw-bold mb-1">Investment</div>
                  <div className="text-muted small">{formatCurrency(data.investment)}</div>
                </div>
                <div className="text-orange fw-bold rounded-2 px-2 py-1" style={{ background: 'var(--tblr-orange-lt)' }}>{investPct.toFixed(1)}%</div>
             </div>

             <div className="d-flex align-items-center">
                <div className="rounded-1 flex-shrink-0 me-3" style={{ width: '12px', height: '12px', opacity: 0.8, background: 'var(--tblr-primary)' }}></div>
                <div className="flex-grow-1">
                  <div className="fw-bold mb-1">Saving</div>
                  <div className="text-muted small">{formatCurrency(data.saving)}</div>
                </div>
                <div className="text-primary fw-bold rounded-2 px-2 py-1" style={{ background: 'var(--tblr-primary-lt)' }}>{savingPct.toFixed(1)}%</div>
             </div>

             <div className="d-flex align-items-center">
                <div className="rounded-1 flex-shrink-0 me-3" style={{ width: '12px', height: '12px', background: 'var(--tblr-primary-lt)' }}></div>
                <div className="flex-grow-1">
                  <div className="fw-bold mb-1">Cash & Bank</div>
                  <div className="text-muted small">{formatCurrency(data.cash)}</div>
                </div>
                <div className="text-primary fw-bold rounded-2 px-2 py-1" style={{ background: 'var(--tblr-primary-lt)' }}>{cashPct.toFixed(1)}%</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
