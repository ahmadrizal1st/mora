import { Shape } from '../ui/Shape'

interface FeatureDetail {
  icon: string
  title: string
  description: string
}

interface MarketingSectionFeaturesDetailedProps {
  background?: 'light' | 'dark' | 'transparent'
  className?: string
  reverse?: boolean
  title?: string
  description?: string
  features?: FeatureDetail[]
}

export function MarketingSectionFeaturesDetailed({ 
  background, 
  className, 
  reverse = false,
  title = "Everything you need to deploy your app",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  features = [
    {
      icon: 'tools',
      title: 'Designed with users in mind',
      description: 'Tabler is fully responsive and compatible with all modern browsers. Thanks to its modern, user-friendly design you can create a fully functional interface that users will love.'
    },
    {
      icon: 'brand-bootstrap',
      title: 'Built for developers',
      description: 'Having in mind what it takes to write high-quality code, we want to help you speed up the development process and keep your code clean.'
    },
    {
      icon: 'paint',
      title: 'Fully customizable',
      description: 'You can easily customize the UI elements to make them fit the needs of your project. And don’t worry if you don’t have much experience - Tabler is easy to get started!'
    }
  ]
}: MarketingSectionFeaturesDetailedProps) {
  const sectionClasses = [
    'section',
    background && `section-${background}`,
    className
  ].filter(Boolean).join(' ')

  const content = (
    <div className="col-lg-6">
      <div className="space-y-4">
        {features.map((feature, index) => (
          <div key={index}>
            <div className="row g-3">
              <div className="col-auto">
                <Shape icon={feature.icon} size="md" color="primary" />
              </div>
              <div className="col">
                <h3 className="h2 mb-2">{feature.title}</h3>
                <p className="text-secondary mb-0">{feature.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const image = (
    <div className="col-lg-6 mb-3 mb-lg-0">
      <div className="card shadow-sm border-0 overflow-hidden rounded-3">
        <img src="/static/marketing/feature-detailed.png" alt="Feature" className="img-fluid" style={{ minHeight: '400px', objectFit: 'cover' }} />
      </div>
    </div>
  )

  return (
    <section className={sectionClasses}>
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          <div className="section-description">{description}</div>
        </div>

        <div className="row g-lg-10 align-items-center">
          {reverse ? (
            <>
              {content}
              {image}
            </>
          ) : (
            <>
              {image}
              {content}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
