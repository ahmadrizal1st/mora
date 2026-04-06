// src/components/cards/charts/NewClientsCard.tsx
import { Trending } from '../../ui/Trending'
import { Chart } from '../../ui/Chart'
import { DropdownDays } from '../../ui/DropdownDays'

interface NewClientsCardProps {
  value?: string
  trendValue?: number
}

export function NewClientsCard({ value = '6,782', trendValue = 0 }: NewClientsCardProps) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className="subheader">New clients</div>
          <div className="ms-auto lh-1">
            <DropdownDays />
          </div>
        </div>
        <div className="d-flex align-items-baseline">
          <div className="h1 mb-3 me-2">{value}</div>
          <div className="me-auto">
            <Trending value={trendValue} />
          </div>
        </div>
        <Chart
          chartId="new-clients"
          chartData={{
            type: "line",
            sparkline: true,
            datetime: true,
            "stroke-width": [2, 1],
            "stroke-dash": [0, 3],
            series: [
              {
                name: 'May',
                data: [37, 35, 44, 28, 36, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 4, 46, 39, 62, 51, 35, 41, 67],
                color: 'primary'
              },
              {
                name: 'April',
                data: [93, 54, 51, 24, 35, 35, 31, 67, 19, 43, 28, 36, 62, 61, 27, 39, 35, 41, 27, 35, 51, 46, 62, 37, 44, 53, 41, 65, 39, 37],
                color: 'secondary'
              }
            ]
          }}
          height={2.5}
        />
      </div>
    </div>
  )
}