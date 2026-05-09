import React from 'react';
import { Icon, Chart } from '@/shared/components/ui';

export function CreditScoreDeepDive() {
  return (
    <div className="mb-4">
      <div className="row g-2 g-lg-3 mb-3">
        {/* Left Column - Score */}
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4 d-flex flex-column align-items-center justify-content-center text-center">
              <div className="subheader mb-3">SLIK / BI Checking</div>
              <div className="display-4 fw-bold mb-2 text-success">742</div>
              <span className="badge bg-success-lt text-success border-0 px-3 py-1 rounded-pill mb-4">Very Good</span>
              
              <div className="w-100 mt-2 px-3">
                <div className="d-flex justify-content-center mb-1">
                  <span className="fw-bold small">Range: 300 - 850</span>
                </div>
                <div className="progress mb-2 progress-sm">
                  <div className="progress-bar bg-danger" style={{ width: '20%' }}></div>
                  <div className="progress-bar bg-warning" style={{ width: '40%' }}></div>
                  <div className="progress-bar bg-success" style={{ width: '25%' }}></div>
                </div>
                <div className="text-secondary small">Your score position</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Factors */}
        <div className="col-12 col-md-8">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h3 className="card-title fw-bold mb-4">Scoring Factors</h3>
              
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center justify-content-between border-bottom pb-3" style={{ borderStyle: 'dashed !important' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar avatar-sm bg-success-lt rounded-circle text-success border border-success">
                      <Icon icon="check" size={14} />
                    </div>
                    <span className="fw-bold small">Payment History</span>
                  </div>
                  <div className="text-end">
                    <div className="text-success small fw-bold mb-1">Excellent</div>
                    <div className="text-secondary" style={{ fontSize: '11px' }}>35% weight</div>
                  </div>
                </div>
                
                <div className="d-flex align-items-center justify-content-between border-bottom pb-3" style={{ borderStyle: 'dashed !important' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar avatar-sm bg-success-lt rounded-circle text-success border border-success">
                      <Icon icon="check" size={14} />
                    </div>
                    <span className="fw-bold small">Credit Utilization</span>
                  </div>
                  <div className="text-end">
                    <div className="text-success small fw-bold mb-1">28% (Good)</div>
                    <div className="text-secondary" style={{ fontSize: '11px' }}>30% weight</div>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between border-bottom pb-3" style={{ borderStyle: 'dashed !important' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar avatar-sm bg-warning-lt rounded-circle text-warning border border-warning">
                      <Icon icon="minus" size={14} />
                    </div>
                    <span className="fw-bold small">Credit Age</span>
                  </div>
                  <div className="text-end">
                    <div className="text-warning small fw-bold mb-1">3.5 years</div>
                    <div className="text-secondary" style={{ fontSize: '11px' }}>15% weight</div>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between border-bottom pb-3" style={{ borderStyle: 'dashed !important' }}>
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar avatar-sm bg-blue-lt rounded-circle text-primary border border-primary">
                      <Icon icon="minus" size={14} />
                    </div>
                    <span className="fw-bold small">Credit Mix</span>
                  </div>
                  <div className="text-end">
                    <div className="text-primary small fw-bold mb-1">Diverse</div>
                    <div className="text-secondary" style={{ fontSize: '11px' }}>10% weight</div>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <div className="avatar avatar-sm bg-success-lt rounded-circle text-success border border-success">
                      <Icon icon="check" size={14} />
                    </div>
                    <span className="fw-bold small">New Inquiry</span>
                  </div>
                  <div className="text-end">
                    <div className="text-success small fw-bold mb-1">0 this month</div>
                    <div className="text-secondary" style={{ fontSize: '11px' }}>10% weight</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h3 className="card-title fw-bold mb-4">6 Month History</h3>
          
          <div className="row align-items-end">
            <div className="col-12 col-md-8">
                <Chart
                  chartId="credit-score-history"
                  height={15}
                  chartData={{
                    type: 'bar',
                    stacked: false,
                    series: [{
                      name: 'Score',
                      color: 'var(--tblr-primary)',
                      data: [710, 718, 725, 729, 734, 742]
                    }],
                    categories: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
                    datalabels: false,
                    legend: false,
                    grid: {
                      strokeDashArray: 4,
                      borderColor: 'var(--tblr-border-color)',
                      padding: { top: 20, right: 0, bottom: 0, left: 0 },
                    },
                    xaxis: {
                      tooltip: { enabled: false },
                      axisBorder: { show: false },
                      labels: {
                        style: { colors: 'var(--tblr-secondary)', fontWeight: 500 },
                      },
                    },
                    yaxis: {
                      show: false,
                      min: 700,
                      max: 750,
                    },
                    extend: {
                      plotOptions: {
                        bar: {
                          borderRadius: 4,
                          columnWidth: '40%',
                        }
                      },
                      colors: [
                        function({ value, seriesIndex, w }: any) {
                          if (value >= 740) {
                            return 'var(--tblr-success)';
                          } else {
                            return 'var(--tblr-primary)';
                          }
                        }
                      ],
                      tooltip: {
                        theme: 'dark',
                        y: {
                          formatter: (val: number) => val.toString(),
                        },
                      },
                    },
                  }}
                />
            </div>
            <div className="col-12 col-md-4 mt-4 mt-md-0">
              <div className="bg-primary-lt p-3 rounded-2 border-start border-primary border-3">
                <div className="small">
                  Score increased <span className="fw-bold text-success">+32 pts</span> in 6 months. Key factor: utilization down from 42% &rarr; 28%.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
