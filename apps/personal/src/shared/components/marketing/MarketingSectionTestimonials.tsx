import { Avatar } from '../ui'

interface Testimonial {
  text: string
  person: {
    full_name: string
    job_title: string
    avatar?: string
  }
}

interface MarketingSectionTestimonialsProps {
  background?: 'light' | 'dark' | 'transparent'
  className?: string
  limit?: number
  hideHeader?: boolean
}

export function MarketingSectionTestimonials({
  background,
  className,
  limit = 9,
  hideHeader = false,
}: MarketingSectionTestimonialsProps) {
  const sectionClasses = ['section', background && `section-${background}`, className]
    .filter(Boolean)
    .join(' ')

  const testimonialsData: Testimonial[] = [
    {
      text: 'Ever since I started using Tabler, my HTML designing process has been significantly smoother. Its intuitive interface is a breath of fresh air!',
      person: {
        full_name: 'Paweł Kuna',
        job_title: 'UI Designer',
        avatar: './static/avatars/000m.jpg',
      },
    },
    {
      text: "I'm beyond impressed with Tabler. This UI kit has transformed my workflow for the better. It's easy to use, streamlined, and remarkably efficient.",
      person: {
        full_name: 'Jeffie Lewincamp',
        job_title: 'Chemical Engineer',
        avatar: './static/avatars/002m.jpg',
      },
    },
    {
      text: "Tabler's feature-rich package has drastically improved my website design process. It's an absolute game-changer in the UI kit landscape.",
      person: {
        full_name: 'Mallory Hulme',
        job_title: 'Geologist',
        avatar: './static/avatars/003m.jpg',
      },
    },
  ].slice(0, limit)

  return (
    <section className={sectionClasses}>
      <div className="container">
        {!hideHeader && (
          <div className="section-header">
            <h2 className="section-title">Trusted by hundreds</h2>
            <p className="section-description">
              Our Users send us bunch of smilies with our services, and we love them 😍
            </p>
          </div>
        )}

        <div className="row g-lg-6">
          {testimonialsData.map((testimonial, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="card bg-surface-secondary shadow-sm">
                <div className="card-body">
                  <div className="row align-items-center mb-3">
                    <div className="col-auto">
                      <Avatar src={testimonial.person.avatar} size="md" />
                    </div>
                    <div className="col">
                      <h3 className="h3 m-0">{testimonial.person.full_name}</h3>
                      <div className="text-secondary small">{testimonial.person.job_title}</div>
                    </div>
                  </div>
                  <p className="mb-0">{testimonial.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
