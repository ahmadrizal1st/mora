import MarketingLayout from '../../layouts/MarketingLayout'
import { MarketingHero } from '../../components/marketing/MarketingHero'
import { MarketingSectionTestimonials } from '../../components/marketing/MarketingSectionTestimonials'

export default function MarketingTestimonials() {
  return (
    <MarketingLayout>
      <MarketingHero 
        title="Trusted by hundreds" 
        description="Our Users send us bunch of smilies with our services, and we love them 😍"
      />
      <MarketingSectionTestimonials hideHeader className="pt-0" limit={21} />
    </MarketingLayout>
  )
}
