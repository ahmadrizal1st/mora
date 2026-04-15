import { Shape } from '../ui/Shape'

interface MarketingSectionFeaturesProps {
  background?: 'light' | 'dark' | 'transparent'
  className?: string
}

export function MarketingSectionFeatures({ background, className }: MarketingSectionFeaturesProps) {
  const sectionClasses = [
    'section',
    background && `section-${background}`,
    className
  ].filter(Boolean).join(' ')

  const features = [
    {
      icon: 'devices',
      title: 'Mobile-optimized',
      description: 'Our email templates are fully responsive, so you can be sure they will look great on any device and screen size.'
    },
    {
      icon: 'mailbox',
      title: 'Compatible with 90+ email clients',
      description: 'Tested across 90+ email clients and devices, Tabler emails will help you make your email communication professional and reliable.'
    },
    {
      icon: 'palette',
      title: 'Unique, minimal design',
      description: 'Draw recipients’ attention with beautiful, minimal email designs based on Bootstrap and Material Design principles.'
    }
  ]

  return (
    <section className={sectionClasses}>
      <div className="container">
        <div className="row items-center text-center g-lg-10">
          {features.map((feature, index) => (
            <div key={index} className="col-md-6 col-lg">
              <div className="d-flex justify-content-center mb-3">
                <Shape icon={feature.icon} size="md" color="primary" />
              </div>
              <h2 className="h2">{feature.title}</h2>
              <p className="text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
