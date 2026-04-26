import React from 'react';

interface ScannerStatusAlertProps {
  statusType: 'ok' | 'warn' | 'error' | '';
  statusMsg: string;
  autoCropTimeLeft: number | null;
}
export const ScannerStatusAlert: React.FC<ScannerStatusAlertProps> = ({ 
  statusType, 
  statusMsg 
}) => {
  return (
    <div
      className={`alert m-0 ${statusType === 'ok' ? 'alert-success' :
          statusType === 'warn' ? 'alert-warning' :
            statusType === 'error' ? 'alert-danger' : 'alert-info'
        }`}
      style={{ padding: '0.75rem 1rem' }}
    >
      <div className="d-flex align-items-center overflow-hidden" title={statusMsg}>
        <div
          className={`status status-dot ${statusType ? 'status-pulse' : ''} me-2 flex-shrink-0 ${statusType === 'ok' ? 'bg-primary' :
              statusType === 'warn' ? 'bg-warning' :
                statusType === 'error' ? 'bg-danger' : 'bg-info'
            }`}
        />
        <div className="small fw-medium text-truncate flex-grow-1">{statusMsg}</div>
      </div>
    </div>
  );
};
