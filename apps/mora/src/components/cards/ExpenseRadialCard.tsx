import { Chart } from '../ui/Chart';
import { Icon } from '../ui/Icon';

export function ExpenseRadialCard() {
  const customRadialData = {
    type: "radialBar" as const,
    series: [
      {
        name: "Equities",
        color: "orange",
        data: [61.7]
      },
      {
        name: "Real Estate",
        color: "primary",
        data: [25.9]
      },
      {
        name: "Cash & Crypto",
        color: "primary-lt",
        data: [12.4]
      }
    ],
    hollowSize: "25%",
    startAngle: -90,
    endAngle: 270,
    trackMargin: 5,
    lineCap: "round" as const,
    legend: false
  };

  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-header border-0 pb-0 pt-4 px-4">
        <h3 className="card-title fw-bold">Asset Allocation</h3>
        <div className="card-actions">
           <div className="dropdown">
             <a
               href="#"
               className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
               data-bs-toggle="dropdown"
             >
               <span className="text-decoration-underline-hover">By Category</span>
               <Icon icon="chevron-down" size="xs" />
             </a>
             <div className="dropdown-menu dropdown-menu-end">
               <button className="dropdown-item">By Category</button>
               <button className="dropdown-item">By Asset Type</button>
               <button className="dropdown-item">By Risk Level</button>
             </div>
           </div>
        </div>
      </div>

      <div className="card-body p-4 pt-0 d-flex flex-column">
        <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center mb-1">
          <Chart
            chartId="visual-asset-radial"
            chartData={{...customRadialData, height: 18, valueFontSize: '1.5rem'} as any}
          />
        </div>

        <div className="mt-2">
          <div className="subheader text-muted mb-1 text-uppercase">Total Evaluated</div>
          <div className="d-flex align-items-center gap-2 mb-4">
             <span className="h1 fw-bold mb-0 lh-1" style={{ fontSize: '2rem', letterSpacing: '-0.5px' }}>$1,377,000</span>
          </div>

          <div className="d-flex flex-column gap-3">
             <div className="d-flex align-items-center">
                <div className="bg-orange rounded-1 flex-shrink-0 me-3" style={{ width: '12px', height: '12px' }}></div>
                <div className="flex-grow-1">
                  <div className="fw-bold mb-1">Equities</div>
                  <div className="text-muted small">$850,000</div>
                </div>
                <div className="text-orange fw-bold rounded-2 px-2 py-1" style={{ background: 'var(--tblr-orange-lt)' }}>61.7%</div>
             </div>

             <div className="d-flex align-items-center">
                <div className="rounded-1 flex-shrink-0 me-3" style={{ width: '12px', height: '12px', opacity: 0.8, background: 'var(--tblr-primary)' }}></div>
                <div className="flex-grow-1">
                  <div className="fw-bold mb-1">Real Estate</div>
                  <div className="text-muted small">$357,000</div>
                </div>
                <div className="text-primary fw-bold rounded-2 px-2 py-1" style={{ background: 'var(--tblr-primary-lt)' }}>25.9%</div>
             </div>

             <div className="d-flex align-items-center">
                <div className="rounded-1 flex-shrink-0 me-3" style={{ width: '12px', height: '12px', background: 'var(--tblr-primary-lt)' }}></div>
                <div className="flex-grow-1">
                  <div className="fw-bold mb-1">Cash & Crypto</div>
                  <div className="text-muted small">$170,000</div>
                </div>
                <div className="text-primary fw-bold rounded-2 px-2 py-1" style={{ background: 'var(--tblr-primary-lt)' }}>12.4%</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
