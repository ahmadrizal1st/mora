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
          <div key={index} className="py-1">
            <div className="row align-items-center g-2">
              <div className="col-auto">
                <Avatar person={person} size="sm" />
              </div>
              <div className="col">
                <div className="text-truncate" style={{ fontSize: '12px', lineHeight: '1.2' }} dangerouslySetInnerHTML={{ __html: text }} />
                <div className="text-secondary mt-1" style={{ fontSize: '10px' }}>{index + 1}h ago</div>
              </div>
              {index < 5 && (
                <div className="col-auto align-self-center pe-2">
                  <div className="badge bg-primary" style={{ width: '6px', height: '6px', minHeight: '6px', padding: 0 }} />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
