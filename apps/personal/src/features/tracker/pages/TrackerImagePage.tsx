import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { Button, Icon, Dropzone } from '@/shared/components/ui'

import { getApiErrorMessage } from '@/shared/utils/errorUtils'

export default function TrackerImagePage() {
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const uploadMutation: any = { mutateAsync: async (_data: any) => { throw new Error('Fitur OCR belum didukung.') } }

  const handleProcess = async () => {
    if (files.length === 0) return
    setError(null)
    try {
      await Promise.all(
        files.map((file) => uploadMutation.mutateAsync({ file, docType: 'expense' }))
      )

      navigate({ to: '/transactions' })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Gagal mengunggah gambar. Silakan coba lagi.'))
    }
  }

  return (
    <BaseLayout
      pageTitle="Scan Receipt"
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
                acceptedFiles="image/jpeg,image/png,image/webp"
                onAddedFile={(f) => setFiles((prev) => [...prev, f])}
                multiple
                custom
              />

              {files.length > 0 && (
                <div className="mb-4">
                  <div className="text-muted small mb-2">{files.length} gambar dipilih:</div>
                  <div className="list-group list-group-flush border rounded">
                    {files.map((f, i) => (
                      <div
                        key={i}
                        className="list-group-item d-flex justify-content-between align-items-center py-2"
                      >
                        <div className="d-flex align-items-center">
                          <Icon icon="photo" size={16} className="text-secondary me-2" />
                          <span className="small text-truncate" style={{ maxWidth: '200px' }}>
                            {f.name}
                          </span>
                        </div>
                        <span className="badge bg-light text-dark fw-normal">
                          {(f.size / 1024).toFixed(0)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  <div className="d-flex">
                    <div>
                      <Icon icon="alert-circle" className="alert-icon me-2" />
                    </div>
                    <div>{error}</div>
                  </div>
                </div>
              )}

              {uploadMutation.isSuccess && (
                <div className="alert alert-success" role="alert">
                  <div className="d-flex">
                    <div>
                      <Icon icon="check" className="alert-icon me-2" />
                    </div>
                    <div>Berhasil! Transaksi sedang diproses AI.</div>
                  </div>
                </div>
              )}
            </div>
            <div className="card-footer text-end">
              <div className="btn-list">
                <Button
                  text={
                    uploadMutation.isPending ? 'Mengekstrak Teks...' : `Scan ${files.length} Gambar`
                  }
                  color="primary"
                  loading={uploadMutation.isPending}
                  disabled={files.length === 0 || uploadMutation.isPending}
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
  )
}
