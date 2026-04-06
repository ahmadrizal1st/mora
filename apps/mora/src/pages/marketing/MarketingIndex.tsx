import MarketingLayout from '../../layouts/MarketingLayout'
import { MarketingHero } from '../../components/marketing/MarketingHero'
import { MarketingSectionCompanies } from '../../components/marketing/MarketingSectionCompanies'
import { MarketingSectionFeatures } from '../../components/marketing/MarketingSectionFeatures'
import { MarketingSectionFeaturesDetailed } from '../../components/marketing/MarketingSectionFeaturesDetailed'
import { MarketingSectionCTA } from '../../components/marketing/MarketingSectionCTA'
import { MarketingSectionTestimonials } from '../../components/marketing/MarketingSectionTestimonials'
import { MarketingSectionCounters } from '../../components/marketing/MarketingSectionCounters'
import { MarketingSectionSubscribe } from '../../components/marketing/MarketingSectionSubscribe'
import { MarketingSectionFAQ } from '../../components/marketing/MarketingSectionFAQ'

export default function MarketingIndex() {
  return (
    <MarketingLayout>
      <MarketingHero />
      
      <MarketingSectionCompanies background="light" className="mt-n5" />
      
      <MarketingSectionFeatures />
      
      <MarketingSectionFeaturesDetailed background="light" />
      
      <MarketingSectionCTA />
      
      <MarketingSectionFeaturesDetailed background="light" reverse />
      
      <MarketingSectionTestimonials limit={9} />
      
      <MarketingSectionCounters background="light" />
      
      <MarketingSectionSubscribe />
      
      <MarketingSectionFAQ background="light" />
    </MarketingLayout>
  )
}
