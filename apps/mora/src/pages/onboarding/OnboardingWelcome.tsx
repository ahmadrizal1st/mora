// src/pages/onboarding/OnboardingWelcome.tsx
import SingleLayout from '../../layouts/SingleLayout'
import { Illustration } from '../../components/ui/Illustration'
import { Button } from '../../components/ui/Button'
import { Progress } from '../../components/ui/Progress'

export default function OnboardingWelcome() {
  return (
    <SingleLayout containerSize="tight">
      <div className="card card-md">
        <div className="card-body text-center py-4 p-sm-5">
          <Illustration image="welcome-on-board" height={200} className="mb-n2" />
          <h1 className="mt-5">Selamat Datang di Mora!</h1>
          <p className="text-secondary">
            Kami siap menemani perjalanan finansial Anda. Mari atur profil dan tujuan keuangan Anda hanya dalam beberapa langkah mudah.
          </p>
        </div>
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-12 col-md-4 mb-3 mb-md-0">
              <div className="d-flex align-items-center">
                <span className="text-secondary me-2">Progress 0%</span>
                <div className="flex-fill">
                  <Progress value={0} size="sm" />
                </div>
              </div>
            </div>
            <div className="col-12 col-md-8">
              <div className="btn-list justify-content-end">
                <Button 
                  text="Mulai Sekarang" 
                  color="primary" 
                  icon="arrow-right" 
                  href="/onboarding/profile" 
                  className="w-100 w-md-auto" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-secondary mt-3">
        Sudah punya akun? <a href="/sign-in" className="text-primary">Masuk di sini</a>
      </div>
    </SingleLayout>
  )
}
