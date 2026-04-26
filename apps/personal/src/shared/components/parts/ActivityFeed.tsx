// src/components/parts/ActivityFeed.tsx
import { Avatar } from '../ui/Avatar'

interface ActivityItem {
  text: string
}

interface Person {
  id?: number | string
  full_name?: string
  photo?: string
  company?: string
}

interface ActivityFeedProps {
  activity?: ActivityItem[]
  people?: Person[]
  limit?: number
}

export function ActivityFeed({ activity = [], people = [], limit = 40 }: ActivityFeedProps) {
  const items = activity.slice(0, limit)

  return (
    <div className="divide-y">
      {items.map((item, index) => {
        const person = people[index + 1] || {}
        const text = item.text
          .replace('%p', person.full_name || '')
          .replace('%c', person.company || '')

        return (
          <div key={index} className="py-3">
            <div className="row align-items-center">
              <div className="col-auto">
                <Avatar person={person} />
              </div>
              <div className="col">
                <div className="text-truncate" dangerouslySetInnerHTML={{ __html: text }} />
                <div className="text-secondary">{index + 1}h ago</div>
              </div>
              {index < 5 && (
                <div className="col-auto align-self-center">
                  <div className="badge bg-primary" />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}