// src/pages/TwoStepVerification.tsx
import SingleLayout from '../layouts/SingleLayout';
import flags from '../data/flags.json';

interface FlagEntry {
  name: string
  flag: string
}

export default function TwoStepVerification() {
  return (
    <SingleLayout>
      <form
        className="card card-md"
        action="/2-step-verification-code"
        method="get"
        autoComplete="off"
        noValidate
      >
        <div className="card-body">
          <h2 className="card-title text-center mb-4">2-Step Verification</h2>

          <div className="mb-3">
            <label className="form-label">Country</label>
            <select className="form-select" defaultValue="us">
              {flags.map((country: FlagEntry) => (
                <option key={country.flag} value={country.flag}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label">Your Phone Number</label>
            <div className="input-group">
              <span className="input-group-text">+1</span>
              <input type="text" className="form-control" placeholder="Enter phone number" />
            </div>
          </div>

          <div className="text-secondary">
            Security is critical in Tabler. To help keep your account safe, we'll text you a
            verification code when you sign in on a new device
          </div>

          <div className="form-footer">
            <button type="submit" className="btn btn-primary w-100">
              Send code
            </button>
          </div>
        </div>
      </form>
    </SingleLayout>
  );
}
