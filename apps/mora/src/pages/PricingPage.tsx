// src/pages/PricingPage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { PricingCard } from '../components/cards/PricingCard'
import { PricingCardEnterprise } from '../components/cards/PricingCardEnterprise'

export default function PricingPage() {
  return (
    <BaseLayout pageTitle="Pricing cards">
      <div className="row row-cards">
        <div className="col-sm-6 col-lg-3">
          <PricingCard
            price="0"
            users={3}
            category="Free"
            availableFeatures={[false, false, false, false]}
          />
        </div>
        <div className="col-sm-6 col-lg-3">
          <PricingCard
            price="49"
            users={10}
            category="Premium"
            availableFeatures={[true, true, false, false]}
            featuredColor="green"
          />
        </div>
        <div className="col-sm-6 col-lg-3">
          <PricingCard
            price="99"
            users={100}
            category="Enterprise"
            availableFeatures={[true, true, true, false]}
          />
        </div>
        <div className="col-sm-6 col-lg-3">
          <PricingCard
            price="139"
            users="Unlimited"
            category="Unlimited"
            availableFeatures={[true, true, true, true]}
          />
        </div>
        <div className="col-12">
          <PricingCardEnterprise />
        </div>
      </div>
    </BaseLayout>
  )
}
