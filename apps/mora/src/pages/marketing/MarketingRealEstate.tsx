import MarketingLayout from '../../layouts/MarketingLayout'
import { Icon } from '../../components/ui'

export default function MarketingRealEstate() {
  const properties = [
    {
      name: "Cozy Cottage",
      address: "123 Main Street",
      baths: 2,
      bedrooms: 3,
      image: "photo-1558036117-15d82a90b9b1.jpg",
      price: "$250,000"
    },
    {
      name: "Modern Townhouse",
      address: "456 Elm Avenue",
      baths: 3,
      bedrooms: 4,
      image: "photo-1494526585095-c41746248156.jpg",
      price: "$450,000"
    },
    {
      name: "Spacious Villa",
      address: "789 Oak Drive",
      baths: 5,
      bedrooms: 6,
      image: "photo-1512917774080-9991f1c4c750.jpg",
      price: "$1,200,000"
    },
    {
      name: "Rustic Farmhouse",
      address: "321 Pine Lane",
      baths: 2,
      bedrooms: 2,
      image: "photo-1564013799919-ab600027ffc6.jpg",
      price: "$350,000"
    },
    {
      name: "Beachfront Condo",
      address: "567 Sandy Beach Road",
      baths: 2,
      bedrooms: 1,
      image: "photo-1580587771525-78b9dba3b914.jpg",
      price: "$500,000"
    },
    {
      name: "Luxury Penthouse",
      address: "890 Highrise Avenue",
      baths: 4,
      bedrooms: 3,
      image: "photo-1592595896551-12b371d546d5.jpg",
      price: "$2,000,000"
    }
  ]

  return (
    <MarketingLayout>
      <header className="img-bg" style={{ backgroundImage: 'url(/static/marketing/photo-1564013799919-ab600027ffc6.jpg)', backgroundSize: 'cover' }}>
        <div className="hero position-relative bg-primary py-12" style={{ backgroundColor: 'rgba(32, 107, 196, 0.9)' }}>
          <div className="container-narrow">
            <h1 className="hero-title text-white">Find your forever home</h1>
            <p className="hero-description mb-5 text-white text-opacity-50 text-center">It's time to find the home of your dreams, and you search begins here. We make it easy to find the property that fits your needs and budget.</p>
            <div className="row gx-lg-5 justify-content-center">
              <div className="col-xl-6 col-lg-8 text-center">
                <form className="row row-cols-1 row-cols-md-auto g-3 align-items-center">
                  <div className="col flex-grow-1">
                    <input type="text" placeholder="Search properties near you..." className="form-control form-control-flush border-0 shadow-sm" aria-label="Search properties near you" />
                  </div>
                  <div className="col"><button type="submit" className="btn btn-teal">Search</button></div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="section section-white">
        <div className="container">
          <div className="row g-lg-6">
            {properties.map((property, index) => (
              <div key={index} className="col-md-6 col-lg-4">
                <div className="card shadow-sm">
                  <a href="#">
                    <div className="img-bg ratio ratio-4x3 card-img-top" style={{ backgroundImage: `url(/static/marketing/${property.image})`, backgroundSize: 'cover' }}></div>
                  </a>

                  <div className="card-body">
                    <div className="h1 mb-2 fw-bold">{property.price}</div>
                    <div>
                      <div className="text-secondary small mb-3">{property.address}, California USA</div>

                      <div className="d-flex mb-4 text-secondary">
                        <div className="d-flex align-items-center me-3">
                          <Icon icon="bed" className="me-1" />
                          {property.bedrooms} beds
                        </div>
                        <div className="d-flex align-items-center">
                          <Icon icon="bath" className="me-1" />
                          {property.baths} baths
                        </div>
                      </div>

                      <a href="#" className="btn btn-primary w-100">See details</a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MarketingLayout>
  )
}
