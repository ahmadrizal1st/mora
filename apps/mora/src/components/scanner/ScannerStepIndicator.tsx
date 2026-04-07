import React from 'react';

interface ScannerStepIndicatorProps {
  step: number;
}

export const ScannerStepIndicator: React.FC<ScannerStepIndicatorProps> = ({ step }) => {
  return (
    <div className="card mb-3 border-0 shadow-sm overflow-hidden">
      <div className="card-body p-4" style={{ border: 'none' }}>
        <div className="d-flex justify-content-between align-items-center position-relative" style={{ minHeight: '40px', border: 'none' }}>
          {/* Connecting Line */}
          <div 
            style={{ 
              position: 'absolute', 
              top: '6px', 
              left: '16.66%', 
              right: '16.66%', 
              height: '2px', 
              background: '#e6e7e9',
              zIndex: 0
            }} 
          />
          
          {/* Steps */}
          {[
            { label: 'Scan', id: 1 },
            { label: 'Sesuaikan', id: 2 },
            { label: 'Hasil', id: 3 }
          ].map((s) => (
            <div key={s.id} className="d-flex flex-column align-items-center flex-fill" style={{ zIndex: 1, border: 'none' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                background: step === s.id ? '#f76707' : step > s.id ? '#2fb344' : '#e6e7e9',
                marginBottom: '8px',
                transition: 'all 0.3s ease',
                boxShadow: step === s.id ? '0 0 0 3px rgba(247, 103, 7, 0.2)' : 'none',
                border: 'none'
              }} />
              <span style={{ 
                fontSize: '12px', 
                fontWeight: step === s.id ? '600' : '500',
                color: step === s.id ? '#1d273b' : '#6c7a91',
                transition: 'all 0.3s ease'
              }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
