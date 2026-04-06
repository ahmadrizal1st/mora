import BaseLayout from '../layouts/BaseLayout'
import { Icon } from '../components/ui/Icon'

export default function PricingTablePage() {
  return (
    <BaseLayout pageTitle="Pricing table">
      <div className="card">
        <div className="table-responsive">
          <table className="table table-vcenter table-bordered table-nowrap card-table">
            <thead>
              <tr>
                <td className="w-50">
                  <h2>Pricing plans for teams of all sizes</h2>
                  <div className="text-secondary text-wrap">
                    Choose an affordable plan that comes with the best features to engage your audience, create customer loyalty and increase sales.
                  </div>
                </td>
                <td className="text-center">
                  <div className="text-uppercase text-secondary fw-medium">Starter</div>
                  <div className="display-6 fw-bold my-3">$0</div>
                  <a href="#" className="btn w-100">Choose plan</a>
                </td>
                <td className="text-center">
                  <div className="text-uppercase text-secondary fw-medium">Professional</div>
                  <div className="display-6 fw-bold my-3">$9</div>
                  <a href="#" className="btn btn-green w-100">Choose plan</a>
                </td>
                <td className="text-center">
                  <div className="text-uppercase text-secondary fw-medium">Business</div>
                  <div className="display-6 fw-bold my-3">$16</div>
                  <a href="#" className="btn w-100">Choose plan</a>
                </td>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-surface-tertiary">
                <th colSpan={4} className="subheader">Features</th>
              </tr>
              <tr>
                <td>Some info about feature</td>
                <td className="text-center"><Icon icon="check" className="text-green" /></td>
                <td className="text-center"><Icon icon="check" className="text-green" /></td>
                <td className="text-center"><Icon icon="check" className="text-green" /></td>
              </tr>
              <tr>
                <td>Online payment gateway</td>
                <td className="text-center"><Icon icon="x" className="text-red" /></td>
                <td className="text-center"><Icon icon="check" className="text-green" /></td>
                <td className="text-center"><Icon icon="check" className="text-green" /></td>
              </tr>
              <tr>
                <td>Unlimited products can be sold</td>
                <td className="text-center"><Icon icon="x" className="text-red" /></td>
                <td className="text-center"><Icon icon="x" className="text-red" /></td>
                <td className="text-center"><Icon icon="check" className="text-green" /></td>
              </tr>
              <tr className="bg-surface-tertiary">
                <th colSpan={4} className="subheader">Reporting</th>
              </tr>
              <tr>
                <td>Free hosting and domain name</td>
                <td className="text-center"><Icon icon="check" className="text-green" /></td>
                <td className="text-center"><Icon icon="check" className="text-green" /></td>
                <td className="text-center"><Icon icon="check" className="text-green" /></td>
              </tr>
              <tr>
                <td>Admin dashboard to control items</td>
                <td className="text-center"><Icon icon="check" className="text-green" /></td>
                <td className="text-center"><Icon icon="check" className="text-green" /></td>
                <td className="text-center"><Icon icon="check" className="text-green" /></td>
              </tr>
              <tr className="bg-surface-tertiary">
                <th colSpan={4} className="subheader">Support</th>
              </tr>
              <tr>
                <td>Email marketing and service</td>
                <td className="text-center"><Icon icon="x" className="text-red" /></td>
                <td className="text-center"><Icon icon="x" className="text-red" /></td>
                <td className="text-center"><Icon icon="check" className="text-green" /></td>
              </tr>
              <tr>
                <td>24/7 customer support online</td>
                <td className="text-center"><Icon icon="x" className="text-red" /></td>
                <td className="text-center"><Icon icon="check" className="text-green" /></td>
                <td className="text-center"><Icon icon="check" className="text-green" /></td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td></td>
                <td>
                  <a href="#" className="btn w-100">Choose plan</a>
                </td>
                <td>
                  <a href="#" className="btn btn-green w-100">Choose plan</a>
                </td>
                <td>
                  <a href="#" className="btn w-100">Choose plan</a>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </BaseLayout>
  )
}
