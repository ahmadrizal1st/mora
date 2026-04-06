import { useState, useRef } from 'react'
import SingleLayout from '../../layouts/SingleLayout'
import { Button } from '../../components/ui/Button'
import { Progress } from '../../components/ui/Progress'
import { Icon } from '../../components/ui/Icon'

export default function OnboardingConnectBank() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const providers = [
    { id: 'bca', name: 'BCA', logo: 'building-bank', color: 'blue', app: 'm-BCA', category: 'Bank' },
    { id: 'mandiri', name: 'Mandiri', logo: 'building-bank', color: 'orange', app: 'Livin\' by Mandiri', category: 'Bank' },
    { id: 'bni', name: 'BNI', logo: 'building-bank', color: 'orange', app: 'BNI Mobile', category: 'Bank' },
    { id: 'bri', name: 'BRI', logo: 'building-bank', color: 'blue', app: 'BRIMO', category: 'Bank' },
    { id: 'cimb', name: 'CIMB', logo: 'building-bank', color: 'red', app: 'OCTO Mobile', category: 'Bank' },
    { id: 'gopay', name: 'GoPay', logo: 'wallet', color: 'green', app: 'Aplikasi Go-Jek', category: 'E-Wallet' },
    { id: 'ovo', name: 'OVO', logo: 'wallet', color: 'purple', app: 'Aplikasi OVO', category: 'E-Wallet' },
    { id: 'dana', name: 'Dana', logo: 'wallet', color: 'blue', app: 'Aplikasi Dana', category: 'E-Wallet' },
    { id: 'shopeepay', name: 'ShopeePay', logo: 'wallet', color: 'orange', app: 'Aplikasi Shopee', category: 'E-Wallet' },
    { id: 'others', name: 'Lainnya', logo: 'dots', color: 'secondary', app: 'Aplikasi Keuangan', category: 'Lainnya' },
  ]

  const currentProvider = providers.find(p => p.id === selectedProvider)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  const renderProviderGrid = (category: string) => (
    <div className="row row-cards g-3 form-selectgroup form-selectgroup-boxes mb-4">
      {providers.filter(p => p.category === category).map((provider) => (
        <div key={provider.id} className="col-6 col-md-4">
          <label className="form-selectgroup-item w-100 h-100">
            <input 
              type="radio" 
              name="provider" 
              value={provider.id} 
              className="form-selectgroup-input" 
              onChange={() => setSelectedProvider(provider.id)}
            />
            <span className="form-selectgroup-label d-flex flex-column align-items-center p-3 h-100 rounded-3">
              <span className={`avatar avatar-md bg-${provider.color}-lt mb-2 text-${provider.color} rounded-3 flex-shrink-0`}>
                <Icon icon={provider.logo} />
              </span>
              <span className="strong d-block text-center mb-0">{provider.name}</span>
            </span>
          </label>
        </div>
      ))}
    </div>
  )

  return (
    <SingleLayout containerSize="tight" centered={false}>
      <div className="card card-md shadow-sm border-0 mb-4">
        <div className="card-body p-4 p-md-5">
          <div className="mb-5">
            <div className="row align-items-center g-3">
              <div className="col">
                <h2 className="mb-1 h1 text-primary">Import Data Transaksi</h2>
                <p className="text-secondary mb-0">Langkah 5 dari 5 • Langkah terakhir!</p>
              </div>
              <div className="col-auto">
                <div className="text-secondary small mb-1 text-end">Progress 100%</div>
                <Progress value={100} size="sm" color="success" />
              </div>
            </div>
          </div>

          {!selectedProvider ? (
            <>
              <div className="mb-4 text-center">
                <div className="avatar avatar-xl bg-blue-lt text-blue mb-3 rounded-3">
                  <Icon icon="upload" />
                </div>
                <h3>Pilih Sumber Transaksi</h3>
                <p className="text-secondary">
                  Pilih bank atau e-wallet yang Anda gunakan untuk melihat panduan import transaksi secara manual.
                </p>
              </div>

              <div className="mb-4">
                <h4 className="card-title mb-3">Bank Terpilih</h4>
                {renderProviderGrid('Bank')}
              </div>

              <div className="mb-4">
                <h4 className="card-title mb-3">E-Wallet & Lainnya</h4>
                <div className="row row-cards g-3 form-selectgroup form-selectgroup-boxes mb-4">
                  {providers.filter(p => p.category === 'E-Wallet' || p.category === 'Lainnya').map((provider) => (
                    <div key={provider.id} className="col-6 col-md-4">
                      <label className="form-selectgroup-item w-100 h-100">
                        <input 
                          type="radio" 
                          name="provider" 
                          value={provider.id} 
                          className="form-selectgroup-input" 
                          onChange={() => setSelectedProvider(provider.id)}
                        />
                        <span className="form-selectgroup-label d-flex flex-column align-items-center p-3 h-100 rounded-3">
                          <span className={`avatar avatar-md bg-${provider.color}-lt mb-2 text-${provider.color} rounded-3 flex-shrink-0`}>
                            <Icon icon={provider.logo} />
                          </span>
                          <span className="strong d-block text-center mb-0">{provider.name}</span>
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="alert alert-info bg-info-lt border-0 rounded-3 mt-5">
                <div className="d-flex">
                  <div className="me-3 text-info">
                    <Icon icon="info-circle" />
                  </div>
                  <div>
                    <p className="mb-0 small">
                      <strong>Privasi Terjamin:</strong> Data yang Anda unggah hanya digunakan untuk analisis keuangan pribadi Anda di Mora. Kami tidak pernah membagikan data Anda dengan pihak ketiga.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-5">
                <div className="d-flex align-items-center mb-4">
                  <span className={`avatar avatar-md bg-${currentProvider?.color}-lt me-3 text-${currentProvider?.color} rounded-3`}>
                    <Icon icon={currentProvider?.logo || 'building-bank'} />
                  </span>
                  <div>
                    <h3 className="mb-0">Panduan Import {currentProvider?.name}</h3>
                    <p className="text-secondary small">Ikuti 4 langkah mudah di bawah ini untuk memulai.</p>
                  </div>
                </div>

                <div className="steps steps-counter steps-vertical">
                  <div className="step-item">
                    <div className="h4 mb-1 text-primary">Buka Aplikasi {currentProvider?.app}</div>
                    <p className="text-secondary small">Pastikan Anda masuk ke akun yang ingin Anda track transaksinya.</p>
                  </div>
                  <div className="step-item">
                    <div className="h4 mb-1 text-primary">Pilih Menu Riwayat / Mutasi</div>
                    <p className="text-secondary small">Cari riwayat transaksi dalam rentang waktu yang diinginkan.</p>
                  </div>
                  <div className="step-item">
                    <div className="h4 mb-1 text-primary">Export/Download ke PDF atau Excel</div>
                    <p className="text-secondary small">Pilih format PDF, XLSX, XLS, atau CSV jika tersedia di aplikasi.</p>
                  </div>
                  <div className="step-item">
                    <div className="h4 mb-1 text-primary">Upload File Anda di Bawah Ini</div>
                    <p className="text-secondary small text-danger font-weight-bold">Sistem Mora akan otomatis merapikan data keuangan Anda.</p>
                  </div>
                </div>
              </div>

              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="d-none" 
                accept=".pdf,.xlsx,.xls,.csv"
              />

              <div 
                className={`card card-dashed bg-light-subtle cursor-pointer transition-all hover-shadow-sm mb-4 rounded-3 ${uploadedFile ? 'border-success' : ''}`}
                onClick={triggerFileUpload}
              >
                <div className="card-body text-center py-4">
                  <div className={`avatar avatar-md mb-3 rounded-3 ${uploadedFile ? 'bg-success-lt text-success' : 'bg-primary-lt text-primary'}`}>
                    <Icon icon={uploadedFile ? 'check' : 'upload'} />
                  </div>
                  {uploadedFile ? (
                    <div>
                      <div className="strong text-success">{uploadedFile.name}</div>
                      <div className="small text-secondary">File siap di-import. Ingin ganti? Klik di sini.</div>
                    </div>
                  ) : (
                    <div>
                      <div className="strong">Pilih File Mutasi / e-Statement</div>
                      <div className="small text-secondary">Mendukung format PDF, XLSX, XLS, atau CSV</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <Button 
                  text="Kembali Pilih Sumber Lain" 
                  link={true} 
                  icon="arrow-left" 
                  onClick={() => { setSelectedProvider(null); setUploadedFile(null); }}
                  className="px-0"
                />
              </div>
            </>
          )}

          <div className="mt-5 border-top pt-4">
            {!selectedProvider ? (
              <Button text="Lewati Saja" href="/dashboard" block={true} />
            ) : (
              <Button 
                text="Selesai" 
                color="primary" 
                href="/dashboard" 
                block={true}
                disabled={!uploadedFile}
              />
            )}
          </div>
        </div>
      </div>
    </SingleLayout>
  )
}
