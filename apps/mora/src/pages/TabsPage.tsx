// src/pages/TabsPage.tsx
import DefaultLayout from '../layouts/DefaultLayout'
import { TabsCard } from '../components/cards/TabsCard'

export default function TabsPage() {
  return (
    <DefaultLayout pageTitle="Tabs">
      <div className="row row-cards">
        <div className="col-md-4">
          <TabsCard id="1" settings={true} />
        </div>
        <div className="col-md-4">
          <TabsCard id="2" reverse={true} settings={true} />
        </div>
        <div className="col-md-4">
          <TabsCard id="3" icons={true} />
        </div>
        <div className="col-md-4">
          <TabsCard id="4" dropdown={true} />
        </div>
        <div className="col-md-4">
          <TabsCard id="5" justified={true} activity={true} />
        </div>
        <div className="col-md-4">
          <TabsCard id="6" justified={true} disabled={true} />
        </div>
        <div className="col-md-4">
          <TabsCard id="7" justified={true} icons={true} activity={true} />
        </div>
        <div className="col-md-4">
          <TabsCard id="8" animation={true} activity={true} />
        </div>
      </div>
    </DefaultLayout>
  )
}
