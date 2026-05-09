import React from 'react';
import { Icon } from '@/shared/components/ui';

export function DebtPayoffPlannerPreview() {
  return (
    <div className="mb-5">
      <div className="row g-2 g-lg-3">
        {/* Strategy Selection */}
        <div className="col-12 col-md-5">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <h3 className="card-title fw-bold mb-3">Payoff Strategy</h3>
              <p className="text-secondary small mb-4">
                Choose the best method to clear your debts faster.
              </p>
              
              <div className="d-flex flex-column gap-2 mb-4">
                <button className="btn btn-outline-primary text-start p-3 border-2 shadow-sm d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold">Avalanche Method</div>
                    <div className="small opacity-75">Pay highest interest first</div>
                  </div>
                  <Icon icon="check" size={18} />
                </button>
                <button className="btn btn-ghost-secondary text-start p-3 border-0 d-flex justify-content-between align-items-center">
                  <div>
                    <div className="fw-bold">Snowball Method</div>
                    <div className="small">Pay smallest balance first</div>
                  </div>
                </button>
              </div>

              <div className="bg-primary-lt p-3 rounded-2 border border-primary-subtle">
                <div className="d-flex align-items-center gap-2 text-primary fw-bold small mb-1">
                  <Icon icon="info-circle" size={16} />
                  <span>AI Recommendation</span>
                </div>
                <div className="text-secondary small">
                  Based on your current debt mix, <strong>Avalanche</strong> will save you <strong>Rp 12,4 jt</strong> in interest.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Bills List */}
        <div className="col-12 col-md-7">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between mb-4">
                <h3 className="card-title fw-bold m-0">Upcoming Bills</h3>
                <span className="badge bg-blue-lt">Next 30 days</span>
              </div>

              <div className="table-responsive">
                <table className="table table-vcenter card-table table-nowrap">
                  <thead>
                    <tr>
                      <th className="subheader text-secondary">Due date</th>
                      <th className="subheader text-secondary">Account</th>
                      <th className="subheader text-secondary text-end">Amount</th>
                      <th className="w-1"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="fw-bold small">14 Mei</div>
                        <div className="text-danger small opacity-75">3 days left</div>
                      </td>
                      <td>
                        <div className="fw-bold small">Personal Loan</div>
                        <div className="text-secondary small opacity-75">Bank Mandiri</div>
                      </td>
                      <td className="text-end">
                        <div className="fw-bold small">Rp 1.400.000</div>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-primary px-3">Pay Now</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="fw-bold small">20 Mei</div>
                        <div className="text-secondary small opacity-75">9 days left</div>
                      </td>
                      <td>
                        <div className="fw-bold small">Visa Platinum</div>
                        <div className="text-secondary small opacity-75">Bank BCA</div>
                      </td>
                      <td className="text-end">
                        <div className="fw-bold small">Rp 750.000</div>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-white px-3">Details</button>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <div className="fw-bold small">25 Mei</div>
                        <div className="text-secondary small opacity-75">14 days left</div>
                      </td>
                      <td>
                        <div className="fw-bold small">Mortgage / KPR</div>
                        <div className="text-secondary small opacity-75">Bank BTN</div>
                      </td>
                      <td className="text-end">
                        <div className="fw-bold small">Rp 4.800.000</div>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-white px-3">Details</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
