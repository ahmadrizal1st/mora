// src/pages/IconsPage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { IconsBannerCard } from '../components/cards/IconsBannerCard'
import { IconsCard } from '../components/cards/IconsCard'

export default function IconsPage() {
  return (
    <BaseLayout
      pageTitle="Icons"
      pagePretitle="Addons"
    >
      <div className="row row-cards">
        <div className="col-lg-4">
          <IconsBannerCard />
        </div>
        <div className="col">
          <div className="row row-cards">
            <div className="col-12">
              <IconsCard title="Interface icons" type="outline" />
            </div>
            <div className="col-12">
              <IconsCard title="Filled icons" type="filled" />
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
