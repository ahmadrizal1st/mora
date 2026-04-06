// src/pages/CardsMasonry.tsx
import { useEffect } from 'react'
import BaseLayout from '../layouts/BaseLayout'
import { Placeholder } from '../components/ui'

export default function CardsMasonry() {
  const heights = [
    200, 150, 400, 300, 350, 600, 700, 200, 150, 250, 50, 400, 300, 200,
  ]

  useEffect(() => {
    // Masonry requires the library to be loaded. 
    // Tabler usually expects it to be available if data-masonry is used.
    // If it's not working, we might need to load it dynamically.
    if (!(window as any).Masonry) {
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/masonry-layout@4.2.2/dist/masonry.pkgd.min.js'
      script.async = true
      script.onload = () => {
        // Trigger masonry manually if needed
        const msnryEl = document.querySelector('[data-masonry]')
        if (msnryEl && (window as any).Masonry) {
          new (window as any).Masonry(msnryEl, {
            percentPosition: true,
          })
        }
      }
      document.body.appendChild(script)
    } else {
      const msnryEl = document.querySelector('[data-masonry]')
      if (msnryEl) {
        new (window as any).Masonry(msnryEl, {
          percentPosition: true,
        })
      }
    }
  }, [])

  return (
    <BaseLayout pageTitle="Cards Masonry" pagePretitle="Components">
      <div className="row row-cards" data-masonry='{"percentPosition": true }'>
        {heights.map((height, index) => (
          <div key={index} className="col-sm-6 col-lg-4">
            <div className="card">
              <div className="card-body">
                <Placeholder height={height} border={true} ratio={false} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </BaseLayout>
  )
}
