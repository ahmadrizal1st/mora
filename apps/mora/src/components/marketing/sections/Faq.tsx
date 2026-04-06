// src/components/marketing/sections/Faq.tsx
import type { ReactNode } from 'react'

interface FaqItem {
  question: string
  answer?: string | ReactNode
  list?: string[]
}

interface FaqProps {
  background?: string
  className?: string
  items?: FaqItem[]
}

const defaultFaqs: FaqItem[] = [
  {
    question: 'How is Tabler Pro different from Tabler?',
    answer:
      'Tabler offers fundamental components that you can piece together to build your app or website. However, Tabler Pro offers an elevated convenience by providing pre-assembled components and page templates, acting as ready-to-use building blocks that can be swiftly integrated into your app, thereby saving development time.',
  },
  {
    question: 'Is this a yearly subscription?',
    answer:
      'Certainly, you have lifelong access to all our components. This implies that you will receive new components and updates every month, continuing as long as we have new component ideas to share.',
  },
  {
    question: "I want to buy this but I can't afford it. Is there a discount?",
    answer:
      'Should you be a student or find the cost excessively high in your local currency, please reach out to us detailing your circumstances, and we will contemplate offering you a discount.',
  },
  {
    question: 'What can I do with this license?',
    list: [
      'To build your websites or SaaS project that end-users need to pay',
      'To build an open-source tool or documentation website',
    ],
  },
  {
    question: 'What version of Tabler is used?',
    answer:
      'The elements in Tabler Pro are created using Tabler v1.2 and later versions. If your current version is v0.8, we advise you to update to the latest version to make the most of the Pro components.',
  },
  {
    question: 'What restrictions does this license have?',
    list: [
      'Create a clone of Tabler PRO to sell',
      'Create products like templates, themes, Figma or Sketch UI kits, page builders based on the PRO components',
      'Recreate the components for other UI libraries or CSS frameworks',
    ],
  },
]

export function Faq({ background, className = '', items = defaultFaqs }: FaqProps) {
  const sectionClass = ['section', background ? `section-${background}` : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={sectionClass}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Frequently Asked Questions</h2>
        </div>
        <div className="row g-lg-4">
          {items.map(({ question, answer, list }) => (
            <div key={question} className="col-md-4 prose">
              <h3 className="h2">{question}</h3>
              {list ? (
                <ul className="text-secondary">
                  {list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-secondary">{answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Faq
