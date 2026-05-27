import BaseLayout from '@/shared/layouts/BaseLayout'
import { Avatar, Button, Icon } from '@/shared/components/ui'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { useState } from 'react'
import { clsx } from 'clsx'

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('account')

  const person = {
    full_name: user?.name || 'Andrew Forbist',
    email: user?.email || 'andrew.forbist@visatamora.com',
    photo: user?.avatar || '002m.jpg',
  }

  const profileNavItems = [
    { id: 'account', label: 'Akun Saya' },
    { id: 'privacy', label: 'Privasi & Keamanan' },
    { id: 'notifications', label: 'Notifikasi' },
    { id: 'apps', label: 'Aplikasi Terhubung' },
  ]

  const membershipNavItems = [
    { id: 'plan', label: 'Paket & Langganan' },
  ]

  return (
    <BaseLayout 
      pageTitle="Pengaturan & Privasi" 
      pagePretitle="Ringkasan"
      containerFlushMobile
    >
      <div className="container-xl">
        <div className="card">
          <div className="row g-0">
            {/* Sidebar Navigation */}
            <div className="col-12 col-md-3 border-end">
              <div className="card-body">
                <h4 className="subheader">Pengaturan Profil</h4>
                <div className="list-group list-group-transparent mb-4">
                  {profileNavItems.map((item) => (
                    <a
                      key={item.id}
                      href="#"
                      className={clsx(
                        "list-group-item list-group-item-action d-flex align-items-center border-0 text-decoration-none",
                        activeTab === item.id && "active"
                      )}
                      style={{ outline: 'none', boxShadow: 'none' }}
                      onClick={(e) => {
                        e.preventDefault()
                        setActiveTab(item.id)
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>

                <h4 className="subheader">Keanggotaan</h4>
                <div className="list-group list-group-transparent">
                  {membershipNavItems.map((item) => (
                    <a
                      key={item.id}
                      href="#"
                      className={clsx(
                        "list-group-item list-group-item-action d-flex align-items-center border-0 text-decoration-none",
                        activeTab === item.id && "active"
                      )}
                      style={{ outline: 'none', boxShadow: 'none' }}
                      onClick={(e) => {
                        e.preventDefault()
                        setActiveTab(item.id)
                      }}
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="col-12 col-md-9 d-flex flex-column">
              <div className="card-body">
                {activeTab === 'account' && (
                  <>
                    <h2 className="mb-4">Akun Saya</h2>

                    <h3 className="card-title">Detail Profil</h3>
                    <div className="row align-items-center mb-4">
                      <div className="col-auto">
                        <Avatar size="xl" person={person} shape="rounded" />
                      </div>
                      <div className="col-auto">
                        <Button text="Ubah foto" />
                      </div>
                      <div className="col-auto">
                        <Button text="Hapus foto" color="danger" ghost />
                      </div>
                    </div>

                    <h3 className="card-title mt-4">Profil Pengguna</h3>
                    <div className="row g-3 mb-4">
                      <div className="col-md">
                        <label className="form-label" htmlFor="full-name">Nama Lengkap</label>
                        <input
                          type="text"
                          className="form-control"
                          id="full-name"
                          name="full-name"
                          defaultValue={person.full_name}
                        />
                      </div>
                      <div className="col-md">
                        <label className="form-label" htmlFor="username">Username</label>
                        <input
                          type="text"
                          className="form-control"
                          id="username"
                          name="username"
                          defaultValue="@andrewforbist"
                        />
                      </div>
                      <div className="col-md">
                        <label className="form-label" htmlFor="location">Lokasi</label>
                        <input
                          type="text"
                          className="form-control"
                          id="location"
                          name="location"
                          defaultValue="Jakarta, Indonesia"
                        />
                      </div>
                    </div>

                    <h3 className="card-title mt-4">Email</h3>
                    <p className="card-subtitle">
                      Kontak ini akan ditampilkan secara publik kepada pihak lain, pilihlah dengan bijak.
                    </p>
                    <div className="row g-2 mb-4">
                      <div className="col-auto">
                        <label htmlFor="email" className="form-label visually-hidden">Email</label>
                        <input
                          type="text"
                          className="form-control w-auto"
                          id="email"
                          name="email"
                          defaultValue={person.email}
                        />
                      </div>
                      <div className="col-auto">
                        <Button text="Ubah" />
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'privacy' && (
                  <>
                    <h2 className="mb-4">Privasi & Keamanan</h2>
                    
                    <h3 className="card-title mt-4">Kata Sandi</h3>
                    <p className="card-subtitle">
                      Anda dapat menetapkan kata sandi permanen jika tidak ingin menggunakan kode masuk sementara.
                    </p>
                    <div className="mb-4">
                      <Button text="Atur kata sandi baru" />
                    </div>

                    <h3 className="card-title mt-4">Profil Publik</h3>
                    <p className="card-subtitle">
                      Membuat profil Anda menjadi publik berarti siapa pun di jaringan dapat menemukan Anda.
                    </p>
                    <div className="mb-4">
                      <label className="form-check form-check-single form-switch form-switch-lg">
                        <input className="form-check-input" type="checkbox" defaultChecked />
                        <span className="form-check-label form-check-label-on">Anda saat ini terlihat (publik)</span>
                        <span className="form-check-label form-check-label-off">Anda saat ini tidak terlihat (privat)</span>
                      </label>
                    </div>

                    <h3 className="card-title mt-4">Autentikasi Dua Faktor (2FA)</h3>
                    <p className="card-subtitle">
                      Amankan akun Anda dengan menambahkan lapisan keamanan tambahan.
                    </p>
                    <div className="mb-4">
                      <Button text="Aktifkan 2FA" color="primary" ghost />
                    </div>
                  </>
                )}

                {activeTab === 'notifications' && (
                  <>
                     <h2 className="mb-4">Notifikasi</h2>
                     <p className="card-subtitle mb-4">Pilih jenis pemberitahuan yang ingin Anda terima.</p>
                     
                     <div className="mb-3">
                        <label className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" defaultChecked />
                          <span className="form-check-label">Peringatan Anggaran</span>
                        </label>
                        <div className="text-secondary small ms-5">Dapatkan notifikasi ketika anggaran Anda hampir habis.</div>
                     </div>
                     <div className="mb-3">
                        <label className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" defaultChecked />
                          <span className="form-check-label">Transaksi Baru</span>
                        </label>
                        <div className="text-secondary small ms-5">Pemberitahuan untuk setiap transaksi yang berhasil.</div>
                     </div>
                     <div className="mb-3">
                        <label className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" />
                          <span className="form-check-label">Pembaruan Sistem & Fitur</span>
                        </label>
                        <div className="text-secondary small ms-5">Informasi mengenai fitur terbaru dari Visatamora.</div>
                     </div>
                  </>
                )}

                {activeTab === 'apps' && (
                  <>
                     <h2 className="mb-4">Aplikasi Terhubung</h2>
                     <p className="card-subtitle mb-4">Kelola akses aplikasi pihak ketiga ke akun Anda.</p>
                     
                     <div className="list-group list-group-flush mb-4">
                        <div className="list-group-item px-0">
                           <div className="row align-items-center">
                              <div className="col-auto">
                                 <span className="avatar bg-white" style={{ backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/5/5c/Bank_Central_Asia.svg)', backgroundSize: '75%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></span>
                              </div>
                              <div className="col text-truncate">
                                 <div className="text-reset d-block">BCA Mobile</div>
                                 <div className="text-secondary text-truncate mt-n1">Terakhir sinkronisasi: 2 jam lalu</div>
                              </div>
                              <div className="col-auto">
                                 <Button text="Putuskan" color="danger" ghost size="sm" />
                              </div>
                           </div>
                        </div>
                        <div className="list-group-item px-0">
                           <div className="row align-items-center">
                              <div className="col-auto">
                                 <span className="avatar bg-white" style={{ backgroundImage: 'url(https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Gopay_logo.svg/1280px-Gopay_logo.svg.png)', backgroundSize: '75%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}></span>
                              </div>
                              <div className="col text-truncate">
                                 <div className="text-reset d-block">GoPay</div>
                                 <div className="text-secondary text-truncate mt-n1">Terakhir sinkronisasi: 5 jam lalu</div>
                              </div>
                              <div className="col-auto">
                                 <Button text="Putuskan" color="danger" ghost size="sm" />
                              </div>
                           </div>
                        </div>
                     </div>
                  </>
                )}

                {activeTab === 'plan' && (
                  <>
                     <h2 className="mb-4">Paket & Langganan</h2>
                     
                     <div className="card bg-primary-lt mb-4">
                       <div className="card-body">
                         <div className="d-flex align-items-center mb-3">
                           <div className="me-3">
                             <span className="avatar bg-primary text-white">
                               <Icon icon="crown" />
                             </span>
                           </div>
                           <div>
                             <h4 className="m-0">Premium Member</h4>
                             <div className="text-secondary">Berlaku sampai 12 Des 2026</div>
                           </div>
                         </div>
                         <p>Nikmati akses tanpa batas ke semua fitur premium, termasuk analisis lanjutan dan prioritas dukungan.</p>
                         <Button text="Kelola Langganan" color="primary" />
                       </div>
                     </div>
                  </>
                )}
              </div>

              <div className="card-footer bg-transparent mt-auto">
                <div className="btn-list justify-content-end">
                  <Button text="Batal" ghost />
                  <Button text="Simpan Perubahan" color="primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}
