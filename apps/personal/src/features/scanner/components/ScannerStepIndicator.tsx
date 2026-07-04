import React from 'react'

interface ScannerStepIndicatorProps {
  step: number
}

export const ScannerStepIndicator: React.FC<ScannerStepIndicatorProps> = ({ step }) => {
  return (
    <div className="card mb-3 border-0 shadow-sm overflow-hidden">
      <div className="card-body p-4 border-0">
        <div className="d-flex justify-content-between align-items-center position-relative scanner-step-wrapper border-0">
          <div className="scanner-step-line" />

          {[
            { label: 'Scan', id: 1 },
            { label: 'Sesuaikan', id: 2 },
            { label: 'Hasil', id: 3 },
          ].map((s) => (
            <div
              key={s.id}
              className="d-flex flex-column align-items-center flex-fill scanner-step-node-wrapper border-0"
            >
              <div
                className={`scanner-step-node ${step === s.id ? 'active' : step > s.id ? 'done' : 'pending'}`}
              />
              <span className={`scanner-step-label ${step === s.id ? 'active' : 'inactive'}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
