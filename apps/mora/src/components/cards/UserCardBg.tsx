// src/components/cards/UserCardBg.tsx
import { Avatar } from '../ui/Avatar'

import type { Person, Photo } from '../../types'

interface UserCardBgProps {
  person?: Person
  photo?: Photo
  blurred?: boolean
}

export function UserCardBg({ person, photo, blurred }: UserCardBgProps) {
  if (!person) return null

  return (
    <a className="card card-link" href="#">
      <div
        className={`card-cover card-cover-blurred text-center${blurred ? ' card-cover-blurred' : ''}`}
        style={photo ? { backgroundImage: `url(/static/photos/${photo.file})` } : undefined}
      >
        <Avatar size="xl" person={person} thumb shape="rounded" />
      </div>
      <div className="card-body text-center">
        <div className="card-title mb-1">{person.full_name}</div>
        <div className="text-secondary">{person.job_title}</div>
      </div>
    </a>
  )
}