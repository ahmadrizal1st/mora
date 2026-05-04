import React from 'react';
import { MOCK_BUDGET_DATA } from '../../data/mockPlanningData';
import { formatCurrency } from '@/shared/utils/currencyUtils';
import { Icon } from '@/shared/components/ui/Icon';

export function BudgetDetailedTable() {
  const { categories } = MOCK_BUDGET_DATA;

  return (
    <div className="card shadow-sm border-0" style={{ borderRadius: '12px' }}>
      <div className="card-header border-bottom py-3 px-4 bg-white">
        <h3 className="card-title fw-bold m-0 d-flex align-items-center gap-2">
          <Icon icon="table" size="sm" className="text-primary" />
          Detailed Breakdown
        </h3>
      </div>
      <div className="table-responsive">
        <table className="table table-vcenter card-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Allocated</th>
              <th>Spent</th>
              <th>Usage</th>
              <th>Remaining</th>
              <th className="w-1">Status</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const remaining = cat.limit - cat.spent;
              const isOver = remaining < 0;
              const percentage = Math.min(Math.round((cat.spent / cat.limit) * 100), 100);
              
              return (
                <tr key={cat.id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div className="avatar avatar-xs rounded bg-light text-dark shadow-none border">
                        <Icon icon={cat.icon as any} size="xs" />
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{cat.name}</div>
                        <div className="text-muted small text-capitalize">{cat.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-secondary">{formatCurrency(cat.limit)}</td>
                  <td className="fw-bold">{formatCurrency(cat.spent)}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2" style={{ minWidth: '120px' }}>
                      <div className="progress progress-xs flex-fill" style={{ height: '6px' }}>
                        <div 
                          className={`progress-bar bg-${isOver ? 'danger' : 'primary'}`} 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="small fw-bold">{percentage}%</span>
                    </div>
                  </td>
                  <td className={isOver ? 'text-danger fw-bold' : 'text-success fw-medium'}>
                    {formatCurrency(Math.abs(remaining))}
                    {isOver && <span className="ms-1 small">over</span>}
                  </td>
                  <td>
                    <span className={`badge bg-${isOver ? 'danger' : 'success'}-lt text-${isOver ? 'danger' : 'success'} border-0`}>
                      {isOver ? 'Over' : 'Safe'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>
    </div>
  );
}
