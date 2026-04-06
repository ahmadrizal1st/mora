// src/components/cards/UsersListHeaders.tsx
import { Avatar } from '../ui/Avatar'

import type { Person, Commit } from '../../types'

interface UsersListHeadersProps {
  people: Person[]
  commits?: Commit[]
  title?: string
  className?: string
}

export function UsersListHeaders({
  people,
  commits = [],
  title = 'People',
  className = '',
}: UsersListHeadersProps) {
  const sortedPeople = [...people].sort((a, b) => 
    (a.last_name || '').localeCompare(b.last_name || '')
  )

  let prevLetter = ''

  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="list-group list-group-flush overflow-auto" style={{ maxHeight: '35rem' }}>
        {sortedPeople.map((person, index) => {
          const firstLetter = (person.last_name?.charAt(0) || '').toUpperCase()
          const showHeader = firstLetter !== prevLetter
          prevLetter = firstLetter

          const commit = commits[index]

          return (
            <div key={person.id}>
              {showHeader && (
                <div className="list-group-header sticky-top">{firstLetter}</div>
              )}
              <div className="list-group-item">
                <div className="row align-items-center">
                  <div className="col-auto">
                    <a href="#">
                      <Avatar person={person} />
                    </a>
                  </div>
                  <div className="col text-truncate">
                    <a href="#" className="text-body d-block">
                      {person.full_name}
                    </a>
                    <div className="text-secondary text-truncate mt-n1">
                      {commit?.description || 'No description available'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}