// src/pages/PaymentProvidersPage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { Payment } from '../components/ui/Payment'
import paymentsData from '../data/payments.json'

interface PaymentProvider {
  name: string
  logo: string
}

const payments = paymentsData as PaymentProvider[]

export default function PaymentProvidersPage() {
  return (
    <BaseLayout pageTitle="Payment Providers" pagePretitle="Addons">
      <div className="row row-cards">
        {/* Light version */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Light version</div>
            </div>
            <div className="card-body">
              <div className="row g-5 row-cols-5">
                {payments.map((provider) => (
                  <div className="col" key={`light-${provider.logo}`}>
                    <div className="row">
                      <div className="col-auto">
                        <Payment payment={provider.logo} />
                      </div>
                      <div className="col">
                        <strong className="d-block">{provider.name}</strong>
                        <div className="mt-1">
                          <code>{provider.logo}</code>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dark version */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <div className="card-title">Dark version</div>
            </div>
            <div className="card-body">
              <div className="row g-5 row-cols-5">
                {payments.map((provider) => (
                  <div className="col" key={`dark-${provider.logo}`}>
                    <div className="row">
                      <div className="col-auto">
                        <Payment payment={provider.logo} dark />
                      </div>
                      <div className="col">
                        <strong className="d-block">{provider.name}</strong>
                        <div className="mt-1">
                          <code>{provider.logo}-dark</code>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
