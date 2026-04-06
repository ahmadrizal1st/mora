import BaseLayout from '../layouts/BaseLayout'
import { Accordion } from '../components/ui/Accordion'
import { Breadcrumb } from '../components/ui/Breadcrumb'

interface FAQQuestion {
  question: string
}

interface FAQCategory {
  name: string
  questions: FAQQuestion[]
}

interface FAQPageProps {
  faq: FAQCategory[]
}

export default function FAQPage({ faq }: FAQPageProps) {
  return (
    <BaseLayout 
      pageTitle="Frequently Asked Questions"
      pageActions={<Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'FAQ' }]} />}
    >
      <div className="container-xl">
        <div className="card card-lg">
          <div className="card-body">
            <div className="space-y-4">
              {faq.map((category, catIndex) => (
                <div key={catIndex}>
                  <h2 className="mb-3">{catIndex + 1}. {category.name}</h2>
                  <Accordion
                    id={`faq-${catIndex + 1}`}
                    className="accordion-tabs"
                    items={category.questions.map(q => ({
                      question: q.question,
                      answer: (
                        <div>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias dignissimos dolorum ea est eveniet, excepturi illum in iste iure maiores nemo recusandae rerum saepe sed, sunt totam! Explicabo, ipsa?
                          </p>
                          <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium alias dignissimos dolorum ea est eveniet, excepturi illum in iste iure maiores nemo recusandae rerum saepe sed, sunt totam! Explicabo, ipsa?
                          </p>
                        </div>
                      )
                    }))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
