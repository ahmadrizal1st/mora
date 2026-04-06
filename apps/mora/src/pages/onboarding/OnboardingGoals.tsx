// src/pages/onboarding/OnboardingGoals.tsx
import SingleLayout from '../../layouts/SingleLayout'
import { Button } from '../../components/ui/Button'
import { Progress } from '../../components/ui/Progress'
import { Icon } from '../../components/ui/Icon'

export default function OnboardingGoals() {
  const goals = [
    { id: 'emergency', title: 'Dana Darurat', description: 'Simpanan untuk keadaan mendesak', icon: 'lifebuoy', color: 'red' },
    { id: 'retirement', title: 'Pensiun', description: 'Menyiapkan masa tua yang nyaman', icon: 'beach', color: 'orange' },
    { id: 'home', title: 'Beli Rumah', description: 'Wujudkan hunian impian Anda', icon: 'home', color: 'blue' },
    { id: 'education', title: 'Pendidikan', description: 'Dana sekolah untuk masa depan', icon: 'school', color: 'green' },
    { id: 'travel', title: 'Liburan', description: 'Jelajahi tempat baru tanpa utang', icon: 'plane', color: 'azure' },
    { id: 'wedding', title: 'Pernikahan', description: 'Momen berharga yang terencana', icon: 'heart', color: 'pink' },
  ]

  return (
    <SingleLayout containerSize="tight" centered={false}>
      <div className="card card-md shadow-sm border-0 mb-4">
        <div className="card-body p-4 p-md-5">
          <div className="mb-5">
            <div className="row align-items-center g-3">
              <div className="col">
                <h2 className="mb-1 h1 text-primary">Tujuan Keuangan</h2>
                <p className="text-secondary mb-0">Langkah 4 dari 5 • Apa yang ingin Anda capai?</p>
              </div>
              <div className="col-auto">
                <div className="text-secondary small mb-1 text-end">Progress 75%</div>
                <Progress value={75} size="sm" color="primary" />
              </div>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-secondary fs-3">
              Pilih satu atau beberapa tujuan keuangan yang ingin Anda capai. Kami akan membantu Anda membuat rencana untuk mewujudkannya.
            </p>
          </div>

          <div className="row row-cards g-3 form-selectgroup form-selectgroup-boxes">
            {goals.map((goal) => (
              <div key={goal.id} className="col-12 col-md-6">
                <label className="form-selectgroup-item w-100 h-100">
                  <input type="checkbox" name="goals" value={goal.id} className="form-selectgroup-input" />
                  <span className="form-selectgroup-label d-flex align-items-center p-3 h-100 rounded-3">
                    <span className={`avatar avatar-md bg-${goal.color}-lt me-3 text-${goal.color} rounded-3 flex-shrink-0`}>
                      <Icon icon={goal.icon} />
                    </span>
                    <span className="flex-fill text-start">
                      <span className="strong d-block mb-1 fs-3">{goal.title}</span>
                      <span className="text-secondary small">{goal.description}</span>
                    </span>
                  </span>
                </label>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <div className="row g-2">
              <div className="col">
                <Button text="Kembali" href="/onboarding/risk-profile" className="w-100" />
              </div>
              <div className="col">
                <Button text="Lanjut" color="primary" iconEnd="arrow-right" href="/onboarding/connect-bank" className="w-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SingleLayout>
  )
}
