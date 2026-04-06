// src/components/cards/SocialTrafficCard.tsx

interface SocialService {
  name: string
  visitors: number
}

interface SocialTrafficCardProps {
  services?: SocialService[]
  maxVisitors?: number
}

const DEFAULT_SERVICES: SocialService[] = [
  { name: 'Instagram', visitors: 3550 },
  { name: 'Twitter', visitors: 1798 },
  { name: 'Facebook', visitors: 1245 },
  { name: 'TikTok', visitors: 986 },
  { name: 'Pinterest', visitors: 854 },
  { name: 'VK', visitors: 650 },
  { name: 'Pinterest', visitors: 420 },
]

export function SocialTrafficCard({
  services = DEFAULT_SERVICES,
  maxVisitors = 5000,
}: SocialTrafficCardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Social Media Traffic</h3>
      </div>
      <table className="table card-table table-vcenter">
        <thead>
          <tr>
            <th>Network</th>
            <th colSpan={2}>Visitors</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service, index) => {
            const widthPercent = (service.visitors / maxVisitors) * 100
            return (
              <tr key={index}>
                <td>{service.name}</td>
                <td>{service.visitors.toLocaleString()}</td>
                <td className="w-50">
                  <div className="progress progress-xs">
                    <div
                      className="progress-bar bg-primary"
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
