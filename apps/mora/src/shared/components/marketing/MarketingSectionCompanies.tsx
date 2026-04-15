
interface MarketingSectionCompaniesProps {
  background?: 'light' | 'dark' | 'transparent'
  className?: string
  divider?: 'waves' | 'arc'
}

export function MarketingSectionCompanies({ background, className }: MarketingSectionCompaniesProps) {
  const sectionClasses = [
    'section',
    background && `section-${background}`,
    className
  ].filter(Boolean).join(' ')

  const brands = [
    { name: 'Baremetrics', image: 'baremetrics.svg' },
    { name: 'CGI', image: 'cgi.svg' },
    { name: 'Docplanner', image: 'docplanner.svg' },
    { name: 'Flow', image: 'flow.svg' },
    { name: 'fuboTV', image: 'fubotv.svg' },
    { name: 'Six Flags', image: 'six-flags.svg' },
    { name: 'Vocus', image: 'vocus.svg' },
  ]

  return (
    <section className={sectionClasses}>
      <div className="container">
        <div className="section-header mb-6">
          <h2 className="section-title text-secondary">Trusted by over 3,000 companies</h2>
        </div>
        <div className="row g-lg-8 align-items-center justify-content-center">
          {brands.map((brand) => (
            <div key={brand.name} className="col-auto">
              <a href="#" className="link-secondary">
                <img 
                  src={`/static/marketing/brands/${brand.image}`} 
                  alt={brand.name} 
                  height="30" 
                  className="d-block mx-auto opacity-50" 
                  style={{ filter: 'grayscale(100%)' }}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
