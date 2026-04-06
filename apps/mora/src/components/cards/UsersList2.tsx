// src/components/cards/UsersList2.tsx
import { Avatar } from '../ui/Avatar'

import type { Person } from '../../types'

interface UsersList2Props {
  people: Person[]
  limit?: number
  offset?: number
  title?: string
  className?: string
}

const COLORS = ['green', 'red', 'yellow', 'x', 'x']

export function UsersList2({
  people,
  limit = 10,
  offset = 0,
  title = 'Top users',
  className = '',
}: UsersList2Props) {
  const displayPeople = people.slice(offset, offset + limit)

  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="card-body">
        <div className="row g-3">
          {displayPeople.map((person, index) => {
            const colorIdx = (index + 5) % COLORS.length
            const color = COLORS[colorIdx] === 'x' ? undefined : COLORS[colorIdx]

            return (
              <div key={person.id} className="col-6">
                <div className="row g-3 align-items-center">
                  <a href="#" className="col-auto">
                    <Avatar person={person} status={color} />
                  </a>
                  <div className="col text-truncate">
                    <a href="#" className="text-reset d-block text-truncate">
                      {person.full_name}
                    </a>
                    <div className="text-secondary text-truncate mt-n1">
                      {Math.floor(Math.random() * 6) + 1} days ago
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}