import BaseLayout from '../layouts/BaseLayout'
import { Badge } from '../components/ui'

export default function LogsPage() {
  const previewUrl = 'https://preview.tabler.io'

  return (
    <BaseLayout pageTitle="Logs">
      <div className="container-xl">
        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <h4 className="fw-bold mb-3">Checked URL</h4>
                <div className="mb-4">
                  <pre className="bg-dark text-white p-3 rounded-3 mb-0">
                    <code>
                      GET <a className="text-reset" target="_blank" href={previewUrl} rel="noreferrer">{previewUrl}</a>
                    </code>
                  </pre>
                </div>

                <h4 className="fw-bold mb-3">Request Timing</h4>
                <div className="mb-4">
                  <pre className="bg-dark text-white p-3 rounded-3 mb-0" style={{ fontFamily: 'monospace', lineHeight: '1.6' }}>
                    <code>
                      Effective URL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a className="text-reset" target="_blank" href={previewUrl} rel="noreferrer">{previewUrl}</a><br />
                      Redirect count&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br />
                      Name lookup time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.4e-05<br />
                      Connect time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.000521<br />
                      Pre-transfer time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.0<br />
                      Start-transfer time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.0<br />
                      App connect time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.0<br />
                      Redirect time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0.0<br />
                      Total time&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;28.000601<br />
                      Response code&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0<br />
                      Return keyword&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;operation_timedout
                    </code>
                  </pre>
                </div>

                <h4 className="fw-bold mb-3">Response Headers</h4>
                <div className="mb-0">
                  <pre className="bg-dark text-white p-3 rounded-3 mb-0">
                    <code>HTTP/1.1 200 Connection established</code>
                  </pre>
                </div>
              </div>
              <div className="card-footer bg-transparent border-top-light pt-0">
                <h4 className="fw-bold mb-1">Escalation</h4>
                <div className="text-secondary small">Entire team</div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body">
                <h4 className="fw-bold mb-3">Application Log</h4>
                <div className="mb-4">
                  <pre className="bg-dark text-white p-3 rounded-3 mb-0" style={{ fontFamily: 'monospace', lineHeight: '1.6' }}>
                    <code>
                      2024-01-15 14:23:45 [INFO] Application started successfully<br />
                      2024-01-15 14:23:46 [DEBUG] Database connection established<br />
                      2024-01-15 14:23:47 [INFO] User authentication successful: user_id=12345<br />
                      2024-01-15 14:23:48 [WARNING] Rate limit approaching: 85% of quota used<br />
                      2024-01-15 14:23:49 [ERROR] Failed to process payment: transaction_id=tx_789<br />
                      2024-01-15 14:23:50 [INFO] Cache cleared: keys=1523<br />
                      2024-01-15 14:23:51 [DEBUG] API request completed: endpoint=/api/users, duration=234ms
                    </code>
                  </pre>
                </div>

                <div className="mb-4">
                  <h4 className="fw-bold mb-2">Log Levels</h4>
                  <div className="d-flex flex-wrap gap-2">
                    <Badge text="INFO" color="green" />
                    <Badge text="WARNING" color="yellow" />
                    <Badge text="ERROR" color="secondary" light />
                    <Badge text="DEBUG" color="secondary" light />
                  </div>
                </div>
              </div>
              <div className="card-footer bg-transparent border-top-light pt-0">
                <h4 className="fw-bold mb-1">Log Source</h4>
                <div className="text-secondary small">Application Server (prod-01)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
