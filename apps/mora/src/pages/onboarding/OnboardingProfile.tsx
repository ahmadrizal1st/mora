import { useState } from 'react'
import SingleLayout from '../../layouts/SingleLayout'
import { AvatarUpload } from '../../components/ui/AvatarUpload'
import { Button } from '../../components/ui/Button'
import { Progress } from '../../components/ui/Progress'
import { Datepicker } from '../../components/ui/Datepicker'

export default function OnboardingProfile() {
  const [previewImage, setPreviewImage] = useState<string | undefined>()

  const handleFileChange = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <SingleLayout containerSize="tight" centered={false}>
      <div className="card card-md shadow-sm border-0 mb-4">
        <div className="card-body p-4 p-md-5">
          <div className="mb-4">
            <div className="row align-items-center g-3">
              <div className="col">
                <h2 className="mb-1 h1 text-primary">Lengkapi Profil</h2>
                <p className="text-secondary small mb-0">Langkah 2 dari 5</p>
              </div>
              <div className="col-auto">
                <div className="text-secondary small mb-1">Progress 25%</div>
                <Progress value={25} size="sm" color="primary" />
              </div>
            </div>
          </div>

          <div className="text-center mb-4">
            <div className="mb-3">
              <AvatarUpload 
                size="xl" 
                className="mx-auto" 
                onChange={handleFileChange}
                src={previewImage}
              />
            </div>
            <div className="text-secondary small">Klik foto untuk mengunggah atau mengganti foto profil</div>
          </div>

          <form>
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-6">
                <label className="form-label required">Nama Depan</label>
                <input type="text" className="form-control" placeholder="Contoh: Budi" />
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label required">Nama Belakang</label>
                <input type="text" className="form-control" placeholder="Contoh: Santoso" />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label required">Tanggal Lahir</label>
              <Datepicker layout="icon" id="birth-date" placeholder="Pilih tanggal lahir" />
              <div className="form-hint small text-secondary">Data ini diperlukan untuk menyesuaikan rekomendasi investasi Anda.</div>
            </div>

            <div className="mt-5">
              <div className="row g-2">
                <div className="col">
                  <Button text="Kembali" href="/onboarding" className="w-100" />
                </div>
                <div className="col">
                  <Button text="Lanjut" color="primary" iconEnd="arrow-right" href="/onboarding/risk-profile" className="w-100" />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </SingleLayout>
  )
}
