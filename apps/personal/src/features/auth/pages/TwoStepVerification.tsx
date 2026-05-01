// src/features/auth/pages/TwoStepVerification.tsx
import { useState } from 'react'
import SingleLayout from '@/shared/layouts/SingleLayout'
import flags from '@/shared/data/flags.json'
import { useSend2FACodeMutation } from '../hooks/useSend2FACodeMutation'
import { AxiosError } from 'axios'
import { getApiErrorMessage } from '@/shared/utils/errorUtils'

interface FlagEntry {
  name: string
  flag: string
}

export default function TwoStepVerification() {
  const [countryCode, setCountryCode] = useState('us')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const sendCodeMutation = useSend2FACodeMutation()

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!phone) {
      setError('Please enter your phone number.')
      return
    }

    sendCodeMutation.mutate({ 
      phone, 
      country_code: countryCode 
    }, {
      onError: (err: AxiosError<any>) => {
        setError(getApiErrorMessage(err, 'Failed to send verification code.'))
      }
    })
  }

  return (
    <SingleLayout>
      <form
        className="card card-md"
        onSubmit={handleSendCode}
        autoComplete="off"
        noValidate
      >
        <div className="card-body">
          <h2 className="card-title text-center mb-4">2-Step Verification</h2>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Country</label>
            <select 
              className="form-select" 
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
            >
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
              <span className="input-group-text">
                {countryCode.toUpperCase()}
              </span>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter phone number" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="text-secondary">
            Security is critical in Tabler. To help keep your account safe, we'll text you a
            verification code when you sign in on a new device.
          </div>

          <div className="form-footer">
            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={sendCodeMutation.isPending}
            >
              {sendCodeMutation.isPending ? 'Sending...' : 'Send code'}
            </button>
          </div>
        </div>
      </form>
    </SingleLayout>
  )
}
