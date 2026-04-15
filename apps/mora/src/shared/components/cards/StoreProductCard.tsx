// src/components/cards/StoreProductCard.tsx
import { Icon } from '../ui/Icon'

interface Product {
  name: string
  image: string
  price: string
  producer?: string
}

interface StoreProductCardProps {
  product?: Product
  productId?: number
}

export function StoreProductCard({ product }: StoreProductCardProps) {
  if (!product) return null

  return (
    <div className="card">
      <div className="card-body">
        <div className="mb-4 text-center">
          <img
            src={`/static/products/${product.image}`}
            alt={product.name}
            className="img-fluid"
          />
        </div>
        <h4 className="card-title">
          <a href="#">{product.name}</a>
        </h4>
        <div className="mt-5 d-flex align-items-center">
          <div className="h3 mb-0">
            <strong>{product.price}</strong>
          </div>
          <div className="ms-auto">
            <a href="#" className="btn btn-primary">
              <Icon icon="shopping-cart" /> Buy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}