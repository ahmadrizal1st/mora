import { Icon } from '../ui/Icon';

export function RecentActivitiesCard() {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-header border-0 pb-0 pt-4 px-4">
        <h3 className="card-title fw-bold">Recent Updates</h3>
        <div className="card-actions">
          <div className="dropdown">
            <a
              href="#"
              className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
              data-bs-toggle="dropdown"
            >
              <span className="text-decoration-underline-hover">Options</span>
              <Icon icon="chevron-down" size="xs" />
            </a>
            <div className="dropdown-menu dropdown-menu-end">
              <button className="dropdown-item">View All</button>
              <button className="dropdown-item">Settings</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card-body p-4 pt-3 d-flex flex-column mb-0">
        <div className="d-flex flex-column justify-content-between flex-grow-1">
          {/* Today */}
          <div>
            <div className="fw-bold mb-3 small text-dark">Today</div>
            
            <div className="d-flex align-items-center mb-3">
               <div className="bg-primary-lt text-primary rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: '32px', height: '32px' }}>
                 <Icon icon="chart-arrows" size="sm" />
               </div>
               <div>
                  <div className="text-muted small fw-medium mb-1" style={{ fontSize: '0.65rem' }}>11:45 AM</div>
                  <div className="fw-medium small">Market value increased by 1.2%</div>
               </div>
            </div>

            <div className="d-flex align-items-center mb-3">
               <div className="bg-primary-lt text-primary rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: '32px', height: '32px' }}>
                 <Icon icon="building-bank" size="sm" />
               </div>
               <div>
                  <div className="text-muted small fw-medium mb-1" style={{ fontSize: '0.65rem' }}>09:22 AM</div>
                  <div className="fw-medium small">Dividend received from Reits</div>
               </div>
            </div>

            <div className="d-flex align-items-center mb-1">
               <div className="bg-primary-lt text-primary rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: '32px', height: '32px' }}>
                 <Icon icon="coin-bitcoin" size="sm" />
               </div>
               <div>
                  <div className="text-muted small fw-medium mb-1" style={{ fontSize: '0.65rem' }}>07:15 AM</div>
                  <div className="fw-medium small">Staking rewards credited</div>
               </div>
            </div>
          </div>

          <div className="my-1"></div>

          {/* Yesterday */}
          <div>
            <div className="fw-bold mb-3 small text-dark">Yesterday</div>
            
            <div className="d-flex align-items-center mb-3">
               <div className="bg-primary-lt text-primary rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: '32px', height: '32px' }}>
                 <Icon icon="home" size="sm" />
               </div>
               <div>
                  <div className="text-muted small fw-medium mb-1" style={{ fontSize: '0.65rem' }}>05:50 PM</div>
                  <div className="fw-medium small">Property valuation appended</div>
               </div>
            </div>

            <div className="d-flex align-items-center mb-0">
               <div className="bg-primary-lt text-primary rounded-circle d-flex align-items-center justify-content-center me-3 flex-shrink-0" style={{ width: '32px', height: '32px' }}>
                 <Icon icon="briefcase" size="sm" />
               </div>
               <div>
                  <div className="text-muted small fw-medium mb-1" style={{ fontSize: '0.65rem' }}>03:30 PM</div>
                  <div className="fw-medium small">Adjusted portfolio balance</div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
