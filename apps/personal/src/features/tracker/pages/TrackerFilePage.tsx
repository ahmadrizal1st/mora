import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import BaseLayout from '@/shared/layouts/BaseLayout'
import { Button, Icon, Dropzone } from '@/shared/components/ui'
import { useMutation } from '@tanstack/react-query'
import { TrackerService } from '../services/tracker.service'

import { getApiErrorMessage } from '@/shared/utils/errorUtils'

export default function TrackerFilePage() {
  const [files, setFiles] = useState<File[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const navigate = useNavigate()
  const uploadMutation = useMutation({
    mutationFn: async (data: { file: File; extractionType: string }) => {
      return TrackerService.uploadDocument(data.file, data.extractionType)
    }
  })

  const handleProcess = async () => {
    if (files.length === 0) return
    setError(null)
    setIsProcessing(true)
    try {
      await Promise.all(
        files.map((file) => uploadMutation.mutateAsync({ file, extractionType: 'expense' }))
      )

      setSuccessMessage('File sedang diproses! Anda akan mendapatkan notifikasi ketika transaksi siap.')
      setFiles([])
      
      // Redirect ke halaman notifikasi atau transaksi setelah 3 detik
      setTimeout(() => {
        navigate({ to: '/notifications' })
      }, 3000)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Gagal mengunggah dokumen. Silakan coba lagi.'))
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <BaseLayout
      pageTitle="Upload Document"
      pageDescription="Unggah dokumen seperti PDF invoice atau rekening bank. AI akan mengekstrak detail transaksi secara otomatis."
    >
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header">
              <h3 className="card-title">Upload Dokumen</h3>
            </div>
            <div className="card-body">
              <Dropzone
                className="mb-4"
                text="Klik atau drag dokumen ke sini"
                description="PDF, DOC, DOCX, TXT — Maks. 10 MB"
                acceptedFiles="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                onAddedFile={(f) => setFiles((prev) => [...prev, f])}
                multiple
                custom
              />

              {files.length > 0 && (
                <div className="mb-4">
                  <div className="text-muted small mb-2">{files.length} dokumen dipilih:</div>
                  <div className="list-group list-group-flush border rounded">
                    {files.map((f, i) => (
                      <div
                        key={i}
                        className="list-group-item d-flex justify-content-between align-items-center py-2"
                      >
                        <div className="d-flex align-items-center">
                          <Icon icon="file-description" size={16} className="text-secondary me-2" />
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

              {successMessage && (
                <div className="alert alert-success" role="alert">
                  <div className="d-flex">
                    <div>
                      <Icon icon="check" className="alert-icon me-2" />
                    </div>
                    <div>{successMessage}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="card-footer text-end">
              <div className="btn-list">
                <Button
                  text={
                    isProcessing ? 'Mengekstrak Teks...' : `Proses ${files.length} Dokumen`
                  }
                  color="primary"
                  loading={isProcessing}
                  disabled={files.length === 0 || isProcessing}
                  onClick={handleProcess}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
