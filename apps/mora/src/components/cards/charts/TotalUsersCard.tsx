import { Trending } from '../../ui/Trending'
import { Chart } from '../../ui/Chart'

interface TotalUsersCardProps {
  value?: string
  trendValue?: number
  description?: string
}

export function TotalUsersCard({
  value = '75,782',
  trendValue = 2,
  description = '24,635 users increased from last month',
}: TotalUsersCardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="subheader">Total Users</div>
        <div className="d-flex align-items-baseline">
          <div className="h1 mb-0 me-2">{value}</div>
          <div className="me-auto">
            <Trending value={trendValue} />
          </div>
        </div>
        <div className="text-secondary mt-2">{description}</div>
      </div>
      <Chart
        chartId="visitors"
        chartData={{
          type: "line",
          sparkline: true,
          datetime: true,
          "stroke-width": [2, 1],
          "stroke-dash": [0, 3],
          series: [
            {
              name: 'Visitors',
              data: [7687, 7543, 7545, 7543, 7635, 8140, 7810, 8315, 8379, 8441, 8485, 8227, 8906, 8561, 8333, 8551, 9305, 9647, 9359, 9840, 9805, 8612, 8970, 8097, 8070, 9829, 10545, 10754, 10270, 9282],
              color: 'primary'
            },
            {
              name: 'Visitors last month',
              data: [8630, 9389, 8427, 9669, 8736, 8261, 8037, 8922, 9758, 8592, 8976, 9459, 8125, 8528, 8027, 8256, 8670, 9384, 9813, 8425, 8162, 8024, 8897, 9284, 8972, 8776, 8121, 9476, 8281, 9065],
              color: 'secondary'
            }
          ]
        }}
        height={6}
      />
    </div>
  )
}