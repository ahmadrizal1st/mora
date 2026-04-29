import { useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Button, Icon } from '@/shared/components/ui';
import { useUploadDocument } from '../hooks/useTracker';

const ACCEPTED_TYPES: Record<string, string[]> = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'application/msword': ['.doc'],
  'text/csv': ['.csv'],
};

const ACCEPT_ATTR = Object.keys(ACCEPTED_TYPES).join(',');

function getFileIcon(type: string): string {
  if (type === 'application/pdf') return 'file-type-pdf';
  if (type.includes('word')) return 'file-type-docx';
  if (type.includes('sheet') || type === 'text/csv') return 'file-type-xls';
  return 'file-description';
}

export default function TrackerFilePage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const uploadMutation = useUploadDocument();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setError(null);
    if (!selected) return;

    if (!Object.keys(ACCEPTED_TYPES).includes(selected.type)) {
      setError('Format tidak didukung. Gunakan PDF, DOCX, XLSX, atau CSV.');
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError('Ukuran file maksimal 10 MB.');
      return;
    }

    setFile(selected);
  };

  const handleProcess = async () => {
    if (!file) return;
    setError(null);
    try {
      await uploadMutation.mutateAsync({ file, docType: 'expense' });
      navigate({ to: '/transactions' });
    } catch {
      setError('Gagal memproses dokumen. Silakan coba lagi.');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      const dt = new DataTransfer();
      dt.items.add(dropped);
      handleFileChange({ target: { files: dt.files } } as unknown as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <BaseLayout pageTitle="Upload Document">
      <div className="container-xl py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-transparent border-0 pt-4 px-4 px-md-5 d-block">
                <h2 className="card-title h2 fw-bold text-dark mb-0">Upload Invoice / Statement</h2>
                <div className="text-secondary small mt-1">
                  Import PDF atau dokumen untuk diekstrak data transaksinya
                </div>
              </div>

              <div className="card-body p-4 p-md-5">
                {/* Drop zone */}
                <div
                  className="mb-4 border border-2 rounded-3 text-center py-5 px-3"
                  style={{
                    borderStyle: 'dashed',
                    borderColor: file ? '#2fb344' : '#dee2e6',
                    backgroundColor: file ? '#f4faf5' : '#f8f9fa',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => inputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  {file ? (
                    <div className="d-flex align-items-center justify-content-center gap-3">
                      <Icon icon={getFileIcon(file.type)} size={40} className="text-success" />
                      <div className="text-start">
                        <div className="fw-medium text-dark">{file.name}</div>
                        <div className="text-secondary small">{formatSize(file.size)}</div>
                        <div className="text-success small">
                          <Icon icon="check" size={12} className="me-1" />
                          File siap diproses
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-secondary">
                      <Icon icon="file-upload" size={40} className="mb-2 opacity-50" />
                      <div className="fw-medium">Klik atau drag file ke sini</div>
                      <div className="small mt-1">PDF, DOCX, XLSX, CSV — Maks. 10 MB</div>
                    </div>
                  )}
                </div>

                <input
                  ref={inputRef}
                  type="file"
                  accept={ACCEPT_ATTR}
                  className="d-none"
                  onChange={handleFileChange}
                />

                {error && (
                  <div className="alert alert-danger py-2 px-3 mb-3 small">{error}</div>
                )}

                {uploadMutation.isSuccess && (
                  <div className="alert alert-success py-2 px-3 mb-3 small">
                    <Icon icon="check" size={14} className="me-1" />
                    Berhasil! Transaksi sedang diproses AI dan akan muncul di daftar transaksi.
                  </div>
                )}

                <div className="d-grid">
                  <Button
                    text={uploadMutation.isPending ? 'Memproses Dokumen...' : 'Import Data'}
                    color="danger"
                    size="lg"
                    loading={uploadMutation.isPending}
                    disabled={!file || uploadMutation.isPending}
                    onClick={handleProcess}
                  />
                </div>

                {file && !uploadMutation.isPending && (
                  <div className="text-center mt-2">
                    <button
                      className="btn btn-link text-secondary small p-0"
                      onClick={() => { setFile(null); setError(null); }}
                    >
                      Ganti file
                    </button>
                  </div>
                )}

                <div className="mt-4 p-3 bg-light rounded-2 small text-secondary">
                  <div className="fw-bold mb-1">Format yang didukung:</div>
                  <ul className="mb-0 ps-3">
                    <li>Digital PDF (Invoice, tagihan)</li>
                    <li>E-Statement Bank (DOCX, PDF)</li>
                    <li>Excel / CSV export</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
