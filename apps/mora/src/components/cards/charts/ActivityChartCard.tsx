// src/components/cards/charts/ActivityChartCard.tsx
import { Chart } from '../../ui/Chart'
import { DropdownDays } from '../../ui/DropdownDays'
import chartsData from '../../../data/charts.json'

export function ActivityChartCard() {
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex">
          <h3 className="card-title">Active users</h3>
          <div className="ms-auto">
            <DropdownDays id="active-users-main" label="Select time range for active users" />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <Chart chartId="active-users-2" chartData={(chartsData as any)['active-users-2']} />
          </div>
          <div className="col-md-auto">
            <div className="divide-y divide-y-fill">
              <div className="px-3">
                <div className="text-secondary">
                  <span className="status-dot bg-primary"></span> Mobile
                </div>
                <div className="h2">11,425</div>
              </div>
              <div className="px-3">
                <div className="text-secondary">
                  <span className="status-dot bg-azure"></span> Desktop
                </div>
                <div className="h2">6,458</div>
              </div>
              <div className="px-3">
                <div className="text-secondary">
                  <span className="status-dot bg-green"></span> Tablet
                </div>
                <div className="h2">3,985</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
