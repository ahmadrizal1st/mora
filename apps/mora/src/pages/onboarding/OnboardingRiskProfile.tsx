// src/pages/onboarding/OnboardingRiskProfile.tsx
import SingleLayout from '../../layouts/SingleLayout'
import { Button } from '../../components/ui/Button'
import { Progress } from '../../components/ui/Progress'

export default function OnboardingRiskProfile() {
  const questions = [
    {
      id: 1,
      question: "Apa tujuan utama investasi Anda?",
      options: [
        { label: "Melindungi modal (Sangat Konservatif)", value: "safe" },
        { label: "Pendapatan stabil (Konservatif)", value: "stable" },
        { label: "Pertumbuhan modal jangka panjang (Moderat)", value: "growth" },
        { label: "Pertumbuhan agresif (Agresif)", value: "aggressive" },
      ],
    },
    {
      id: 2,
      question: "Berapa lama Anda berencana untuk berinvestasi?",
      options: [
        { label: "Kurang dari 1 tahun", value: "short" },
        { label: "1 - 3 tahun", value: "medium-short" },
        { label: "3 - 5 tahun", value: "medium" },
        { label: "Di atas 5 tahun", value: "long" },
      ],
    },
    {
      id: 3,
      question: "Bagaimana reaksi Anda jika nilai investasi turun 10% dalam sebulan?",
      options: [
        { label: "Sangat panik dan langsung menarik semua dana", value: "panic" },
        { label: "Cukup khawatir dan mempertimbangkan untuk berhenti", value: "worry" },
        { label: "Tetap tenang dan menunggu pemulihan", value: "calm" },
        { label: "Melihatnya sebagai peluang untuk membeli lebih banyak", value: "opportunity" },
      ],
    },
  ]

  return (
    <SingleLayout containerSize="tight" centered={false}>
      <div className="card card-md shadow-sm border-0 mb-4">
        <div className="card-body p-4 p-md-5">
          <div className="mb-5">
            <div className="row align-items-center g-3">
              <div className="col">
                <h2 className="mb-1 h1 text-primary">Profil Risiko</h2>
                <p className="text-secondary mb-0">Langkah 3 dari 5 • Bantu kami mengenal Anda</p>
              </div>
              <div className="col-auto">
                <div className="text-secondary small mb-1 text-end">Progress 50%</div>
                <Progress value={50} size="sm" color="primary" />
              </div>
            </div>
          </div>

          <div className="mb-5">
            <p className="text-secondary fs-3">
              Jawab beberapa pertanyaan berikut agar kami dapat merekomendasikan portofolio yang paling sesuai dengan profil risiko Anda.
            </p>
          </div>

          <form>
            <div className="space-y-4">
              {questions.map((q) => (
                <div key={q.id} className="mb-4">
                  <h4 className="card-title text-primary mb-3">
                    <span className="badge badge-outline text-primary me-2">{q.id}</span>
                    {q.question}
                  </h4>
                  <div className="form-selectgroup form-selectgroup-boxes d-flex flex-column gap-2">
                    {q.options.map((opt) => (
                      <label key={opt.value} className="form-selectgroup-item flex-fill">
                        <input type="radio" name={`question-${q.id}`} value={opt.value} className="form-selectgroup-input" />
                        <div className="form-selectgroup-label d-flex align-items-center p-3">
                          <div className="me-3">
                            <span className="form-selectgroup-check"></span>
                          </div>
                          <div>
                            {opt.label}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <div className="row g-2">
                <div className="col">
                  <Button text="Kembali" href="/onboarding/profile" className="w-100" />
                </div>
                <div className="col">
                  <Button text="Lanjut" color="primary" iconEnd="arrow-right" href="/onboarding/goals" className="w-100" />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </SingleLayout>
  )
}
