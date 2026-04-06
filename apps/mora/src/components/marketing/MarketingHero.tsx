import { Icon } from '../ui'

interface MarketingHeroProps {
  type?: 'browser' | 'side'
  title?: string
  description?: string
  subheader?: string
  primaryBtnText?: string
  secondaryBtnText?: string
  image?: string
}

export function MarketingHero({
  type = 'browser',
  title,
  description,
  subheader,
  primaryBtnText = 'Preview template',
  secondaryBtnText = 'See features',
  image
}: MarketingHeroProps) {
  if (type === 'side') {
    return (
      <header className="hero">
        <div className="container">
          <div className="row g-lg-8 align-items-center">
            <div className="col-md-6 text-center text-md-start">
              {subheader && <div className="hero-subheader">{subheader}</div>}
              <h1 className="hero-title">{title || 'Better email communication'}</h1>
              <p className="hero-description mt-4">{description || '54 eye-catching, customizable and responsive email templates to improve your email communication. No coding skills needed.'}</p>
              <div className="mt-6 mt-lg-7">
                <div className="row justify-content-center justify-content-md-start">
                  <div className="col-auto"><a href="#" className="btn btn-lg btn-primary">{primaryBtnText}</a></div>
                  <div className="col-auto"><a href="#" className="btn btn-lg">{secondaryBtnText}</a></div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="hero-img-side">
                <img src={image || "/static/marketing/hero-side.png"} alt="Hero" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="hero pb-0">
      <div className="container text-center">
        <h1 className="hero-title">{title || 'Develop beautiful web apps with Tabler'}</h1>
        <p className="hero-description mt-4">
          {description || 'Tabler is a free and open source web application UI kit based on Bootstrap 5, with hundreds responsive components and multiple layouts.'}
        </p>
        <div className="my-5">
          <div className="row g-3 justify-content-center">
            <div className="col-auto">
              <a href="#" className="btn btn-lg">{secondaryBtnText}</a>
            </div>
            <div className="col-auto">
              <a href="#" className="btn btn-lg btn-primary">{primaryBtnText}</a>
            </div>
          </div>
        </div>
        <div className="hero-img img-overlap-margin">
          <div className="browser">
            <div className="browser-header">
              <div className="row align-items-center">
                <div className="col-auto col-md-2">
                  <div className="browser-dots browser-dots-colored">
                    <div className="browser-dot"></div>
                    <div className="browser-dot"></div>
                    <div className="browser-dot"></div>
                  </div>
                </div>
                <div className="col-8 mx-auto">
                  <div className="browser-input">
                    <Icon icon="lock" color="green" size="sm" className="me-2" />
                    https://preview.tabler.io
                  </div>
                </div>
              </div>
            </div>
            <img src="/static/marketing/preview.png" width="1040" height="760" alt="Preview" className="img-fluid" />
          </div>
        </div>
      </div>
    </header>
  )
}
