import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Button, Icon, Dropzone } from '@/shared/components/ui';
import { useUploadDocument } from '../hooks/useTracker';

export default function TrackerFilePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const uploadMutation = useUploadDocument();

  const handleProcess = async () => {
    if (files.length === 0) return;
    setError(null);
    try {
      // Parallel upload all files
      await Promise.all(
        files.map(file => uploadMutation.mutateAsync({ file, docType: 'expense' }))
      );
      navigate({ to: '/transactions' });
    } catch {
      setError('Gagal memproses dokumen. Silakan coba lagi.');
    }
  };

  return (
    <BaseLayout
      pageTitle="Import Document"
      pageDescription="Import laporan bank, invoice, atau dokumen lainnya untuk dianalisis oleh AI."
    >
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <h3 className="card-title">Upload Invoice / Statement</h3>
            </div>
            <div className="card-body">
              <Dropzone
                className="mb-4"
                text="Klik atau drag file ke sini"
                description="PDF, DOCX, XLSX, CSV — Maks. 10 MB"
                acceptedFiles=".pdf,.docx,.xlsx,.csv,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
                onAddedFile={(f) => setFiles(prev => [...prev, f])}
                multiple
                custom
              />

              {files.length > 0 && (
                <div className="mb-4">
                  <div className="text-muted small mb-2">{files.length} file dipilih:</div>
                  <div className="list-group list-group-flush border rounded">
                    {files.map((f, i) => (
                      <div key={i} className="list-group-item d-flex justify-content-between align-items-center py-2">
                        <div className="d-flex align-items-center">
                          <Icon icon="file-description" size={16} className="text-secondary me-2" />
                          <span className="small text-truncate" style={{ maxWidth: '200px' }}>{f.name}</span>
                        </div>
                        <span className="badge bg-light text-dark fw-normal">{(f.size / 1024).toFixed(0)} KB</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  <div className="d-flex">
                    <div><Icon icon="alert-circle" className="alert-icon me-2" /></div>
                    <div>{error}</div>
                  </div>
                </div>
              )}

              {uploadMutation.isSuccess && (
                <div className="alert alert-success" role="alert">
                  <div className="d-flex">
                    <div><Icon icon="check" className="alert-icon me-2" /></div>
                    <div>Berhasil! Dokumen sedang dianalisis.</div>
                  </div>
                </div>
              )}
            </div>
            <div className="card-footer text-end">
              <div className="btn-list">
                <Button
                  text={uploadMutation.isPending ? 'Menganalisis...' : `Import ${files.length} File`}
                  color="primary"
                  loading={uploadMutation.isPending}
                  disabled={files.length === 0 || uploadMutation.isPending}
                  onClick={handleProcess}
                />
              </div>
            </div>
          </div>

          <div className="card mt-4 bg-light border-0">
            <div className="card-body">
              <h4 className="card-title mb-3">Format yang didukung</h4>
              <div className="row g-3">
                <div className="col-6">
                  <div className="d-flex align-items-center mb-2">
                    <Icon icon="file-type-pdf" size={18} className="text-danger me-2" />
                    <span className="small text-secondary">Digital PDF (Invoice, E-Statement)</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <Icon icon="file-type-docx" size={18} className="text-primary me-2" />
                    <span className="small text-secondary">Microsoft Word (DOCX, DOC)</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center mb-2">
                    <Icon icon="file-type-xls" size={18} className="text-success me-2" />
                    <span className="small text-secondary">Excel / Spreadsheet (XLSX)</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <Icon icon="file-type-csv" size={18} className="text-warning me-2" />
                    <span className="small text-secondary">Comma Separated Values (CSV)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
