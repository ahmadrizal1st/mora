// src/components/cards/DevelopmentActivityCard.tsx
import { Icon } from '../ui/Icon'
import { Avatar } from '../ui/Avatar'
import { Chart } from '../ui/Chart'
import { ChartSparkline } from '../ui/ChartSparkline'

const MOCK_COMMITS: any[] = []
const MOCK_PEOPLE: any[] = []

interface DevelopmentActivityCardProps {
  commits?: typeof MOCK_COMMITS
  people?: typeof MOCK_PEOPLE
}

export function DevelopmentActivityCard({
  commits = MOCK_COMMITS,
  people = MOCK_PEOPLE,
}: DevelopmentActivityCardProps) {
  const displayCommits = commits.slice(0, 5)

  return (
    <div className="card">
      <div className="card-header border-0">
        <div className="card-title">Development activity</div>
      </div>

      <div className="position-relative">
        {/* Overlay: radialBar sparkline + earnings text */}
        <div className="position-absolute top-0 start-0 px-3 mt-1 w-75" style={{ zIndex: 1 }}>
          <div className="row g-2 align-items-center">
            <div className="col-auto">
              <ChartSparkline
                id="activity"
                type="donut"
                percentage={35}
                color="primary"
                height={2.5}
              />
            </div>
            <div className="col">
              <div>Today's Earning: $4,262.40</div>
              <div className="text-secondary">
                <Icon icon="trending-up" color="green" className="icon-inline" />
                {' '}+5% more than yesterday
              </div>
            </div>
          </div>
        </div>

        {/* Area chart — hide-tooltip supaya tidak tampil "Purchases" */}
        <Chart
          chartId="development-activity"
          chartData={{
            type: "area",
            sparkline: true,
            series: [{
              name: 'Commits',
              data: [37, 35, 44, 28, 36, 24, 65, 31, 37, 39, 62, 51, 35, 41, 35, 27, 93, 53, 61, 27, 54, 43, 19, 46, 39, 62]
            }],
            categories: ['Jan', '', '', '', '', '', 'Feb', '', '', '', '', '', 'Mar', '', '', '', '', '', 'Apr', '', '', '', '', '', 'May', '']
          }}
          height={12}
        />
      </div>

      <div className="card-table table-responsive">
        <table className="table table-vcenter">
          <thead>
            <tr>
              <th>User</th>
              <th>Commit</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {displayCommits.map((commit, index) => (
              <tr key={index}>
                <td className="w-1">
                  <Avatar
                    person={people[index % people.length]}
                    size="sm"
                  />
                </td>
                <td className="td-truncate">
                  <div className="text-truncate">{commit.description}</div>
                </td>
                <td className="text-nowrap text-secondary">{commit.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}