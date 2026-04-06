import { Icon } from '../ui'

interface MarketingSectionSubscribeProps {
  background?: 'light' | 'dark' | 'transparent'
  className?: string
}

export function MarketingSectionSubscribe({ background, className }: MarketingSectionSubscribeProps) {
  const sectionClasses = [
    'section',
    background && `section-${background}`,
    className
  ].filter(Boolean).join(' ')

  return (
    <section className={sectionClasses}>
      <div className="container">
        <div className="section-header mb-6">
          <h2 className="section-title">Subscribe on our newsletter</h2>
          <p className="section-description">Get daily news on upcoming offers from many suppliers all over the world</p>
        </div>
      </div>

      <div className="container-tight">
        <div className="row">
          <div className="col">
            <input className="w-100 form-control" placeholder="Your Email" type="email" />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary">
              <Icon icon="mail" className="me-2" /> Subscribe
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
