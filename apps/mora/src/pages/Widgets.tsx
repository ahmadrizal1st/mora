// src/pages/Widgets.tsx
import BaseLayout from '../layouts/BaseLayout'
import {
  StatCard,
  UserCard,
  UserCardBig,
  UserCardBg,
  SubscribeCard,
  SmallStats,
  UserInfoCard,
  ConfigurationCard
} from '../components/cards'
import { ProjectProgress } from '../components/cards/ProjectProgress'
import { ProjectKanban } from '../components/cards/ProjectKanban'
import { ProjectSummary } from '../components/cards/ProjectSummary'
import { CodeCard } from '../components/cards/CodeCard'

import type { Person, Photo, Project } from '../types'

interface WidgetsProps {
  people?: Person[]
  projects?: Project[]
  photos?: Photo[]
}

export default function Widgets({ people = [], projects = [], photos = [] }: WidgetsProps) {
  return (
    <BaseLayout pageTitle="Widgets">
      <div className="row row-cards">
        <div className="col-12 col-md-6 col-xxl-3 mb-4 mb-xxl-0">
          <StatCard title="Earned" value="$2,847" icon="credit-card" />
        </div>
        <div className="col-12 col-md-6 col-xxl-3 mb-4 mb-xxl-0">
          <StatCard title="Hours logged" value="42.7 hrs" icon="clock" />
        </div>
        <div className="col-12 col-md-6 col-xxl-3 mb-4 mb-md-0">
          <StatCard title="Avg. time" value="3:28 hrs" icon="slideshow" />
        </div>
        <div className="col-12 col-md-6 col-xxl-3">
          <StatCard title="Weekly growth" value="18.4%" icon="discount" />
        </div>

        <div className="col-lg-6">
          <ProjectProgress project={projects[0]} />
        </div>
        <div className="col-lg-6">
          <ProjectProgress project={projects[2]} progress={76} daysAgo={7} />
        </div>

        <div className="col-md-6 col-xl-3"><UserCard person={people[5 - 1] ?? people[0]} /></div>
        <div className="col-md-6 col-xl-3"><UserCard person={people[6 - 1] ?? people[0]} /></div>
        <div className="col-md-6 col-xl-3"><UserCard person={people[7 - 1] ?? people[0]} right={true} /></div>
        <div className="col-md-6 col-xl-3"><UserCard person={people[8 - 1] ?? people[0]} right={true} /></div>

        <div className="col-md-6 col-xl-3"><UserCardBig person={people[15 - 1] ?? people[0]} /></div>
        <div className="col-md-6 col-xl-3"><UserCardBig person={people[16 - 1] ?? people[0]} /></div>
        <div className="col-md-6 col-xl-3"><UserCardBig person={people[17 - 1] ?? people[0]} /></div>
        <div className="col-md-6 col-xl-3"><UserCardBig person={people[18 - 1] ?? people[0]} /></div>

        <div className="col-md-6 col-xl-3"><UserCardBg person={people[25 - 1] ?? people[0]} photo={photos[25 - 1] ?? photos[0]} /></div>
        <div className="col-md-6 col-xl-3"><UserCardBg person={people[26 - 1] ?? people[0]} photo={photos[26 - 1] ?? photos[0]} /></div>
        <div className="col-md-6 col-xl-3"><UserCardBg person={people[27 - 1] ?? people[0]} photo={photos[27 - 1] ?? photos[0]} blurred={true} /></div>
        <div className="col-md-6 col-xl-3"><UserCardBg person={people[28 - 1] ?? people[0]} photo={photos[28 - 1] ?? photos[0]} blurred={true} /></div>

        <div className="col-md-6">
          <SubscribeCard person={people[0]} />
        </div>
        <div className="col-md-6">
          <SubscribeCard person={people[2 - 1] ?? people[0]} />
        </div>

        <div className="col-md-6 col-xl-3">
          <SmallStats id="currency" icon="currency-dollar" color="primary" title="132 Sales" description="12 waiting payments" />
        </div>
        <div className="col-md-6 col-xl-3">
          <SmallStats id="shopping-cart" icon="shopping-cart" color="green" title="78 Orders" description="32 shipped" />
        </div>
        <div className="col-md-6 col-xl-3">
          <SmallStats id="user" icon="user" color="red" title="1352 Members" description="163 registered today" />
        </div>
        <div className="col-md-6 col-xl-3">
          <SmallStats id="message" icon="message" color="yellow" title="132 Comments" description="16 waitings" />
        </div>

        <div className="col-md-6 col-xl-3">
          <SmallStats id="sales" chartPosition="left" chartType="donut" chartData="56" color="primary" title="132 Sales" description="12 waiting payments" />
        </div>
        <div className="col-md-6 col-xl-3">
          <SmallStats id="orders" chartPosition="left" chartType="donut" chartData="56" color="green" title="78 Orders" description="32 shipped" />
        </div>
        <div className="col-md-6 col-xl-3">
          <SmallStats id="members" chartPosition="left" chartType="donut" chartData="56" color="red" title="1352 Members" description="163 registered today" />
        </div>
        <div className="col-md-6 col-xl-3">
          <SmallStats id="comments" chartPosition="left" chartType="donut" chartData="56" color="yellow" title="132 Comments" description="16 waitings" />
        </div>

        <div className="col-md-6 col-xl-3">
          <SmallStats id="sales" icon="arrow-up" color="green" lt={true} title="$5,256.99" description="Revenue last 30 days" descriptionValue="+4%" />
        </div>
        <div className="col-md-6 col-xl-3">
          <SmallStats id="orders" icon="arrow-down" color="red" lt={true} title="342" description="Sales last 30 days" descriptionValue="-4.3%" descriptionValueColor="red" />
        </div>
        <div className="col-md-6 col-xl-3">
          <SmallStats id="members" icon="arrow-up" color="green" lt={true} title="132" description="Customers last 30 days" descriptionValue="+6.8%" />
        </div>
        <div className="col-md-6 col-xl-3">
          <SmallStats id="comments" icon="arrow-down" color="red" lt={true} title="78" description="Members registered today" descriptionValue="-2%" descriptionValueColor="red" />
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="row row-cards">
            <div className="col-12"><SmallStats chartType="line" chartData="20,0,40,30,40,30,80,60" /></div>
            <div className="col-12"><SmallStats chartType="bar" chartData="20,40,30,10,40,60,80,70" color="red" icon="heart" /></div>
            <div className="col-12"><SmallStats chartType="bar" chartData="20,40,20,-10,-30,10,40,60,80,70" color="green" icon="brand-github" /></div>
            <div className="col-12"><SmallStats chartType="donut" chartData="12" person={people[10 - 1] ?? people[0]} /></div>
            <div className="col-12"><SmallStats chartType="donut" chartData="12" person={people[11 - 1] ?? people[0]} /></div>
            <div className="col-12"><SmallStats chartType="donut" chartData="56" person={people[1 - 1] ?? people[0]} /></div>
            <div className="col-12"><SmallStats color="green" person={people[4 - 1] ?? people[0]} /></div>
            <div className="col-12"><SmallStats smallIcon="trending-down" color="red" person={people[3 - 1] ?? people[0]} /></div>
            <div className="col-12"><CodeCard /></div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="row row-cards">
            <div className="col-12"><ProjectSummary stageColor="red" people={people} /></div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="row row-cards">
            <div className="col-12"><ProjectKanban title="Tabler UI" badge="v1.0" value={30} percentageColor="red" limit={4} offset={0} due="72 days" people={people} /></div>
            <div className="col-12"><ProjectKanban title="Tabler React" value={80} offset={20} people={people} /></div>
            <div className="col-12"><UserInfoCard person={people[24]} /></div>
            <div className="col-12"><ConfigurationCard /></div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}