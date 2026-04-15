// src/components/cards/StoreProductGrid.tsx
import { Pagination } from '../ui/Pagination'

interface Product {
  name: string
  image: string
  price: string
  producer?: string
}

interface StoreProductGridProps {
  products?: Product[]
}

export function StoreProductGrid({ products = [] }: StoreProductGridProps) {
  return (
    <>
      <div className="row">
        {products.map((product, i) => (
          <div key={i} className="col-lg-3">
            <div className="card p-3">
              <img
                src={`/static/products/${product.image}`}
                alt={product.name}
                className="mb-3"
              />
              <h3 className="mb-0">{product.name}</h3>
              <div className="text-secondary mb-2">{product.producer}</div>
              <h1 className="text-azure">{product.price}$</h1>
              <div className="d-flex justify-content-between align-items-center">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} className={`star${i <= 4 ? ' text-yellow' : ''}`}>★</span>
                  ))}
                </div>
                <a href="#" className="btn btn-primary">Add to cart</a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex">
        <Pagination className="ms-auto" />
      </div>
    </>
  )
}