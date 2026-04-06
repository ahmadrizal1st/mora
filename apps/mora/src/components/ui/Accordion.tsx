import { type ReactNode } from 'react'
import { clsx } from 'clsx'
import { Icon } from './Icon'

export interface AccordionItem {
  question: string
  answer: ReactNode
}

export interface AccordionProps {
  items?: AccordionItem[]
  id?: string
  type?: string | string[]
  showIcon?: boolean
  toggleIcon?: string
  count?: number
  className?: string
}

const defaultItems: AccordionItem[] = [
  { question: 'What is Tabler?', answer: 'Tabler is a free and open-source HTML Dashboard UI Kit.' },
  { question: 'Is Tabler free?', answer: 'Yes, Tabler is completely free and open-source.' },
  { question: 'How to install Tabler?', answer: 'You can install Tabler via npm or download from GitHub.' },
  { question: 'Does Tabler support RTL?', answer: 'Yes, Tabler has full RTL support.' },
]

export function Accordion({
  items,
  id = 'default',
  type,
  showIcon,
  toggleIcon = 'chevron-down',
  count,
  className,
}: AccordionProps) {
  const typeArr = Array.isArray(type) ? type : type ? [type] : []

  const accordionClasses = clsx(
    'accordion',
    typeArr.map((t) => `accordion-${t}`),
    className
  )

  const displayItems = (items ?? defaultItems).slice(0, count ?? undefined)

  return (
    <div className={accordionClasses} id={`accordion-${id}`}>
      {displayItems.map((item, index) => {
        const collapseId = `collapse-${index + 1}-${id}`
        const isFirst = index === 0

        return (
          <div key={index} className="accordion-item">
            <div className="accordion-header">
              <button
                className={clsx('accordion-button', !isFirst && 'collapsed')}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#${collapseId}`}
                aria-expanded={isFirst ? 'true' : 'false'}
              >
                {showIcon && (
                  <div className="accordion-button-icon">
                    <Icon icon="link" />
                  </div>
                )}

                {item.question}

                <div className={clsx('accordion-button-toggle', toggleIcon === 'plus' && 'accordion-button-toggle-plus')}>
                  <Icon icon={toggleIcon} />
                </div>
              </button>
            </div>

            <div
              id={collapseId}
              className={clsx('accordion-collapse', 'collapse', isFirst && 'show')}
              data-bs-parent={`#accordion-${id}`}
            >
              <div className="accordion-body">
                {item.answer}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
