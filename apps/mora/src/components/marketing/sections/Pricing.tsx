// src/components/marketing/sections/Pricing.tsx

import { Icon } from '../../ui/Icon'

interface PricingFeature {
  text: string
}

interface PricingPlan {
  title: string
  currency?: string
  price: string | number
  priceUnit?: string
  pricePeriod?: string
  features?: PricingFeature[]
  featured?: boolean
  featuredLabel?: string
  btnText?: string
  btnVariant?: string
  href?: string
}

interface PricingProps {
  background?: string
  className?: string
  plans?: PricingPlan[]
}

const defaultFeatures: PricingFeature[] = [
  { text: 'Up to 5 developers' },
  { text: 'All marketing + app components' },
  { text: 'Figma UI Kit' },
  { text: 'Lifetime free updates' },
]

const defaultPlans: PricingPlan[] = [
  {
    title: 'Free',
    currency: '$',
    price: 99,
    priceUnit: 'per user',
    pricePeriod: 'per year',
    features: defaultFeatures,
    btnText: 'Get started',
  },
  {
    title: 'All features',
    currency: '$',
    price: 199,
    priceUnit: 'per user',
    pricePeriod: 'per year',
    features: defaultFeatures,
    featured: true,
    featuredLabel: 'Popular',
    btnText: 'Get started',
    btnVariant: 'btn-primary',
  },
  {
    title: 'Other',
    currency: '$',
    price: 99,
    priceUnit: 'per user',
    pricePeriod: 'per year',
    features: defaultFeatures,
    btnText: 'Get started',
  },
]

export function Pricing({ background, className = '', plans = defaultPlans }: PricingProps) {
  const sectionClass = ['section', background ? `section-${background}` : '', className]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={sectionClass}>
      <div className="container">
        <div className="pricing">
          {plans.map((plan, i) => (
            <div key={i} className={`pricing-card${plan.featured ? ' featured' : ''}`}>
              {plan.featured && plan.featuredLabel && (
                <div className="pricing-label">
                  <div className="badge bg-primary text-primary-fg">{plan.featuredLabel}</div>
                </div>
              )}
              <h4 className="pricing-title">{plan.title}</h4>
              <div className="pricing-price">
                {plan.currency && (
                  <span className="pricing-price-currency">{plan.currency}</span>
                )}
                {plan.price}
                <div className="pricing-price-description">
                  {plan.priceUnit && <div>{plan.priceUnit}</div>}
                  {plan.pricePeriod && <div>{plan.pricePeriod}</div>}
                </div>
              </div>
              {plan.features && (
                <ul className="pricing-features my-5">
                  {plan.features.map((f, fi) => (
                    <li key={fi}>
                      <Icon icon="check" color="green" className="icon-inline me-1" />
                      {f.text}
                    </li>
                  ))}
                </ul>
              )}
              <div className="pricing-btn">
                <a
                  href={plan.href ?? '#'}
                  className={`btn w-100${plan.btnVariant ? ` ${plan.btnVariant}` : ''}`}
                >
                  {plan.btnText ?? 'Get started'}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Pricing
