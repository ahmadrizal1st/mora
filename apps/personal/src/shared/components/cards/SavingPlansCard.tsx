export function SavingPlansCard() {
  return (
    <div className="card shadow-sm border-0 h-100">
      <div className="card-header border-0 pb-0 pt-4 px-4">
        <h3 className="card-title fw-bold">Portfolio Targets</h3>
        <div className="card-actions">
          <button className="btn btn-sm btn-ghost-primary rounded-pill">
            + Adjust Targets
          </button>
        </div>
      </div>
      
      <div className="card-body p-4 pt-3 d-flex flex-column">
        <div className="mb-4 mt-1">
          <div className="subheader text-muted mb-1 text-uppercase">Target Assets</div>
          <div className="h1 fw-bold mb-0 lh-1" style={{ fontSize: '2rem', letterSpacing: '-0.5px' }}>$2,000,000</div>
        </div>

        <div className="d-flex flex-column justify-content-between flex-grow-1">
          {/* Plan 1 */}
          <div>
            <div className="fw-bold mb-2">Equities Target</div>
            <div className="d-flex gap-1 mb-2">
               <div className="rounded-pill bg-primary" style={{ height: '6px', flex: '65' }}></div>
               <div className="rounded-pill" style={{ height: '6px', flex: '35', background: 'var(--tblr-primary-lt)' }}></div>
            </div>
            <div className="d-flex justify-content-between text-muted small fw-medium">
              <div>$850,000 / $1,300,000</div>
              <div className="text-dark fw-bold">65%</div>
            </div>
          </div>

          <hr className="my-3 border-light opacity-50" />

          {/* Plan 2 */}
          <div>
            <div className="fw-bold mb-2">Real Estate Target</div>
            <div className="d-flex gap-1 mb-2">
               <div className="rounded-pill" style={{ height: '6px', flex: '71', background: 'var(--tblr-primary)' }}></div>
               <div className="rounded-pill" style={{ height: '6px', flex: '29', background: 'var(--tblr-primary-lt)' }}></div>
            </div>
            <div className="d-flex justify-content-between text-muted small fw-medium">
              <div>$357,000 / $500,000</div>
              <div className="text-dark fw-bold">71%</div>
            </div>
          </div>

          <hr className="my-3 border-light opacity-50" />

          {/* Plan 3 */}
          <div>
            <div className="fw-bold mb-2">Crypto Allocation</div>
            <div className="d-flex gap-1 mb-2">
               <div className="rounded-pill bg-dark" style={{ height: '6px', flex: '45' }}></div>
               <div className="rounded-pill" style={{ height: '6px', flex: '55', background: 'var(--tblr-primary-lt)' }}></div>
            </div>
            <div className="d-flex justify-content-between text-muted small fw-medium">
              <div>$45,000 / $100,000</div>
              <div className="text-dark fw-bold">45%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
