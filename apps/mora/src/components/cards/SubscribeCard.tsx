// src/components/cards/SubscribeCard.tsx
import { Avatar } from '../ui/Avatar'
import { Icon } from '../ui/Icon'

import type { Person } from '../../types'

interface SubscribeCardProps {
  person?: Person
  onSubscribe?: () => void
}

export function SubscribeCard({ person, onSubscribe }: SubscribeCardProps) {
  if (!person) return null

  return (
    <div className="card">
      <div className="card-body">
        <div className="row g-2 align-items-center">
          <div className="col-auto">
            <Avatar person={person} size="lg" />
          </div>
          <div className="col">
            <h4 className="card-title m-0">
              <a href="#">{person.full_name}</a>
            </h4>
            <div className="text-secondary">Working in {person.company}</div>
            <div className="small mt-1">
              <span className="badge bg-green" /> Online
            </div>
          </div>
          <div className="col-auto">
            <a href="#" className="btn" onClick={onSubscribe}>Subscribe</a>
          </div>
          <div className="col-auto">
            <div className="dropdown">
              <a href="#" className="btn-action" data-bs-toggle="dropdown">
                <Icon icon="dots-vertical" />
              </a>
              <div className="dropdown-menu dropdown-menu-end">
                <a href="#" className="dropdown-item">Action</a>
                <a href="#" className="dropdown-item">Another action</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}