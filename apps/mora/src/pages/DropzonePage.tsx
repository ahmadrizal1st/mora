// src/pages/DropzonePage.tsx
import BaseLayout from '../layouts/BaseLayout'
import { Dropzone } from '../components/ui'

export default function DropzonePage() {
  return (
    <BaseLayout pageTitle="Dropzone">
      <div className="row row-cards">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Basic Usage</h3>
              <Dropzone id="default" />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Multiple File Upload</h3>
              <Dropzone id="multiple" multiple={true} />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Custom Dropzone</h3>
              <Dropzone
                id="custom"
                custom={true}
                text="Your text here"
                description="Your custom description here"
              />
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
