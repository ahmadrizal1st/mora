// src/components/cards/UserCard.tsx
import { Avatar } from '../ui/Avatar'

import type { Person } from '../../types'

interface UserCardProps {
  person?: Person
  right?: boolean
}

export function UserCard({ person, right }: UserCardProps) {
  if (!person) return null

  const avatarEl = (
    <div className="col-auto">
      <Avatar person={person} className="rounded" />
    </div>
  )

  return (
    <a className="card card-link" href="#">
      <div className="card-body">
        <div className="row">
          {!right && avatarEl}
          <div className="col">
            <div className="fw-medium">{person.full_name}</div>
            <div className="text-secondary">{person.job_title}</div>
          </div>
          {right && avatarEl}
        </div>
      </div>
    </a>
  )
}