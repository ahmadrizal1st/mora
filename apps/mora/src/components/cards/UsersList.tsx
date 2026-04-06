// src/components/cards/UsersList.tsx
import { Avatar } from '../ui/Avatar'

import type { Person, Commit } from '../../types'

interface UsersListProps {
  people: Person[]
  commits?: Commit[]
  limit?: number
  offset?: number
  title?: string
  checkbox?: boolean
  hoverable?: boolean
  checkedIds?: (string | number)[]
  className?: string
}

const COLORS = ['green', 'red', 'yellow', 'x', 'x']

export function UsersList({
  people,
  commits = [],
  limit = 8,
  offset = 0,
  title = 'Last commits',
  checkbox,
  hoverable,
  checkedIds = [],
  className = '',
}: UsersListProps) {
  const displayPeople = people.slice(offset, offset + limit)

  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className={`list-group list-group-flush ${hoverable ? 'list-group-hoverable' : ''}`}>
        {displayPeople.map((person, index) => {
          const colorIdx = (index + 5) % COLORS.length
          const color = COLORS[colorIdx] !== 'x' ? COLORS[colorIdx] : undefined
          const isChecked = checkedIds.includes(person.id) || checkedIds.includes(index + 1)
          const commitIdx = index + offset
          const commit = commits[commitIdx]

          return (
            <div key={person.id} className={`list-group-item ${isChecked ? 'active' : ''}`}>
              <div className="row align-items-center">
                {checkbox ? (
                  <div className="col-auto">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      defaultChecked={isChecked}
                    />
                  </div>
                ) : (
                  <div className="col-auto">
                    <span className={`badge ${color ? `bg-${color}` : ''}`}></span>
                  </div>
                )}
                <div className="col-auto">
                  <a href="#">
                    <Avatar person={person} />
                  </a>
                </div>
                <div className="col text-truncate">
                  <a href="#" className="text-reset d-block">
                    {person.full_name}
                  </a>
                  <div className="d-block text-secondary text-truncate mt-n1">
                    {commit?.description || 'No description available'}
                  </div>
                </div>
                {hoverable && (
                  <div className="col-auto">
                    <a
                      href="#"
                      className={`list-group-item-actions ${isChecked ? 'show' : ''}`}
                    >
                      <i className={`ti ti-star ${isChecked ? 'text-yellow' : 'text-secondary'}`} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}