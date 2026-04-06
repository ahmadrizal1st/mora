import { clsx } from 'clsx'
import { Icon } from './Icon'

export interface PaginationProps {
  count?: number
  offset?: number
  activeItem?: number
  firstLast?: boolean
  text?: boolean
  prevDescription?: string
  nextDescription?: string
  className?: string
  onPageChange?: (page: number) => void
}

export function Pagination({
  count = 5,
  offset,
  activeItem = 1,
  firstLast,
  text,
  prevDescription,
  nextDescription,
  className,
  onPageChange,
}: PaginationProps) {
  const currentOffset = offset ?? count
  const countOffset = count - currentOffset + 1
  const pages = Array.from({ length: Math.min(count, currentOffset) }, (_, i) => i + 1)

  const handlePageClick = (e: React.MouseEvent, page: number) => {
    e.preventDefault()
    if (page < 1 || page > count || page === activeItem) return
    onPageChange?.(page)
  }

  const renderItem = (
    content: React.ReactNode,
    page: number,
    isDisabled: boolean,
    extraClass?: string
  ) => (
    <li className={clsx('page-item', isDisabled && 'disabled', extraClass)}>
      <a
        className={clsx('page-link', text && 'page-text')}
        href="#"
        onClick={(e) => handlePageClick(e, page)}
        tabIndex={isDisabled ? -1 : undefined}
        aria-disabled={isDisabled}
      >
        {content}
      </a>
    </li>
  )

  return (
    <ul className={clsx('pagination', className)}>
      {firstLast && renderItem(!text ? <Icon icon="chevrons-left" /> : 'First', 1, activeItem === 1)}
      
      {renderItem(
        prevDescription ? (
          <>
            <div className="page-item-subtitle">previous</div>
            <div className="page-item-title">{prevDescription}</div>
          </>
        ) : !text ? (
          <Icon icon="chevron-left" />
        ) : (
          'Previous'
        ),
        activeItem - 1,
        activeItem === 1,
        prevDescription ? 'page-prev' : undefined
      )}

      {pages.map((i) => (
        <li key={i} className={clsx('page-item', i === activeItem && 'active')}>
          <a className="page-link" href="#" onClick={(e) => handlePageClick(e, i)}>
            {i}
          </a>
        </li>
      ))}

      {currentOffset < count && (
        <>
          <li className="page-item">
            <span className="page-link disabled">&hellip;</span>
          </li>
          {Array.from({ length: count - countOffset + 1 }, (_, i) => countOffset + i).map((i) => (
            <li key={i} className={clsx('page-item', i === activeItem && 'active')}>
              <a className="page-link" href="#" onClick={(e) => handlePageClick(e, i)}>
                {i}
              </a>
            </li>
          ))}
        </>
      )}

      {renderItem(
        nextDescription ? (
          <>
            <div className="page-item-subtitle">next</div>
            <div className="page-item-title">{nextDescription}</div>
          </>
        ) : !text ? (
          <Icon icon="chevron-right" />
        ) : (
          'Next'
        ),
        activeItem + 1,
        activeItem === count,
        nextDescription ? 'page-next' : undefined
      )}

      {firstLast && renderItem(!text ? <Icon icon="chevrons-right" /> : 'Last', count, activeItem === count)}
    </ul>
  )
}