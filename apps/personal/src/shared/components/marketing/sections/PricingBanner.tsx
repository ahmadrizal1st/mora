// src/components/marketing/sections/PricingBanner.tsx

import { Icon } from '../../ui/Icon'

interface PricingBannerFeature {
  text: string
}

interface PricingBannerProps {
  background?: string
  title?: string
  description?: string
  currency?: string
  price?: string | number
  priceUnit?: string
  pricePeriod?: string
  features?: PricingBannerFeature[]
  btnText?: string
  href?: string
  className?: string
}

const defaultFeatures: PricingBannerFeature[] = [
  { text: 'Up to 5 developers' },
  { text: 'All marketing + app components' },
  { text: 'Figma UI Kit' },
  { text: 'Lifetime free updates' },
]

export function PricingBanner({
  background,
  title = 'Team License',
  description = 'Get Marketing + Application UI for you and your team',
  currency = '$',
  price = 599,
  priceUnit = 'per team',
  pricePeriod = 'per year',
  features = defaultFeatures,
  btnText = 'Get started',
  href = '#',
  className,
}: PricingBannerProps) {
  const sectionClass = ['section', background ? `section-${background}` : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={sectionClass}>
      <div className="container">
        <div className="bg-body-tertiary p-6 rounded-4">
          <div className="row g-4 align-items-center">
            <div className="col-lg">
              <h3 className="h2">{title}</h3>
              <p className="m-0 text-secondary">{description}</p>
            </div>
            <div className="col-lg">
              <ul className="list-unstyled m-0">
                {features.map((f, i) => (
                  <li key={i}>
                    <Icon icon="check" color="green" className="icon-inline me-1" />
                    {f.text}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-6-sm col-lg">
              <div className="pricing-price m-0">
                <span className="pricing-price-currency">{currency}</span>
                {price}
                <div className="pricing-price-description">
                  <div>{priceUnit}</div>
                  <div>{pricePeriod}</div>
                </div>
              </div>
            </div>
            <div className="col-6-sm col-lg-auto">
              <a href={href} className="btn btn-primary w-100">
                {btnText}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingBanner
