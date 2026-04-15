import { Chart } from '../ui/Chart'

export function TrafficSummaryCard() {
  return (
    <div className="card">
      <div className="card-body">
        <h3 className="card-title">Traffic summary</h3>
        <Chart
          chartId="mentions"
          chartData={{
            type: "bar",
            legend: true,
            stacked: true,
            datetime: true,
            "startDate": "2020-06-20",
            "show-x": true,
            series: [
              {
                name: 'Web',
                data: [1, 2, 4, 8, 12, 18, 24, 32, 28, 22, 18, 14, 10, 8, 12, 20, 35, 42, 58, 63, 72, 85, 92, 88, 76, 64, 52, 44, 38, 42, 50, 62, 75, 82, 95, 88, 72],
                color: 'primary'
              },
              {
                name: 'Social',
                data: [2, 5, 8, 12, 15, 12, 10, 8, 12, 15, 18, 22, 25, 28, 32, 35, 38, 42, 45, 48, 52, 55, 58, 62, 65, 68, 72, 75, 78, 82, 85, 88, 92, 95, 98, 95, 92],
                color: 'green'
              },
            ]
          }}
          height={15}
        />
      </div>
    </div>
  )
}
