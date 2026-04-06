import MarketingLayout from '../../layouts/MarketingLayout'
import { MarketingHero } from '../../components/marketing/MarketingHero'
import { MarketingSectionPricing } from '../../components/marketing/MarketingSectionPricing'
import { MarketingSectionFAQ } from '../../components/marketing/MarketingSectionFAQ'
import { MarketingSectionCTA } from '../../components/marketing/MarketingSectionCTA'

export default function MarketingPricing() {
  return (
    <MarketingLayout>
      <MarketingHero 
        title="Simple, transparent pricing" 
        description="Get early access to 100+ components and free updates every month. Make it yours today!"
      />
      <MarketingSectionPricing className="pt-0" />
      <MarketingSectionCTA background="light" />
      <MarketingSectionFAQ />
    </MarketingLayout>
  )
}
