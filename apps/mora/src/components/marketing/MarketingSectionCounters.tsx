interface Counter {
  number: string
  label: string
}

interface MarketingSectionCountersProps {
  background?: 'light' | 'dark' | 'transparent'
  className?: string
}

export function MarketingSectionCounters({ background, className }: MarketingSectionCountersProps) {
  const sectionClasses = [
    'section',
    background && `section-${background}`,
    className
  ].filter(Boolean).join(' ')

  const counters: Counter[] = [
    { number: '48', label: 'templates' },
    { number: '12', label: 'years in business' },
    { number: '2,5k+', label: 'copies sold' },
    { number: '99%', label: 'happy customers' },
  ]

  return (
    <section className={sectionClasses}>
      <div className="container">
        <div className="row justify-content-lg-center">
          {counters.map((counter, index) => (
            <div key={index} className="col-sm-6 col-lg-3">
              <div className="text-center">
                <h2 className="display-5 m-0 fw-bold">{counter.number}</h2>
                <p className="text-secondary m-0">{counter.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
