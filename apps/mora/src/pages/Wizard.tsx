// src/pages/Wizard.tsx
import SingleLayout from '../layouts/SingleLayout'
import { Illustration } from '../components/ui/Illustration'
import { Hr } from '../components/ui/Hr'
import { Progress } from '../components/ui/Progress'
import { Button } from '../components/ui/Button'

export default function Wizard() {
  return (
    <SingleLayout>
      <div className="card card-md">
        <div className="card-body text-center py-4 p-sm-5">
          <Illustration image="boy-girl.svg" height={200} className="mb-n2" />
          <h1 className="mt-5">Welcome to Tabler!</h1>
          <p className="text-secondary">Premium and Open Source dashboard template with responsive and high quality UI.</p>
        </div>

        <Hr text="your data" position="center" className="hr-text-spaceless" />

        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Create your Tabler URL</label>
            <div className="input-group input-group-flat">
              <span className="input-group-text">
                https://tabler.io/
              </span>
              <input type="text" className="form-control ps-1" autoComplete="off" />
            </div>
            <div className="form-hint">Choose a URL that describes you or your business in a concise way. Make it short and easy to remember so you can share links with ease.</div>
          </div>

          <div>
            <label className="form-label">Timezone</label>
            <select className="form-select mb-0" defaultValue="CEDT">
              <option value="CEDT">Central European Daylight Time</option>
              {/* Add more timezones as needed */}
            </select>
          </div>
        </div>
      </div>

      <div className="row align-items-center mt-3">
        <div className="col-4">
          <Progress value={25} />
        </div>
        <div className="col">
          <div className="btn-list justify-content-end">
            <Button text="Set up later" className="btn-link link-secondary" />
            <Button text="Continue" color="primary" />
          </div>
        </div>
      </div>
    </SingleLayout>
  )
}
