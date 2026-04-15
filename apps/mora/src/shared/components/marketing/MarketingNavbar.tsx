import { Link, useLocation } from 'react-router-dom'


export function MarketingNavbar() {
  const location = useLocation()
  
  const navItems = [
    { title: 'Home', path: '/marketing' },
    { title: 'Testimonials', path: '/marketing/testimonials' },
    { title: 'Pricing', path: '/marketing/pricing' },
    { title: 'About', path: '/marketing/about' },
    { title: 'Text', path: '/marketing/text' },
    { title: 'App', path: '/marketing/hero' },
    { title: 'Real estate', path: '/marketing/real-estate' },
  ]

  return (
    <header className="navbar navbar-expand-lg navbar-transparent py-3">
      <div className="container">
        <Link to="/" className="navbar-brand navbar-brand-autodark pe-0 pe-md-3">
          <img src="/static/logo.svg" width="110" height="32" alt="Tabler" className="navbar-brand-image" />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle primary navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <nav aria-label="Primary">
            <ul className="navbar-nav ms-auto">
              {navItems.map((item) => (
                <li key={item.path} className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === item.path ? 'active' : ''}`} 
                    to={item.path}
                  >
                    <span className="nav-link-title">{item.title}</span>
                  </Link>
                </li>
              ))}
              <li className="nav-item ms-lg-4">
                <a href="#" className="btn btn-primary">Buy now</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}