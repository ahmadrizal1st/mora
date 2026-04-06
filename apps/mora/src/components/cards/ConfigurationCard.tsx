// src/components/cards/ConfigurationCard.tsx
import { Icon } from '../ui/Icon'
import { Flag } from '../ui/Flag'

interface ConfigurationCardProps {
  date?: string
  account?: string
  flag?: string
  location?: string
  ip?: string
  os?: string
  browser?: string
}

export function ConfigurationCard({
  date = '2020-01-05 16:42:29 UTC',
  account = 'tabler',
  flag = 'pl',
  location = 'Poland',
  ip = '46.113.11.3',
  os = 'OS X 10.15.2 64-bit',
  browser = 'Chrome',
}: ConfigurationCardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Configuration</h3>
        <div className="card-actions">
          <a href="#">
            Edit configuration
            <Icon icon="edit" className="ms-1" />
          </a>
        </div>
      </div>
      <div className="card-body">
        <dl className="row">
          <dt className="col-5">Date:</dt>
          <dd className="col-7">{date}</dd>

          <dt className="col-5">Account:</dt>
          <dd className="col-7">{account}</dd>

          <dt className="col-5">Location:</dt>
          <dd className="col-7">
            <Flag flag={flag} size="xxs" /> {location}
          </dd>

          <dt className="col-5">IP Address:</dt>
          <dd className="col-7">{ip}</dd>

          <dt className="col-5">Operating system:</dt>
          <dd className="col-7">{os}</dd>

          <dt className="col-5">Browser:</dt>
          <dd className="col-7">{browser}</dd>
        </dl>
      </div>
    </div>
  )
}