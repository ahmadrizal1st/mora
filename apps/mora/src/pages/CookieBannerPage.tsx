import { useState } from 'react'
import BaseLayout from '../layouts/BaseLayout'

export default function CookieBannerPage() {
  const [isOpen, setIsOpen] = useState(true)
  const [isRendered, setIsRendered] = useState(true)

  const handleClose = () => {
    setIsOpen(false)
    // Wait for animation to finish (0.35s) before removing from DOM
    setTimeout(() => setIsRendered(false), 350)
  }

  if (!isRendered) {
    return (
      <BaseLayout pageTitle="Cookie banner">
        <div className="container py-4">
          <p>Cookie preferences saved. Refresh to see the banner again.</p>
          <button className="btn btn-outline-primary" onClick={() => window.location.reload()}>
            Reset Banner
          </button>
        </div>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout pageTitle="Cookie banner">
      <style>{`
        .cookie-offcanvas {
          transition: transform 0.35s ease-in-out, visibility 0.35s ease-in-out !important;
        }
        .cookie-backdrop {
          transition: opacity 0.35s linear !important;
        }
      `}</style>
      
      <div 
        className={`offcanvas offcanvas-bottom h-auto cookie-offcanvas ${isOpen ? 'show' : ''}`}
        tabIndex={-1} 
        id="offcanvasBottom" 
        aria-modal="true" 
        role="dialog" 
        style={{ 
          visibility: isOpen ? 'visible' : 'hidden', 
          zIndex: 1060,
          transform: isOpen ? 'none' : 'translateY(100%)'
        }}
      >
        <div className="offcanvas-body">
          <div className="container">
            <div className="row align-items-center">
              <div className="col">
                <strong>Do you like cookies?</strong> 🍪 We use cookies to ensure you get the best experience on our website. <a href="#" target="_blank">Learn more</a>
              </div>
              <div className="col-auto">
                <button type="button" className="btn btn-primary" onClick={handleClose}>
                  Essential Cookies Only
                </button>
              </div>
              <div className="col-auto">
                <button type="button" className="btn btn-primary" onClick={handleClose}>
                  Allow All Cookies
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div 
        className={`offcanvas-backdrop slow-backdrop fade ${isOpen ? 'show' : ''}`} 
        style={{ 
          display: isRendered ? 'block' : 'none',
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
        onClick={handleClose}
      />
    </BaseLayout>
  )
}
