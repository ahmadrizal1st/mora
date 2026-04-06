import MarketingLayout from '../../layouts/MarketingLayout'
import { MarketingHero } from '../../components/marketing/MarketingHero'
import { MarketingSectionFeatures } from '../../components/marketing/MarketingSectionFeatures'
import { MarketingSectionCTA } from '../../components/marketing/MarketingSectionCTA'

export default function MarketingHeroPage() {
  return (
    <MarketingLayout>
      <MarketingHero 
        type="side"
        title="Better email communication"
        subheader="Tabler Emails"
        description="54 eye-catching, customizable and responsive email templates to improve your email communication. No coding skills needed."
        primaryBtnText="Buy for $29"
        secondaryBtnText="Browse gallery"
      />
      <MarketingSectionFeatures background="light" />
      <MarketingSectionCTA />
    </MarketingLayout>
  )
}
