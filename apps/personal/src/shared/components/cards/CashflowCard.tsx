import { Chart } from '../ui/Chart';
import chartsData from '../../data/charts.json';
import { Icon } from '../ui/Icon';

export function CashflowCard() {
  const cashflowData = (chartsData as Record<string, unknown>)['visual-cashflow'] as Record<string, unknown>;
  
  // Create a sparkline-style active growth chart
  const customGrowthData = {
    ...cashflowData,
    type: 'area',
    sparkline: true, // This hides axes, grids, and paddings for edge-to-edge chart
    height: 8,
    strokeWidth: [2],
    series: [
      {
        name: "Growth",
        color: "primary",
        data: [
          // Flat undulation
          10, 12, 11, 12, 15, 12, 11, 10, 14, 18, 14, 16, 12, 14,
          // First spike
          45, 25, 10, 18, 12, 10, 12, 10,
          // Second spike
          25, 60, 30, 25, 22,
          // Continuous steep climbing trend with bumps
          20, 35, 40, 52, 55, 65, 70, 75, 95, 100, 110,
          // Final peak, dip, and highest peak
          105, 95, 88, 105, 130, 145
        ]
      }
    ],
  };

  return (
    <div className="card shadow-sm border-0 h-100 overflow-hidden">
      <div className="card-body p-0 d-flex flex-column h-100">
        
        {/* Top Content Area */}
        <div className="p-4 pb-0">
          <div className="text-secondary mb-3" style={{ fontSize: '1rem' }}>Net Worth Growth</div>
          
          <div className="d-flex align-items-center mb-4">
            {/* Radial Progress Ring */}
            <div className="me-3 d-flex align-items-center justify-content-center">
               <svg width="42" height="42" viewBox="0 0 36 36">
                  {/* Background Track */}
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="var(--tblr-border-color, #e6e8e9)" strokeWidth="3"
                  />
                  {/* Progress Line (e.g., 65%) */}
                  <path
                    strokeDasharray="65, 100"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none" stroke="var(--tblr-primary)" strokeWidth="3" strokeLinecap="round"
                  />
               </svg>
            </div>
            
            {/* Text Information */}
            <div>
              <div className="fw-medium text-dark mb-1">Today's Growth: $4,262.40</div>
              <div className="text-muted small d-flex align-items-center gap-1">
                <span className="text-success fw-bold d-flex align-items-center gap-1">
                   <Icon icon="trend-up" size="xs" /> +5%
                </span>
                more than yesterday
              </div>
            </div>
          </div>
        </div>

        {/* Edge-to-Edge Sparkline Chart */}
        <div className="mt-auto">
          <Chart
            chartId="visual-asset-growth"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            chartData={customGrowthData as any}
          />
        </div>
        
      </div>
    </div>
  );
}
