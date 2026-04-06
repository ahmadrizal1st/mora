import { useState, useMemo } from 'react'
import { clsx } from 'clsx'
import { Icon } from './Icon'
import { Avatar } from './Avatar'
import { Button } from './Button'
import { Pagination } from './Pagination'
import { Dropdown } from './Dropdown'
import { getInitials } from '../../utils/tableUtils'

export interface AdvancedTableHeader {
  name: string
  dataSort: string
}

export interface AdvancedTablePerson {
  id: number | string
  full_name: string
  city?: string
  country?: string
  status?: 'Active' | 'Inactive' | 'Requested'
  date?: string
  tags?: string[]
  category?: string
  photo?: string
}

export interface AdvancedTableProps {
  id?: string
  title?: string
  description?: string
  headers: AdvancedTableHeader[]
  people: AdvancedTablePerson[]
  defaultPerPage?: number
  perPageOptions?: number[]
  searchPlaceholder?: string
  actionButtonText?: string
  onActionClick?: () => void
  moreOptions?: string[]
  className?: string
}

export function AdvancedTable({
  id = 'advanced-table',
  title,
  description,
  headers = [],
  people = [],
  defaultPerPage = 10,
  perPageOptions = [10, 20, 50, 100],
  searchPlaceholder = 'Search...',
  actionButtonText = 'Action',
  onActionClick,
  moreOptions = ['Action', 'Another action', 'Third action'],
  className,
}: AdvancedTableProps) {
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortAsc, setSortAsc] = useState(true)
  const [perPage, setPerPage] = useState(defaultPerPage)
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Set<number | string>>(new Set())

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    if (!q) return people
    return people.filter((p) =>
      p.full_name.toLowerCase().includes(q) ||
      (p.city ?? '').toLowerCase().includes(q) ||
      (p.category ?? '').toLowerCase().includes(q) ||
      (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
    )
  }, [people, search])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    return [...filtered].sort((a, b) => {
      let va = ''
      let vb = ''
      
      switch (sortKey) {
        case 'sort-name':
          va = a.full_name
          vb = b.full_name
          break
        case 'sort-content':
          va = `${a.city}${a.country}`
          vb = `${b.city}${b.country}`
          break
        case 'sort-status':
          va = a.status ?? ''
          vb = b.status ?? ''
          break
        case 'sort-date':
          va = a.date ?? ''
          vb = b.date ?? ''
          break
        case 'sort-tags':
          va = (a.tags ?? []).join('')
          vb = (b.tags ?? []).join('')
          break
        case 'sort-category':
          va = a.category ?? ''
          vb = b.category ?? ''
          break
      }
      
      return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va)
    })
  }, [filtered, sortKey, sortAsc])

  const totalPages = Math.ceil(sorted.length / perPage)
  const paged = sorted.slice((page - 1) * perPage, page * perPage)

  const handleSort = (key: string) => {
    if (sortKey === key) setSortAsc(!sortAsc)
    else {
      setSortKey(key)
      setSortAsc(true)
    }
    setPage(1)
  }

  const toggleSelect = (personId: number | string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(personId)) next.delete(personId)
      else next.add(personId)
      return next
    })
  }

  const getStatusBadge = (status?: string) => {
    const statusMap: Record<string, string> = {
      Active: 'bg-success-lt',
      Inactive: 'bg-danger-lt',
    }
    const color = status ? statusMap[status] || '' : ''
    return <span className={clsx('badge', color)}>{status || 'Requested'}</span>
  }

  return (
    <div className={clsx('card', className)}>
      <div className="card-table">
        <div className="card-header">
          <div className="row w-full">
            <div className="col">
              {title && <h3 className="card-title mb-0">{title}</h3>}
              {description && <p className="text-secondary m-0">{description}</p>}
            </div>
            <div className="col-md-auto col-sm-12">
              <div className="ms-auto d-flex flex-wrap btn-list">
                <div className="input-group input-group-flat w-auto">
                  <span className="input-group-text">
                    <Icon icon="search" />
                  </span>
                  <input
                    id={`${id}-search`}
                    type="text"
                    className="form-control"
                    placeholder={searchPlaceholder}
                    autoComplete="off"
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  />
                  <span className="input-group-text">
                    <kbd>ctrl + K</kbd>
                  </span>
                </div>
                <Button icon="dots" iconOnly />
                <Dropdown mainBtn="Download" options={moreOptions} />
                <Button color="primary" text={actionButtonText} onClick={onActionClick} />
              </div>
            </div>
          </div>
        </div>

        <div id={id}>
          <div className="table-responsive">
            <table className="table table-vcenter table-selectable">
              <thead>
                <tr>
                  <th className="w-1" />
                  {headers.map((h) => (
                    <th key={h.dataSort}>
                      <button
                        className="table-sort d-flex justify-content-between"
                        onClick={() => handleSort(h.dataSort)}
                      >
                        {h.name}
                        {sortKey === h.dataSort && (
                          <Icon icon={sortAsc ? 'chevron-up' : 'chevron-down'} size="sm" />
                        )}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="table-tbody">
                {paged.map((person) => {
                  const isSelected = selected.has(person.id)
                  return (
                    <tr key={person.id}>
                      <td>
                        <input
                          className="form-check-input m-0 align-middle"
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(person.id)}
                        />
                      </td>
                      <td className="sort-name">
                        <Avatar
                          size="xs"
                          className="me-2"
                          src={person.photo}
                          placeholder={getInitials(person.full_name)}
                        />
                        {person.full_name}
                      </td>
                      <td className="sort-content">
                        {person.city}, {person.country}
                      </td>
                      <td className="sort-status">{getStatusBadge(person.status)}</td>
                      <td className="sort-date">{person.date}</td>
                      <td className="sort-tags">
                        <div className="badges-list">
                          {(person.tags ?? []).map((tag, ti) => (
                            <span key={ti} className="badge">{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="sort-category py-0">
                        {isSelected ? (
                          <div className="d-flex justify-content-end">
                            <Button icon="dots" iconOnly />
                          </div>
                        ) : (
                          <span>{person.category}</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="card-footer d-flex align-items-center">
            <div className="dropdown">
              <button className="btn dropdown-toggle" data-bs-toggle="dropdown">
                <span className="me-1">{perPage}</span>
                <span>records</span>
              </button>
              <div className="dropdown-menu">
                {perPageOptions.map((n) => (
                  <button
                    key={n}
                    className={clsx('dropdown-item', perPage === n && 'active')}
                    onClick={() => { setPerPage(n); setPage(1); }}
                  >
                    {n} records
                  </button>
                ))}
              </div>
            </div>
            <Pagination
              count={totalPages}
              activeItem={page}
              onPageChange={setPage}
              className="m-0 ms-auto"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
