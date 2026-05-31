import { useMemo } from 'react'
import { Avatar } from '../ui/Avatar'

import type { Person, Commit } from '@/shared/types/common.types'

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
  const sortedPeople = useMemo(() => {
    return [...people].sort((a, b) => (a.last_name || '').localeCompare(b.last_name || ''))
  }, [people])

  const groupedPeople = useMemo(() => {
    const groups: { [key: string]: Person[] } = {}
    sortedPeople.forEach((person) => {
      const firstLetter = (person.last_name?.charAt(0) || '').toUpperCase() || '#'
      if (!groups[firstLetter]) groups[firstLetter] = []
      groups[firstLetter].push(person)
    })
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [sortedPeople])

  return (
    <div className={`card ${className}`}>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>
      <div className="list-group list-group-flush overflow-auto" style={{ maxHeight: '35rem' }}>
        {groupedPeople.map(([letter, group]) => (
          <div key={letter}>
            <div className="list-group-header sticky-top">{letter}</div>
            {group.map((person) => {
              const personIndex = sortedPeople.findIndex((p) => p.id === person.id)
              const commit = commits[personIndex]

              return (
                <div key={person.id} className="list-group-item">
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
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
