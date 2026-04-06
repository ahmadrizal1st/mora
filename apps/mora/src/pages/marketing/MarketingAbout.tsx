import MarketingLayout from '../../layouts/MarketingLayout'

export default function MarketingAbout() {
  return (
    <MarketingLayout>
      <div className="hero">
        <div className="container">
          <h1 className="hero-title">About Us</h1>
          <p className="hero-description hero-description-wide">
            Tabler is a digital firm specializing in website development. Our themes are employed by businesses of all scales, ranging from emerging startups to established public companies, to construct and oversee their online presence.
          </p>
        </div>
      </div>

      <div className="section pt-0">
        <div className="container">
          <div className="row gx-3">
            <div className="col mb-3">
              <div className="bg-cover rounded bg-body-tertiary" style={{ height: '15rem', backgroundImage: 'url(/static/photos/1.jpg)' }}></div>
            </div>

            <div className="col-3 d-none d-md-block mb-3">
              <div className="bg-cover rounded bg-body-tertiary" style={{ height: '15rem', backgroundImage: 'url(/static/photos/2.jpg)' }}></div>
            </div>

            <div className="col mb-3">
              <div className="bg-cover rounded bg-body-tertiary" style={{ height: '15rem', backgroundImage: 'url(/static/photos/3.jpg)' }}></div>
            </div>

            <div className="w-100"></div>

            <div className="col mb-3 mb-md-0">
              <div className="bg-cover rounded bg-body-tertiary" style={{ height: '15rem', backgroundImage: 'url(/static/photos/4.jpg)' }}></div>
            </div>

            <div className="col-4 d-none d-md-block mb-3 mb-md-0">
              <div className="bg-cover rounded bg-body-tertiary" style={{ height: '15rem', backgroundImage: 'url(/static/photos/5.jpg)' }}></div>
            </div>

            <div className="col">
              <div className="bg-cover rounded bg-body-tertiary" style={{ height: '15rem', backgroundImage: 'url(/static/photos/6.jpg)' }}></div>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  )
}
