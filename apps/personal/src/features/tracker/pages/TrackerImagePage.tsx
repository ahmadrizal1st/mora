import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Button, Icon, Dropzone } from '@/shared/components/ui';
import { useUploadDocument } from '../hooks/useTracker';

export default function TrackerImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const uploadMutation = useUploadDocument();

  const handleProcess = async () => {
    if (!file) return;
    setError(null);
    try {
      await uploadMutation.mutateAsync({ file, docType: 'expense' });
      navigate({ to: '/transactions' });
    } catch {
      setError('Gagal memproses gambar. Silakan coba lagi.');
    }
  };

  return (
    <BaseLayout
      pageTitle="Scan Receipt"
      pagePretitle="OCR Tracking"
      pageDescription="Upload foto struk belanja Anda. AI akan mengekstrak detail transaksi secara otomatis."
    >
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <h3 className="card-title">Upload Receipt Image</h3>
            </div>
            <div className="card-body">
              <Dropzone
                className="mb-4"
                text="Klik atau drag gambar ke sini"
                description="JPG, PNG, WebP — Maks. 5 MB"
                onAddedFile={(f) => setFile(f)}
                custom
              />

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
                    <div>Berhasil! Transaksi sedang diproses AI.</div>
                  </div>
                </div>
              )}
            </div>
            <div className="card-footer text-end">
              <div className="btn-list">
                <Button
                  text={uploadMutation.isPending ? 'Mengekstrak Teks...' : 'Scan Sekarang'}
                  color="primary"
                  loading={uploadMutation.isPending}
                  disabled={!file || uploadMutation.isPending}
                  onClick={handleProcess}
                />
              </div>
            </div>
          </div>

          <div className="row mt-4 g-3">
            <div className="col-md-4">
              <div className="card card-sm bg-light border-0">
                <div className="card-body text-center">
                  <Icon icon="bulb" className="text-warning mb-2" size={24} />
                  <div className="fw-medium small">Cahaya Cukup</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-sm bg-light border-0">
                <div className="card-body text-center">
                  <Icon icon="focus-2" className="text-info mb-2" size={24} />
                  <div className="fw-medium small">Teks Terlihat Jelas</div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card card-sm bg-light border-0">
                <div className="card-body text-center">
                  <Icon icon="crop" className="text-danger mb-2" size={24} />
                  <div className="fw-medium small">Tidak Terpotong</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
