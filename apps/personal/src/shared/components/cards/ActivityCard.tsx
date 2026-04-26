// src/components/cards/ActivityCard.tsx
import { ActivityFeed } from '../parts/ActivityFeed'

interface ActivityItem {
  text: string
}

interface Person {
  id?: number | string
  full_name?: string
  photo?: string
  company?: string
}

interface ActivityCardProps {
  title?: string
  activity?: ActivityItem[]
  people?: Person[]
  limit?: number
  hideHeader?: boolean
}

export function ActivityCard({
  title = 'Recent Activity',
  activity = [],
  people = [],
  limit = 40,
  hideHeader,
}: ActivityCardProps) {
  return (
    <div className={hideHeader ? '' : 'card'}>
      {!hideHeader && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
        </div>
      )}
      <div className="card-body">
        <ActivityFeed activity={activity} people={people} limit={limit} />
      </div>
    </div>
  )
}
