// src/pages/Navigations.tsx
import DefaultLayout from '../layouts/DefaultLayout'
import { Navbar } from '../components/layout/Navbar'

export default function Navigations() {
  return (
    <DefaultLayout pageTitle="Navigation" sidebar={false}>
      <div className="box">
        {/* Variation 1: White, Logo, Stars, Mallory Hulme */}
        <div className="mb-3">
          <Navbar condensed personId={3} sample />
        </div>

        {/* Variation 2: White, Logo, Stars, Dunn Slane */}
        <div className="mb-3">
          <Navbar condensed personId={4} sample />
        </div>

        {/* Variation 3: Dark, Dashboard title, No icons, Lorry Mion */}
        <div className="mb-3">
          <Navbar condensed dark hideLogo showTitle="Dashboard" hideIcons personId={11} sample />
        </div>

        {/* Variation 4: Purple, Star Logo, Stars, Maryjo Lebarree */}
        <div className="mb-3">
          <Navbar condensed dark smallLogo backgroundColor="#a062cb" personId={10} sample />
        </div>

        {/* Variation 5: Primary Blue, No brand, No icons, Geoffry Flaunders */}
        <div className="mb-3">
          <Navbar condensed dark background="primary" hideBrand hideIcons fluidSearch personId={15} sample />
        </div>

        {/* Variation 6: 2-Line, Dashboard title, Sponsor, Kellie Skingley */}
        <div className="mb-3">
          <Navbar smallLogo showTitle="Dashboard" showSponsor personId={8} sample />
        </div>

        {/* Variation 7: 2-Line Dark, Tabler title, Sponsor, Christabel Charlwood */}
        <div className="mb-3">
          <Navbar dark showSponsor personId={9} sample />
        </div>
      </div>
    </DefaultLayout>
  )
}
