// src/components/cards/charts/TotalSalesCard.tsx
import { Icon } from '../../ui/Icon'
import { Chart } from '../../ui/Chart'

export function TotalSalesCard() {
  return (
    <div className="card">
      <div className="card-body">
        <div className="dropdown float-end">
          <a href="#" className="btn-action" data-bs-toggle="dropdown">
            <Icon icon="dots-vertical" />
          </a>
          <div className="dropdown-menu dropdown-menu-end">
            <a href="#" className="dropdown-item">Action</a>
            <a href="#" className="dropdown-item">Another action</a>
          </div>
        </div>
        <h3 className="card-title">Total sales</h3>
        <Chart
          chartId="total-sales-chart"
          chartData={{
            type: "bar",
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            series: [{ name: 'Sales', data: [44, 55, 41, 64, 22, 43, 21, 41, 56, 27, 43, 30] }],
            color: "primary"
          }}
          height={15}
        />
      </div>
    </div>
  )
}