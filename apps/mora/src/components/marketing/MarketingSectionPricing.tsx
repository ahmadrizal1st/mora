import { Icon } from '../ui'

interface PricingPlan {
  title: string
  price: string
  period: string
  features: string[]
  buttonText: string
  featured?: boolean
  label?: string
}

interface MarketingSectionPricingProps {
  background?: 'light' | 'dark' | 'transparent'
  className?: string
}

export function MarketingSectionPricing({ background, className }: MarketingSectionPricingProps) {
  const sectionClasses = [
    'section',
    background && `section-${background}`,
    className
  ].filter(Boolean).join(' ')

  const plans: PricingPlan[] = [
    {
      title: 'Free',
      price: '99',
      period: 'per year',
      features: [
        'Up to 5 developers',
        'All marketing + app components',
        'Figma UI Kit',
        'Lifetime free updates'
      ],
      buttonText: 'Get started'
    },
    {
      title: 'All features',
      price: '199',
      period: 'per year',
      features: [
        'Up to 5 developers',
        'All marketing + app components',
        'Figma UI Kit',
        'Lifetime free updates'
      ],
      buttonText: 'Get started',
      featured: true,
      label: 'Popular'
    },
    {
      title: 'Other',
      price: '99',
      period: 'per year',
      features: [
        'Up to 5 developers',
        'All marketing + app components',
        'Figma UI Kit',
        'Lifetime free updates'
      ],
      buttonText: 'Get started'
    }
  ]

  return (
    <section className={sectionClasses}>
      <div className="container">
        <div className="row g-4">
          {plans.map((plan, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className={`card ${plan.featured ? 'card-active shadow' : ''} h-100`}>
                {plan.label && (
                  <div className="card-status-top bg-primary"></div>
                )}
                <div className="card-body text-center">
                  {plan.label && <div className="badge bg-primary text-primary-fg mb-3">{plan.label}</div>}
                  <div className="text-uppercase text-secondary font-weight-medium mb-3">{plan.title}</div>
                  <div className="display-5 fw-bold my-3">
                    <span className="fs-2 fw-normal me-1">$</span>
                    {plan.price}
                  </div>
                  <div className="text-secondary mb-4">{plan.period}</div>
                  <ul className="list-unstyled space-y-3 mb-4 text-start">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="d-flex align-items-center">
                        <Icon icon="check" color="green" className="me-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <a href="#" className={`btn w-100 ${plan.featured ? 'btn-primary' : 'btn-outline-primary'}`}>
                      {plan.buttonText}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
