interface FAQItem {
  question: string
  answer: string
}

interface MarketingSectionFAQProps {
  background?: 'light' | 'dark' | 'transparent'
  className?: string
}

export function MarketingSectionFAQ({ background, className }: MarketingSectionFAQProps) {
  const sectionClasses = [
    'section',
    background && `section-${background}`,
    className
  ].filter(Boolean).join(' ')

  const faqs: FAQItem[] = [
    {
      question: "Can I use Tabler in commercial projects?",
      answer: "Of course! Tabler is under MIT license, so you can confidently use it in commercial projects. However, remember to include a note that your project uses Tabler."
    },
    {
      question: "How do I get notified of new Tabler versions?",
      answer: "You may watch the releases on GitHub or follow me on Twitter."
    },
    {
      question: "Can Tabler be used with WordPress?",
      answer: "Tabler is an HTML template that can be used for any purpose. However, it is not made to be easily installed on WordPress. It will require some effort and enough knowledge of the WordPress script to do so."
    }
  ]

  return (
    <section className={sectionClasses}>
      <div className="container">
        <div className="row g-xl-6">
          <div className="col-lg-4">
            <div className="section-header text-start sticky-top" style={{ top: '2rem' }}>
              <div className="section-title h2">Frequently asked questions</div>
              <p className="section-description">Can’t find the answer you’re looking for? Reach out to our customer support team.</p>
            </div>
          </div>
          <div className="col-lg">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <div className="h3 mb-2">{faq.question}</div>
                  <div className="text-secondary">{faq.answer}</div>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <a className="btn btn-outline-primary" href="#">Read more questions</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
