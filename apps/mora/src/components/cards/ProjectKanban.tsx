// src/components/cards/ProjectKanban.tsx
import { Avatar } from '../ui/Avatar'
import { Icon } from '../ui/Icon'

import type { Person } from '../../types'

interface ProjectKanbanProps {
  title?: string
  badge?: string
  value?: number
  percentageColor?: string
  due?: string
  limit?: number
  offset?: number
  people?: Person[]
  tasksCompleted?: number
  tasksTotal?: number
}

export function ProjectKanban({
  title = 'Task Title',
  badge,
  value = 20,
  percentageColor = 'green',
  due = '2 days',
  limit = 7,
  offset = 40,
  people = [],
  tasksCompleted = 5,
  tasksTotal = 10,
}: ProjectKanbanProps) {
  const avatars = people.slice(offset, offset + limit)

  return (
    <div className="card">
      <div className="progress progress-sm card-progress">
        <div
          className={`progress-bar bg-${percentageColor}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="card-body">
        <h3 className="card-title">
          <a href="#">{title}</a>
          {badge && <span className="badge ms-2">{badge}</span>}
        </h3>

        {avatars.length > 0 && (
          <div className="avatar-list avatar-list-stacked mb-3">
            {avatars.map((person, i) => (
              <Avatar key={i} person={person} size="sm" />
            ))}
          </div>
        )}

        <div className="card-meta d-flex justify-content-between">
          <div className="d-flex align-items-center">
            <Icon icon="check" className="me-2" />
            <span>{tasksCompleted}/{tasksTotal}</span>
          </div>
          <span>Due {due}</span>
        </div>
      </div>
    </div>
  )
}