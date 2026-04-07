import React from 'react';

interface ScannerStatusAlertProps {
  statusType: 'ok' | 'warn' | 'error' | '';
  statusMsg: string;
  autoCropTimeLeft: number | null;
}

export const ScannerStatusAlert: React.FC<ScannerStatusAlertProps> = ({ 
  statusType, 
  statusMsg, 
  autoCropTimeLeft 
}) => {
  return (
    <div
      className={`alert mb-3 ${statusType === 'ok' ? 'alert-success' :
          statusType === 'warn' ? 'alert-warning' :
            statusType === 'error' ? 'alert-danger' : 'alert-info'
        }`}
    >
      <div className="d-flex align-items-center">
        <div
          className={`status status-dot ${statusType ? 'status-pulse' : ''} me-2 ${statusType === 'ok' ? 'bg-primary' :
              statusType === 'warn' ? 'bg-warning' :
                statusType === 'error' ? 'bg-danger' : 'bg-info'
            }`}
        />
        <div className="small fw-medium">{statusMsg}</div>
      </div>
      {autoCropTimeLeft !== null && (
        <div className="progress progress-xs mt-2" style={{ height: '4px' }}>
          <div
            className="progress-bar bg-primary"
            style={{ width: `${(autoCropTimeLeft / 3) * 100}%`, transition: 'width 1s linear' }}
          />
        </div>
      )}
    </div>
  );
};
