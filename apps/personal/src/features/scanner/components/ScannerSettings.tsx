import React from 'react';
import { Select } from '@/shared/components/ui/Select';

interface ScannerSettingsProps {
  isAutoCrop: boolean;
  setIsAutoCrop: (val: boolean) => void;
  cameraFacing: 'environment' | 'user';
  setCameraFacing: (val: 'environment' | 'user') => void;
  outputFormat: 'png' | 'jpeg';
  setOutputFormat: (val: 'png' | 'jpeg') => void;
}

export const ScannerSettings: React.FC<ScannerSettingsProps> = ({
  isAutoCrop,
  setIsAutoCrop,
  cameraFacing,
  setCameraFacing,
  outputFormat,
  setOutputFormat
}) => {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-header border-0 bg-transparent py-2">
        <h3 className="card-title small fw-bold text-uppercase text-muted">Pengaturan</h3>
      </div>
      <div className="list-group list-group-flush">
        <div className="list-group-item bg-transparent py-3">
          <div className="row align-items-center">
            <div className="col">
              <div className="fw-bold">Auto crop</div>
              <div className="text-muted small">Potong otomatis setelah terdeteksi</div>
            </div>
            <div className="col-auto">
              <label className="form-check form-switch m-0">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={isAutoCrop}
                  onChange={(e) => setIsAutoCrop(e.target.checked)}
                />
              </label>
            </div>
          </div>
        </div>
        <div className="list-group-item bg-transparent py-3">
          <div className="row align-items-center">
            <div className="col">
              <div className="fw-bold">Kamera</div>
            </div>
            <div className="col-auto scanner-settings-col">
              <Select
                value={cameraFacing}
                placement="end"
                onChange={(val) => setCameraFacing(val as 'environment' | 'user')}
                options={[
                  { value: 'environment', label: 'Belakang' },
                  { value: 'user', label: 'Depan' }
                ]}
              />
            </div>
          </div>
        </div>
        <div className="list-group-item bg-transparent py-3">
          <div className="row align-items-center">
            <div className="col">
              <div className="fw-bold">Format Output</div>
            </div>
            <div className="col-auto scanner-settings-col">
              <Select
                value={outputFormat}
                placement="end"
                onChange={(val) => setOutputFormat(val as 'png' | 'jpeg')}
                options={[
                  { value: 'png', label: 'PNG' },
                  { value: 'jpeg', label: 'JPEG' }
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
