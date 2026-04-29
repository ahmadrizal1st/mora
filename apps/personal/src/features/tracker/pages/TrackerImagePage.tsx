import { useRef, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import BaseLayout from '@/shared/layouts/BaseLayout';
import { Button, Icon } from '@/shared/components/ui';
import { useUploadDocument } from '../hooks/useTracker';

export default function TrackerImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const uploadMutation = useUploadDocument();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setError(null);
    if (!selected) return;

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(selected.type)) {
      setError('Format tidak didukung. Gunakan JPG, PNG, atau WebP.');
      return;
    }
    if (selected.size > 5 * 1024 * 1024) {
      setError('Ukuran file maksimal 5 MB.');
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      const dt = new DataTransfer();
      dt.items.add(dropped);
      const fakeEvent = { target: { files: dt.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileChange(fakeEvent);
    }
  };

  return (
    <BaseLayout pageTitle="Upload Receipt Image">
      <div className="container-xl py-4">
        <div className="row justify-content-center">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-transparent border-0 pt-4 px-4 px-md-5 d-block">
                <h2 className="card-title h2 fw-bold text-dark mb-0">Upload Receipt</h2>
                <div className="text-secondary small mt-1">
                  Upload foto struk untuk diekstrak otomatis oleh AI
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
                  {preview ? (
                    <div>
                      <img
                        src={preview}
                        alt="Preview"
                        className="img-fluid rounded-2 mb-2"
                        style={{ maxHeight: '240px', objectFit: 'contain' }}
                      />
                      <div className="text-success fw-medium small mt-1">
                        <Icon icon="check" size={14} className="me-1" />
                        {file?.name}
                      </div>
                    </div>
                  ) : (
                    <div className="text-secondary">
                      <Icon icon="photo-up" size={40} className="mb-2 opacity-50" />
                      <div className="fw-medium">Klik atau drag gambar ke sini</div>
                      <div className="small mt-1">JPG, PNG, WebP — Maks. 5 MB</div>
                    </div>
                  )}
                </div>

                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
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
                    text={uploadMutation.isPending ? 'Memproses...' : 'Scan Sekarang'}
                    color="success"
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
                      onClick={() => { setFile(null); setPreview(null); setError(null); }}
                    >
                      Ganti file
                    </button>
                  </div>
                )}

                <div className="mt-4 p-3 bg-light rounded-2 small text-secondary">
                  <div className="fw-bold mb-1">Tips foto yang baik:</div>
                  <ul className="mb-0 ps-3">
                    <li>Pastikan teks struk terlihat jelas</li>
                    <li>Foto di tempat yang cukup cahaya</li>
                    <li>Hindari foto yang blur atau terpotong</li>
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
