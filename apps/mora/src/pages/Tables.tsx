import BaseLayout from '../layouts/BaseLayout'
import { Table, AdvancedTable } from '../components/ui'
import { ProgressBgTable } from '../components/cards/tables/ProgressBgTable'
import { InvoicesCard } from '../components/cards/InvoicesCard'

export default function Tables() {
  return (
    <BaseLayout pageTitle="Tables">
      <div className="row row-cards">
        <div className="col-lg-8">
          <div className="card">
            <Table card={true} limit={8} />
          </div>
        </div>

        <div className="col-lg-4">
          <ProgressBgTable />
        </div>

        <div className="col-12">
          <div className="card">
            <Table card={true} stripped={true} offset={5} />
          </div>
        </div>

        <div className="col-12">
          <div className="card">
            <Table card={true} avatars={true} offset={10} />
          </div>
        </div>

        <div className="col-12">
          <div className="card">
            <Table card={true} mobile={true} avatars={true} offset={15} buttons={true} />
          </div>
        </div>

        <div className="col-12">
          <InvoicesCard />
        </div>

        <div className="col-12">
          <AdvancedTable />
        </div>
      </div>
    </BaseLayout>
  )
}
