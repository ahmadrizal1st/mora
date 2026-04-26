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
  const getRange = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const getPaginationItems = () => {
    const siblings = 1;
    const totalPageNumbers = siblings * 2 + 5; // first + last + current + 2*siblings + 2*dots

    if (count <= totalPageNumbers) {
      return getRange(1, count);
    }

    const leftSiblingIndex = Math.max(activeItem - siblings, 1);
    const rightSiblingIndex = Math.min(activeItem + siblings, count);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < count - 2;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblings;
      const leftRange = getRange(1, leftItemCount);
      return [...leftRange, 'DOTS', count];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblings;
      const rightRange = getRange(count - rightItemCount + 1, count);
      return [1, 'DOTS', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = getRange(leftSiblingIndex, rightSiblingIndex);
      return [1, 'DOTS', ...middleRange, 'DOTS', count];
    }

    return getRange(1, count);
  };

  const paginationItems = getPaginationItems();

  const handlePageClick = (e: React.MouseEvent, page: number | string) => {
    e.preventDefault()
    if (typeof page === 'string' || page < 1 || page > count || page === activeItem) return
    onPageChange?.(page)
  }

  const renderItem = (
    content: React.ReactNode,
    page: number | string,
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

      {paginationItems.map((item, idx) => {
        if (item === 'DOTS') {
          return (
            <li key={`dots-${idx}`} className="page-item disabled">
              <span className="page-link border-0 bg-transparent opacity-50">&hellip;</span>
            </li>
          );
        }

        return (
          <li key={item} className={clsx('page-item', item === activeItem && 'active')}>
            <a className="page-link" href="#" onClick={(e) => handlePageClick(e, item)}>
              {item}
            </a>
          </li>
        );
      })}

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