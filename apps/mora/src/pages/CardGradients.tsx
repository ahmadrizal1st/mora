// src/pages/CardGradients.tsx
import BaseLayout from '../layouts/BaseLayout'
import {
  WelcomeCard,
  DeleteConfirmCard,
  PricingPlan,
  StatGradientCard,
  HappyBirthdayCard,
  YouWinCard,
  WeatherCard,
  ProfileContactCard,
  SuccessMessageCard,
  SmallStats,
} from '../components/cards'

import type { Person } from '../types'

interface CardGradientsProps {
  people?: Person[]
}

export default function CardGradients({ people = [] }: CardGradientsProps) {
  const person7 = people.length > 6 ? people[6] : { full_name: 'Mallory Hulme', job_title: 'Geologist IV' }

  return (
    <BaseLayout pageTitle="Card Gradients" pagePretitle="Components">
      <div className="row row-cards">
        <div className="col-md-6">
          <div className="row row-cards">
            <div className="col-12">
              <WelcomeCard />
            </div>
            <div className="col-12">
              <div className="row">
                <div className="col-6">
                  <div className="row row-cards">
                    <div className="col-12">
                      <DeleteConfirmCard />
                    </div>
                    <div className="col-12">
                      <SuccessMessageCard />
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="row row-cards">
                    <div className="col-12">
                      <PricingPlan />
                    </div>
                    <div className="col-12">
                      <StatGradientCard
                        title="Earned"
                        value="$2,847"
                        icon="credit-card"
                        color="success"
                        progress={75}
                      />
                    </div>
                    <div className="col-12">
                      <StatGradientCard
                        title="Pending Orders"
                        value="47"
                        icon="clock"
                        color="yellow"
                        progress={38}
                      />
                    </div>
                    <div className="col-12">
                      <StatGradientCard
                        title="Cancelled Orders"
                        value="12"
                        icon="shopping-cart-x"
                        color="red"
                        progress={8}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-3">
          <div className="row row-cards">
            <div className="col-12">
              <HappyBirthdayCard name="Roxie" />
            </div>
            <div className="col-12">
              <YouWinCard />
            </div>
          </div>
        </div>

        <div className="col-3">
          <div className="row row-cards">
            <div className="col-12">
              <WeatherCard
                city="Warsaw, PL"
                temperature={3}
                color="rain"
                icon="cloud-rain"
                description="Cloudy morning"
              />
            </div>
            <div className="col-12">
              <WeatherCard
                city="Oslo, NO"
                temperature={-5}
                color="snow"
                icon="cloud"
                description="Snowy day"
              />
            </div>
            <div className="col-12">
              <WeatherCard
                city="Dubai, AE"
                temperature={32}
                color="sun"
                icon="sun"
                description="Sunny day"
              />
            </div>
            <div className="col-12">
              <ProfileContactCard person={person7} />
            </div>
            <div className="col-12">
              <SmallStats
                chartType="line"
                chartData="11, 16, 13, 20, 17, 24, 19, 23, 16, 20, 13, 17, 11, 19"
                color="primary"
                id="chart1"
                className="card-gradient card-gradient-end card-gradient-primary"
              />
            </div>
            <div className="col-12">
              <SmallStats
                id="sales"
                icon="arrow-up"
                color="green"
                title="$5,256.99"
                description="Revenue last 30 days"
                descriptionValue="+4%"
                className="card-gradient card-gradient-end card-gradient-green"
              />
            </div>
            <div className="col-12">
              <SmallStats
                id="orders"
                icon="arrow-down"
                color="red"
                title="342"
                description="Sales last 30 days"
                descriptionValue="-4.3%"
                descriptionValueColor="red"
                className="card-gradient card-gradient-end card-gradient-red"
              />
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
