import BaseLayout from '@/shared/layouts/BaseLayout'
import { 
  Avatar, 
  Button, 
  Icon, 
  Timeline, 
  TimelineItem,
} from '@/shared/components/ui'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function ProfilePage() {
  const { user } = useAuth()

  const person = {
    full_name: user?.name || 'Andrew Forbist',
    email: user?.email || 'andrew.forbist@visatamora.com',
    photo: user?.avatar || '002m.jpg',
  }

  return (
    <BaseLayout flush noContainer bodyClass="p-0">
      {/* Profile Page Header */}
      <div className="page-header pt-0 m-0 border-0">
        <div className="d-flex justify-content-between align-items-center d-md-none mt-0 mb-3 px-3 pt-3">
          <Button icon="plus" iconOnly ghost size="md" className="p-0 text-secondary" />
          <Button icon="menu-2" iconOnly ghost size="md" className="p-0 text-secondary" />
        </div>
        <div className="container-xl">
          <div className="row g-3 align-items-center flex-column flex-md-row text-center text-md-start">
            <div className="col-auto">
              <Avatar
                person={person}
                size="xl"
                shape="rounded"
              />
            </div>
            <div className="col">
              <h1 className="fw-bold m-0">{person.full_name}</h1>
              <div className="my-2 text-secondary">
                Premium Member. Membentuk masa depan finansial yang sehat melalui alokasi aset cerdas dan anggaran disiplin.
              </div>
              <div className="list-inline list-inline-dots text-secondary justify-content-center justify-content-md-start">
                <div className="list-inline-item">
                  <Icon icon="shield-check" className="text-success" />
                  {' '}Akun Terverifikasi
                </div>
                <div className="list-inline-item">
                  <Icon icon="mail" />
                  {' '}<a href={`mailto:${person.email}`} className="text-reset">{person.email}</a>
                </div>
                <div className="list-inline-item d-none d-sm-inline-block">
                  <Icon icon="flame" className="text-danger" />
                  {' '}12 Hari Beruntun
                </div>
              </div>
            </div>
            <div className="col-auto ms-md-auto w-100 w-md-auto">
              <div className="btn-list justify-content-center justify-content-md-start">
                <Button icon="dots" iconOnly />
                <Button icon="settings" iconOnly />
                <Button icon="edit" color="primary" text="Edit Profil" className="flex-fill flex-md-grow-0" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-body">
        <div className="container-xl">
          <div className="row g-3">
            {/* Left Column: Timeline */}
            <div className="col">
              <Timeline>
                <TimelineItem
                  time="2 jam lalu"
                  title="Peringatan Anggaran"
                  description="Kategori Makanan & Minuman telah mencapai 92% dari batas anggaran bulanan Anda (Rp 2.000.000)."
                  icon="alert-triangle"
                  iconBg="warning"
                />
                <TimelineItem
                  time="10 jam lalu"
                  title="Transaksi Baru Dilacak"
                  description="Pembayaran langganan Netflix Premium sebesar Rp 186.000 telah otomatis terdata pada Cashflow Anda."
                  icon="receipt"
                  iconBg="azure"
                />
                <TimelineItem
                  time="1 hari lalu"
                  title="Goal Tercapai! 🎉"
                  description="Selamat! Goal finansial 'Dana Darurat 3 Bulan' Anda telah terkumpul 100% sebesar Rp 15.000.000."
                  icon="trophy"
                  iconBg="yellow"
                />
                <TimelineItem
                  time="1 day ago"
                  title="Kenaikan Skor Kredit"
                  description="Skor kredit Anda naik 15 poin menjadi 765 (Sangat Baik) karena catatan pembayaran tepat waktu."
                  icon="credit-card"
                  iconBg="success"
                />
                <TimelineItem
                  time="2 days ago"
                  title="Rekening Aktif Terhubung"
                  icon="building-bank"
                  iconBg="blue"
                >
                  <div className="avatar-list mt-3">
                    <span 
                      className="avatar rounded bg-white border" 
                      style={{ 
                        backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg)', 
                        backgroundSize: '75%', 
                        backgroundPosition: 'center', 
                        backgroundRepeat: 'no-repeat'
                      }} 
                      title="BCA" 
                    />
                    <span 
                      className="avatar rounded bg-white border" 
                      style={{ 
                        backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/a/ad/Bank_Mandiri_logo_2016.svg)', 
                        backgroundSize: '75%', 
                        backgroundPosition: 'center', 
                        backgroundRepeat: 'no-repeat'
                      }} 
                      title="Mandiri" 
                    />
                    <span 
                      className="avatar rounded bg-white border" 
                      style={{ 
                        backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/1280px-Gopay_logo.svg.png)', 
                        backgroundSize: '75%', 
                        backgroundPosition: 'center', 
                        backgroundRepeat: 'no-repeat'
                      }} 
                      title="GoPay" 
                    />
                  </div>
                </TimelineItem>
                <TimelineItem
                  time="3 days ago"
                  title="Misi Finansial Terselesaikan"
                  icon="award"
                  iconBg="purple"
                >
                  <div className="mt-3">
                    <div className="row g-2">
                      <div className="col-4">
                        <div className="p-3 bg-body-tertiary rounded text-center">
                          <Icon icon="pig-money" className="text-success mb-1" size="md" />
                          <div className="small fw-bold">Smart Saver</div>
                          <div className="text-muted" style={{ fontSize: '9px' }}>+100 XP</div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-3 bg-body-tertiary rounded text-center">
                          <Icon icon="target-arrow" className="text-primary mb-1" size="md" />
                          <div className="small fw-bold">Budget Master</div>
                          <div className="text-muted" style={{ fontSize: '9px' }}>+150 XP</div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-3 bg-body-tertiary rounded text-center">
                          <Icon icon="shield-check" className="text-warning mb-1" size="md" />
                          <div className="small fw-bold">Safe Guard</div>
                          <div className="text-muted" style={{ fontSize: '9px' }}>+50 XP</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TimelineItem>
                <TimelineItem
                  time="2 weeks ago"
                  title="Skor Kredit Diperbarui"
                  description="Laporan skor kredit bulanan Anda telah siap dan dapat diakses di menu Credit."
                  icon="settings"
                  iconBg="secondary"
                />
              </Timeline>
            </div>

            {/* Right Column: Financial Info & Summary */}
            <div className="col-lg-4">
              <div className="row row-cards">
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="card-title">Informasi Keuangan</div>

                      <div className="mb-2">
                        <Icon icon="building-bank" className="me-2 text-secondary" />
                        Rekening Terhubung: <strong>4 Akun</strong>
                      </div>
                      <div className="mb-2">
                        <Icon icon="credit-card" className="me-2 text-secondary" />
                        Skor Kredit: <strong>765 (Sangat Baik)</strong>
                      </div>
                      <div className="mb-2">
                        <Icon icon="wallet" className="me-2 text-secondary" />
                        Kekayaan Bersih: <strong>Rp 142.500.000</strong>
                      </div>
                      <div className="mb-2">
                        <Icon icon="coin" className="me-2 text-secondary" />
                        Mata Uang Utama: <strong>IDR (Rupiah)</strong>
                      </div>
                      <div className="mb-2">
                        <Icon icon="crown" className="me-2 text-secondary" />
                        Level Keanggotaan: <strong>Premium</strong>
                      </div>
                      <div>
                        <Icon icon="target" className="me-2 text-secondary" />
                        Goal Finansial Aktif: <strong>3 Target</strong>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="card">
                    <div className="card-body">
                      <h2 className="card-title">Ikhtisar Keuangan</h2>
                      <div>
                        <p className="text-secondary" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                          Profil keuangan Anda dianalisis secara otomatis berdasarkan aktivitas transaksi, perencanaan anggaran bulanan, dan kedisiplinan pembayaran kredit. Tingkatkan skor kredit dengan membayar tagihan tepat waktu dan raih kebebasan finansial dengan disiplin menabung pada menu target finansial.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
