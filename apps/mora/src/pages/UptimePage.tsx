import BaseLayout from '../layouts/BaseLayout'
import { Chart } from '../components/ui/Chart'
import type { ChartData } from '../components/ui/Chart'
import { Button } from '../components/ui/Button'

export default function UptimePage() {
  const responseTimeData = [
    145, 165, 160, 155, 135, 145, 160, 180, 205, 195, 200, 185, 190, 195, 200, 185,
    210, 215, 210, 200, 195, 185, 160, 155, 160, 150, 135, 130, 95, 90, 120, 125,
    110, 105, 110, 95, 105, 120, 105, 130, 110, 115, 125, 110, 115, 105, 100, 90,
    60, 75, 75, 95, 90, 70, 65, 70, 80, 100, 95, 115, 110, 105, 115, 115,
  ]

  const responseTimeCategories = responseTimeData.map((_, i) => '\u200B'.repeat(i + 1))
  responseTimeCategories[6] = "Jul '20"
  responseTimeCategories[14] = '15 Jul'
  responseTimeCategories[23] = "Aug '20"
  responseTimeCategories[32] = '15 Aug'
  responseTimeCategories[41] = "Sep '20"
  responseTimeCategories[49] = '15 Sep'
  responseTimeCategories[58] = "Oct '20"

  const uptimeChartData: ChartData = {
    type: 'area',
    height: 15,
    color: 'primary',
    series: [
      {
        name: 'Response time (ms)',
        data: responseTimeData,
      },
    ],
    categories: responseTimeCategories,
    'show-data-labels': false,
    'hide-points': true,
    'y-max': 250,
  }

  const incidentsRawData = [
    1, 2, 6, 3, 1, 1, 2, 5, 2, 5, 6, 2, 4, 3, 4, 5, 4, 3, 2, 1, 2, 0, 2, 1,
  ]

  const uptimeIncidentsData: ChartData = {
    type: 'bar',
    height: 15,
    color: 'danger',
    series: [
      {
        name: 'Incidents',
        data: incidentsRawData,
      },
    ],
    datetime: true,
    'start-date': '2020-06-19',
    'y-max': 20,
    'show-data-labels': false,
  }

  return (
    <BaseLayout noContainer>
      {/* Custom Page Header */}
      <div className="page-header d-print-none mb-4">
        <div className="container-xl">
          <div className="row g-3 align-items-center">
            <div className="col-auto">
              <span className="status-indicator status-green status-indicator-animated">
                <span className="status-indicator-circle"></span>
                <span className="status-indicator-circle"></span>
                <span className="status-indicator-circle"></span>
              </span>
            </div>
            <div className="col">
              <h2 className="page-title m-0">tabler.io/icons</h2>
              <div className="text-secondary mt-1 fs-5">
                <ul className="list-inline list-inline-dots mb-0">
                  <li className="list-inline-item"><span className="text-green fw-bold">Up</span></li>
                  <li className="list-inline-item">Checked every 3 minutes</li>
                </ul>
              </div>
            </div>
            <div className="col-md-auto ms-auto d-print-none">
              <div className="btn-list">
                <Button className="bg-white" icon="settings">
                  Configure
                </Button>
                <Button color="primary" icon="player-pause">
                  Pause this monitor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xl">
        <div className="row row-cards">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <div className="subheader text-uppercase fw-bold mb-1 text-secondary">Currently up for</div>
                <div className="h3 m-0 fw-bold">14 days 2 hours 54 mins 34 seconds</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <div className="subheader text-uppercase fw-bold mb-1 text-secondary">Last checked at</div>
                <div className="h3 m-0 fw-bold">27 seconds ago</div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <div className="subheader text-uppercase fw-bold mb-1 text-secondary">Incidents</div>
                <div className="h3 m-0 fw-bold">3</div>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Response times across regions in the last day</h3>
                <Chart chartId="uptime" chartData={uptimeChartData} height={15} />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <h3 className="card-title">Uptime incidents per day</h3>
                <Chart chartId="uptime-incidents" chartData={uptimeIncidentsData} height={15} />
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="card">
              <div className="card-table table-responsive">
                <table className="table">
                  <thead>
                    <tr className="text-uppercase text-secondary fs-5">
                      <th>Time period</th>
                      <th>Availability</th>
                      <th>Downtime</th>
                      <th>Incidents</th>
                      <th>Longest incident</th>
                      <th>Avg. incident</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-secondary">Today</td>
                      <td>98.9533%</td>
                      <td>1 minute</td>
                      <td>1</td>
                      <td>1 minute</td>
                      <td>1 minute</td>
                    </tr>
                    <tr>
                      <td className="text-secondary">Last 7 days</td>
                      <td>98.9533%</td>
                      <td>1 minute</td>
                      <td>1</td>
                      <td>1 minute</td>
                      <td>1 minute</td>
                    </tr>
                    <tr>
                      <td className="text-secondary">Last 30 days</td>
                      <td>98.9533%</td>
                      <td>1 minute</td>
                      <td>1</td>
                      <td>1 minute</td>
                      <td>1 minute</td>
                    </tr>
                    <tr>
                      <td className="text-secondary">Last 365 days</td>
                      <td>98.9533%</td>
                      <td>1 minute</td>
                      <td>1</td>
                      <td>1 minute</td>
                      <td>1 minute</td>
                    </tr>
                    <tr>
                      <td className="text-secondary">All time</td>
                      <td>98.9533%</td>
                      <td>1 minute</td>
                      <td>1</td>
                      <td>1 minute</td>
                      <td>1 minute</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
