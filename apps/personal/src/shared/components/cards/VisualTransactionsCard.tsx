import { Icon } from '../ui/Icon';

export function VisualTransactionsCard() {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-header border-0 pb-0 pt-4 px-4">
        <h3 className="card-title fw-bold">Recent Asset Movements</h3>
        <div className="card-actions d-flex gap-2">
           <div className="dropdown">
             <a
               href="#"
               className="text-secondary small d-flex align-items-center gap-1 text-decoration-none"
               data-bs-toggle="dropdown"
             >
               <span className="text-decoration-underline-hover">This Month</span>
               <Icon icon="chevron-down" size="xs" />
             </a>
             <div className="dropdown-menu dropdown-menu-end">
               <button className="dropdown-item">This Month</button>
               <button className="dropdown-item">Last Month</button>
             </div>
           </div>
           <a
             href="#"
             className="text-secondary small d-flex align-items-center gap-1 text-decoration-none ms-2"
           >
             <span className="text-decoration-underline-hover">Filter</span>
             <Icon icon="adjustments-horizontal" size="xs" />
           </a>
        </div>
      </div>

      <div className="card-body p-4 pt-3 p-0">
        <div className="table-responsive">
          <table className="table table-vcenter table-borderless text-nowrap mb-0">
            <thead>
              <tr className="border-bottom">
                <th className="text-muted small fw-medium">Asset Change <Icon icon="selector" size="xxs" className="ms-1" /></th>
                <th className="text-muted small fw-medium">Category <Icon icon="selector" size="xxs" className="ms-1" /></th>
                <th className="text-muted small fw-medium">Date & Time <Icon icon="selector" size="xxs" className="ms-1" /></th>
                <th className="text-muted small fw-medium">Amount <Icon icon="selector" size="xxs" className="ms-1" /></th>
                <th className="text-muted small fw-medium">Status <Icon icon="selector" size="xxs" className="ms-1" /></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-bottom">
                <td className="py-3">
                  <div className="fw-bold mb-1">Bought AAPL Shares</div>
                  <div className="text-muted small">Equities</div>
                </td>
                <td className="py-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-primary text-white rounded-1 px-1 fw-bold align-items-center justify-content-center d-flex" style={{ fontSize: '0.6rem', width: '32px', height: '20px' }}>EQ</div>
                    <span className="text-muted small">Vanguard Brokerage</span>
                  </div>
                </td>
                <td className="py-3">
                   <div className="fw-medium text-dark mb-1">2024-09-25</div>
                   <div className="text-muted small">10:00</div>
                </td>
                <td className="py-3 text-success fw-bold">+$1,200.00</td>
                <td className="py-3">
                   <span className="badge bg-primary text-white rounded-pill px-2">Settled</span>
                </td>
              </tr>
              
              <tr className="border-bottom">
                <td className="py-3">
                  <div className="fw-bold mb-1">Sold Bitcoin (BTC)</div>
                  <div className="text-muted small">Crypto Assets</div>
                </td>
                <td className="py-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-primary text-white rounded-1 px-1 fw-bold align-items-center justify-content-center d-flex" style={{ fontSize: '0.6rem', width: '32px', height: '20px' }}>CRY</div>
                    <span className="text-muted small">Coinbase Wallet</span>
                  </div>
                </td>
                <td className="py-3">
                   <div className="fw-medium text-dark mb-1">2024-09-24</div>
                   <div className="text-muted small">14:30</div>
                </td>
                <td className="py-3 fw-bold text-danger">-$500.00</td>
                <td className="py-3">
                   <span className="badge bg-primary text-white rounded-pill px-2">Completed</span>
                </td>
              </tr>

              <tr className="border-bottom">
                <td className="py-3">
                  <div className="fw-bold mb-1">Property Downpayment</div>
                  <div className="text-muted small">Real Estate</div>
                </td>
                <td className="py-3">
                  <div className="d-flex align-items-center gap-2">
                     <Icon icon="home" size="md" color="primary" />
                     <span className="text-muted small">Chase Checking</span>
                  </div>
                </td>
                <td className="py-3">
                   <div className="fw-medium text-dark mb-1">2024-09-23</div>
                   <div className="text-muted small">15:00</div>
                </td>
                <td className="py-3 text-success fw-bold">+$50,000.00</td>
                <td className="py-3">
                   <span className="badge bg-primary text-white rounded-pill px-2">Cleared</span>
                </td>
              </tr>

              <tr className="border-bottom">
                <td className="py-3">
                  <div className="fw-bold mb-1">VTI ETF Purchase</div>
                  <div className="text-muted small">Equities</div>
                </td>
                <td className="py-3">
                  <div className="d-flex align-items-center gap-2">
                     <Icon icon="chart-bar" size="md" color="primary" />
                     <span className="text-muted small">Vanguard Brokerage</span>
                  </div>
                </td>
                <td className="py-3">
                   <div className="fw-medium text-dark mb-1">2024-09-22</div>
                   <div className="text-muted small">09:15</div>
                </td>
                <td className="py-3 fw-bold text-success">+$2,400.00</td>
                <td className="py-3">
                   <span className="badge bg-primary text-white rounded-pill px-2">Completed</span>
                </td>
              </tr>

              <tr>
                <td className="py-3">
                  <div className="fw-bold mb-1">Auto-Invest Transfer</div>
                  <div className="text-muted small">Cash</div>
                </td>
                <td className="py-3">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-primary text-white rounded-1 px-1 fw-bold align-items-center justify-content-center d-flex" style={{ fontSize: '0.6rem', width: '32px', height: '20px' }}>BK</div>
                    <span className="text-muted small">Chase Checking</span>
                  </div>
                </td>
                <td className="py-3">
                   <div className="fw-medium text-dark mb-1">2024-09-18</div>
                   <div className="text-muted small">08:00</div>
                </td>
                <td className="py-3 text-danger fw-bold">-$1,000.00</td>
                <td className="py-3">
                   <span className="badge bg-primary-lt text-primary rounded-pill px-2">Pending</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
