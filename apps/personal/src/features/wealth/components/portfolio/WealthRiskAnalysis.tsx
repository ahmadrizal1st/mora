import { Icon } from '@/shared/components/ui/Icon';
import { MOCK_RISK_PROFILE } from '../../data/mockWealthData';

export function WealthRiskAnalysis() {
  const { score, level, description, allocation } = MOCK_RISK_PROFILE;

  return (
    <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
      <div className="card-header border-bottom-0 pt-4">
        <h3 className="card-title fw-bold">Risk Profile</h3>
        <div className="card-actions">
          <span className="badge bg-primary-lt text-primary fw-bold px-3 rounded-pill">Score: {score}</span>
        </div>
      </div>
      <div className="card-body">
        <div className="text-center mb-4 p-3 rounded-3 bg-body-tertiary">
          <div className="subheader mb-1">CURRENT PROFILE</div>
          <div className="h2 fw-black text-primary mb-2">{level}</div>
          <p className="text-secondary small mb-0 px-2" style={{ lineHeight: '1.4' }}>{description}</p>
        </div>

        <div className="subheader mb-3">ASSET DISTRIBUTION</div>
        <div className="progress progress-lg mb-3 shadow-none" style={{ height: '8px', borderRadius: '100px' }}>
          <div className="progress-bar bg-danger" style={{ width: `${allocation.high}%` }} />
          <div className="progress-bar bg-warning" style={{ width: `${allocation.medium}%` }} />
          <div className="progress-bar bg-success" style={{ width: `${allocation.low}%` }} />
        </div>
        
        <div className="d-flex flex-column gap-2">
          <div className="d-flex align-items-center justify-content-between p-2 rounded-2 hover-bg-light transition-all">
            <div className="d-flex align-items-center gap-2">
              <span className="badge badge-dot bg-danger" />
              <span className="small text-secondary fw-medium">High Risk (Equities)</span>
            </div>
            <span className="fw-bold small">{allocation.high}%</span>
          </div>
          <div className="d-flex align-items-center justify-content-between p-2 rounded-2 hover-bg-light transition-all">
            <div className="d-flex align-items-center gap-2">
              <span className="badge badge-dot bg-warning" />
              <span className="small text-secondary fw-medium">Medium Risk (Mutual Funds)</span>
            </div>
            <span className="fw-bold small">{allocation.medium}%</span>
          </div>
          <div className="d-flex align-items-center justify-content-between p-2 rounded-2 hover-bg-light transition-all">
            <div className="d-flex align-items-center gap-2">
              <span className="badge badge-dot bg-success" />
              <span className="small text-secondary fw-medium">Low Risk (Cash/Bonds)</span>
            </div>
            <span className="fw-bold small">{allocation.low}%</span>
          </div>
        </div>
      </div>
      <div className="card-footer bg-transparent border-0 pt-0 pb-4">
        <div className="d-flex align-items-start gap-2 text-secondary p-3 rounded-3 bg-blue-lt border border-blue-lt">
          <Icon icon="info-circle" size="xs" className="mt-1 flex-shrink-0" />
          <div style={{ fontSize: '11px', lineHeight: '1.4' }}>
            Portfolio Anda cukup agresif. Pertimbangkan menambah instrumen pendapatan tetap untuk stabilitas jangka panjang.
          </div>
        </div>
      </div>
    </div>
  );
}
