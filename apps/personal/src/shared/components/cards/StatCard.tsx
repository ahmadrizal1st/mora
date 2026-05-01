import { type FC, type ReactNode } from 'react'
import { Avatar } from '@/shared/components/ui/Avatar'

interface StatCardProps {
  title: string
  icon: string
  main: string
  sub: string
  extra?: ReactNode
}

export const StatCard: FC<StatCardProps> = ({ title, icon, main, sub, extra }) => {
  return (
    <div className="card">
      <div className="card-body">
        <div className="row">
          <div className="col mt-0">
            <h5 className="card-title">{title}</h5>
          </div>
          <div className="col-auto">
            <Avatar icon={icon} color="primary-lt" />
          </div>
        </div>
        <div className="mb-1">
          <span className="h3">{main}</span>
          <span className="text-muted"> {sub}</span>
        </div>
        {extra && <div className="mb-0">{extra}</div>}
      </div>
    </div>
  )
}