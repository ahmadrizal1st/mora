// src/pages/ActivityPage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { Avatar } from '../components/ui/Avatar'

import type { Person } from '../types'

interface ActivityItem {
  text: string
  icon?: string
}

interface ActivityPageProps {
  activity: ActivityItem[]
  people: Person[]
}

export default function ActivityPage({ activity = [], people = [] }: ActivityPageProps) {
  // Use same amount as in template snippet or the actual total length
  const limit = 40
  const displayedActivity = activity.slice(0, limit)

  const formatText = (text: string, person: Person) => {
    return text
      .replace(/%p/g, person.full_name || 'Someone')
      .replace(/%c/g, person.company || 'some company')
  }

  // Helper for "time ago" - in a real app, this would use a library or actual dates
  const getTimeAgo = (index: number) => {
    const times = ['4 minutes ago', '12 minutes ago', '34 minutes ago', '2 hours ago', '5 hours ago', 'Yesterday', '2 days ago', '3 days ago']
    return times[index % times.length]
  }

  return (
    <BaseLayout pageTitle="Activity">
      <div className="row row-cards">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <div className="divide-y">
                {displayedActivity.map((item, index) => {
                  const person = people[index % people.length] // Fallback if people list is shorter
                  return (
                    <div key={index} className="py-3">
                      <div className="row">
                        <div className="col-auto">
                          <Avatar person={person} size="md" />
                        </div>
                        <div className="col">
                          <div 
                            className="text-truncate" 
                            dangerouslySetInnerHTML={{ __html: formatText(item.text, person) }} 
                          />
                          <div className="text-secondary">{getTimeAgo(index)}</div>
                        </div>
                        {index < 5 && (
                          <div className="col-auto align-self-center">
                            <div className="badge bg-primary"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
