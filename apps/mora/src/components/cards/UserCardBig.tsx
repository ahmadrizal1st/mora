// src/components/cards/UserCardBig.tsx
import { Avatar } from '../ui/Avatar'

import type { Person } from '../../types'

interface UserCardBigProps {
  person?: Person
}

export function UserCardBig({ person }: UserCardBigProps) {
  if (!person) return null

  return (
    <div className="card">
      <div className="card-body text-center">
        <div className="mb-3">
          <Avatar size="xl" person={person} shape="rounded" />
        </div>
        <div className="card-title mb-1">{person.full_name}</div>
        <div className="text-secondary">{person.job_title}</div>
      </div>
      <a href="#" className="card-btn">View full profile</a>
    </div>
  )
}