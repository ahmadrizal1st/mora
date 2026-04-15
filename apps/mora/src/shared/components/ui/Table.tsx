import { clsx } from 'clsx'
import { Avatar } from './Avatar'
import { Button } from './Button'
import { DropdownMenu } from './DropdownMenu'
import { getInitials } from '../../utils/tableUtils'

export interface TablePerson {
  id: number | string
  full_name: string
  job_title?: string
  department?: string
  email?: string
  photo?: string
  role?: string
}

export interface TableProps {
  people?: TablePerson[]
  limit?: number
  offset?: number
  mobile?: boolean
  card?: boolean
  striped?: boolean
  stripped?: boolean // Backward compatibility
  nowrap?: boolean
  avatars?: boolean
  buttons?: boolean
  className?: string
  onEdit?: (person: TablePerson) => void
}

export function Table({
  people = [],
  limit = 5,
  offset = 0,
  mobile,
  card,
  striped,
  stripped,
  nowrap,
  avatars,
  buttons,
  className,
  onEdit,
}: TableProps) {
  const visiblePeople = people.slice(offset, offset + limit)
  const isStriped = striped ?? stripped

  const tableClasses = clsx(
    'table',
    'table-vcenter',
    mobile && 'table-mobile-md',
    card && 'card-table',
    isStriped && 'table-striped',
    nowrap && 'table-nowrap',
    className
  )

  return (
    <div className="table-responsive">
      <table className={tableClasses}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Title</th>
            {!avatars && <th>Email</th>}
            <th>Role</th>
            {nowrap && <th />}
            <th className="w-1" />
          </tr>
        </thead>
        <tbody>
          {visiblePeople.map((person) => (
            <tr key={person.id}>
              {avatars ? (
                <td data-label={mobile ? 'Name' : undefined}>
                  <div className="d-flex py-1 align-items-center">
                    <Avatar
                      size="sm"
                      className="me-2"
                      src={person.photo}
                      placeholder={getInitials(person.full_name)}
                    />
                    <div className="flex-fill">
                      <div className="fw-medium">{person.full_name}</div>
                      <div className="text-secondary">
                        <a href="#" className="text-reset">
                          {person.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </td>
              ) : (
                <td data-label={mobile ? 'Name' : undefined}>{person.full_name}</td>
              )}

              {avatars ? (
                <td data-label={mobile ? 'Title' : undefined}>
                  <div>{person.job_title}</div>
                  <div className="text-secondary">{person.department}</div>
                </td>
              ) : (
                <td className="text-secondary" data-label={mobile ? 'Title' : undefined}>
                  {person.job_title}, {person.department}
                </td>
              )}

              {!avatars && (
                <td className="text-secondary" data-label={mobile ? 'Email' : undefined}>
                  <a href="#" className="text-reset">
                    {person.email}
                  </a>
                </td>
              )}

              <td className="text-secondary" data-label={mobile ? 'Role' : undefined}>
                {person.role}
              </td>

              {nowrap && (
                <td>
                  {person.department} - {person.job_title}
                </td>
              )}

              <td>
                {buttons ? (
                  <div className="btn-list flex-nowrap">
                    <Button text="Edit" onClick={() => onEdit?.(person)} />
                    <DropdownMenu right />
                  </div>
                ) : (
                  <a href="#" onClick={(e) => { e.preventDefault(); onEdit?.(person); }}>Edit</a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
