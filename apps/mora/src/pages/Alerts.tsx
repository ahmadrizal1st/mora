// src/pages/Alerts.tsx
// Converted from preview/pages/alerts.html

import BaseLayout from '../layouts/BaseLayout'
import { Alert } from '../components/ui/Alert'

export default function Alerts() {
  return (
    <BaseLayout pageTitle="Alerts">
      <div className="row row-cards">

        {/* Basic alerts */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Basic alerts</h2>
              <Alert type="danger"  title="An error occurred!" />
              <Alert type="warning" title="Some information is missing!" />
              <Alert type="success" title="Completed successfully!" />
              <Alert type="info"    title="Just a quick note!" />
            </div>
          </div>
        </div>

        {/* Alerts with action */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Alerts with action</h2>
              <Alert showClose action="Link" type="danger"  title="An error occurred!" />
              <Alert showClose action="Link" type="warning" title="Some information is missing!" />
              <Alert showClose action="Link" type="success" title="Completed successfully!" />
              <Alert showClose action="Link" type="info"    title="Just a quick note!" />
            </div>
          </div>
        </div>

        {/* Dismissible alerts */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Dismissible alerts</h2>
              <Alert showClose type="danger"  title="An error occurred!" />
              <Alert showClose type="warning" title="Some information is missing!" />
              <Alert showClose type="success" title="Completed successfully!" />
              <Alert showClose type="info"    title="Just a quick note!" />
            </div>
          </div>
        </div>

        {/* Alert with a description */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Alert with a description</h2>
              <Alert
                showClose
                type="danger"
                title="Password does not meet requirements:"
                list={['Minimum 8 characters', 'Include a special character']}
              />
              <Alert
                showClose
                type="warning"
                title="Some information is missing!"
                description="This is a custom alert box with a description."
              />
              <Alert
                showClose
                type="success"
                title="Completed successfully!"
                description="This is a custom alert box with a description."
              />
              <Alert
                showClose
                type="info"
                title="Just a quick note!"
                description="This is a custom alert box with a description."
              />
            </div>
          </div>
        </div>

        {/* Important alerts */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Important alerts</h2>
              <Alert
                showClose
                important
                type="danger"
                title="Password does not meet requirements:"
                list={['Minimum 8 characters', 'Include a special character']}
              />
              <Alert showClose important type="success" description="This is a custom alert box with a description." />
              <Alert showClose important type="warning" description="This is a custom alert box with a description." />
              <Alert showClose important type="info"    description="This is a custom alert box with a description." />
            </div>
          </div>
        </div>

        {/* Minor alerts */}
        <div className="col-lg-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Minor alerts</h2>
              <Alert
                showClose
                minor
                type="danger"
                title="Password does not meet requirements:"
                list={['Minimum 8 characters', 'Include a special character']}
              />
              <Alert showClose minor type="success" description="This is a custom alert box with a description." />
              <Alert showClose minor type="warning" description="This is a custom alert box with a description." />
              <Alert showClose minor type="info"    description="This is a custom alert box with a description." />
            </div>
          </div>
        </div>

      </div>
    </BaseLayout>
  )
}
