import BaseLayout from '@/shared/layouts/BaseLayout'
import { Avatar, Button, Icon, Modal, ModalHeader } from '@/shared/components/ui'
import { useAuth } from '@/features/auth/hooks/useAuth'
import { AuthService } from '@/features/auth/services/auth.service'
import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import axios from 'axios'

export default function SettingsPage() {
  const { user, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState('account')

  const [fullName, setFullName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Password Modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  // Notice alert state
  const [noticeMessage, setNoticeMessage] = useState('')

  useEffect(() => {
    if (user) {
      setFullName(user.name || '')
      setEmail(user.email || '')
    }
  }, [user])

  const person = {
    full_name: fullName || 'User',
    email: email || '',
    photo: user?.avatar || undefined,
  }

  const profileNavItems = [
    { id: 'account', label: 'Akun Saya' },
    { id: 'privacy', label: 'Privasi & Keamanan' },
    { id: 'notifications', label: 'Notifikasi' },
    { id: 'apps', label: 'Aplikasi Terhubung' },
  ]

  const membershipNavItems = [{ id: 'plan', label: 'Paket & Langganan' }]

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveSuccess(false)
    setSaveError('')

    try {
      if (updateProfile) {
        await updateProfile({ name: fullName, email })
      }
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setSaveError(err.response?.data?.message || 'Gagal menyimpan perubahan.')
      } else {
        setSaveError('Gagal menyimpan perubahan.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    if (user) {
      setFullName(user.name || '')
      setEmail(user.email || '')
    }
    setSaveSuccess(false)
    setSaveError('')
  }

  const handleComingSoon = (featureName: string) => {
    setNoticeMessage(`Fitur "${featureName}" saat ini sedang dalam tahap pengembangan.`)
    setTimeout(() => setNoticeMessage(''), 4000)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword || !newPassword) return

    setIsChangingPassword(true)
    setPasswordError('')
    setPasswordSuccess(false)

    try {
      await AuthService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      })
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setTimeout(() => {
        setPasswordSuccess(false)
        setShowPasswordModal(false)
      }, 1500)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setPasswordError(err.response?.data?.message || 'Gagal mengubah kata sandi. Periksa kata sandi saat ini.')
      } else {
        setPasswordError('Gagal mengubah kata sandi. Periksa kata sandi saat ini.')
      }
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <BaseLayout pageTitle="Pengaturan & Privasi" pagePretitle="Ringkasan" containerFlushMobile>
      <div className="container-xl">
        <div className="card">
          <div className="row g-0">
            <div className="col-12 col-md-3 border-end">
              <div className="card-body">
                <h4 className="subheader">Pengaturan Profil</h4>
                <div className="list-group list-group-transparent mb-4">
                  {profileNavItems.map((item) => (
                    <a
                      key={item.id}
                      href="#"
                      className={clsx(
                        'list-group-item list-group-item-action d-flex align-items-center border-0 text-decoration-none',
                        activeTab === item.id && 'active'
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
                        'list-group-item list-group-item-action d-flex align-items-center border-0 text-decoration-none',
                        activeTab === item.id && 'active'
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

            <div className="col-12 col-md-9 d-flex flex-column">
              <form onSubmit={handleSave} className="d-flex flex-column h-100">
                <div className="card-body">
                  {saveSuccess && (
                    <div className="alert alert-success mb-4" role="alert">
                      <Icon icon="check" className="me-2" /> Perubahan profil berhasil disimpan!
                    </div>
                  )}

                  {saveError && (
                    <div className="alert alert-danger mb-4" role="alert">
                      <Icon icon="alert-circle" className="me-2" /> {saveError}
                    </div>
                  )}

                  {noticeMessage && (
                    <div className="alert alert-info mb-4" role="alert">
                      <Icon icon="info-circle" className="me-2" /> {noticeMessage}
                    </div>
                  )}

                  {activeTab === 'account' && (
                    <>
                      <h2 className="mb-4">Akun Saya</h2>

                      <h3 className="card-title">Detail Profil</h3>
                      <div className="row align-items-center mb-4">
                        <div className="col-auto">
                          <Avatar size="xl" person={person} shape="rounded" />
                        </div>
                      </div>

                      <h3 className="card-title mt-4">Profil Pengguna</h3>
                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <label className="form-label" htmlFor="full-name">
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="full-name"
                            name="full-name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label" htmlFor="email-display">
                            Alamat Email
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            id="email-display"
                            name="email-display"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'privacy' && (
                    <>
                      <h2 className="mb-4">Privasi & Keamanan</h2>

                      <h3 className="card-title mt-4">Kata Sandi</h3>
                      <p className="card-subtitle">
                        Ubah kata sandi akun Anda secara berkala untuk menjaga keamanan.
                      </p>
                      <div className="mb-4">
                        <Button
                          type="button"
                          text="Atur kata sandi baru"
                          color="primary"
                          onClick={() => setShowPasswordModal(true)}
                        />
                      </div>

                      <h3 className="card-title mt-4">Profil Publik</h3>
                      <p className="card-subtitle">
                        Membuat profil Anda menjadi publik berarti siapa pun di jaringan dapat
                        menemukan Anda.
                      </p>
                      <div className="mb-4">
                        <label className="form-check form-check-single form-switch form-switch-lg">
                          <input className="form-check-input" type="checkbox" defaultChecked />
                          <span className="form-check-label form-check-label-on">
                            Anda saat ini terlihat (publik)
                          </span>
                        </label>
                      </div>

                      <h3 className="card-title mt-4">Autentikasi Dua Faktor (2FA)</h3>
                      <p className="card-subtitle">
                        Amankan akun Anda dengan menambahkan lapisan keamanan tambahan.
                      </p>
                      <div className="mb-4">
                        <Button
                          type="button"
                          text="Aktifkan 2FA"
                          color="secondary"
                          ghost
                          onClick={() => handleComingSoon('2FA / Autentikasi Dua Faktor')}
                        />
                      </div>
                    </>
                  )}

                  {activeTab === 'notifications' && (
                    <>
                      <h2 className="mb-4">Notifikasi</h2>
                      <p className="card-subtitle mb-4">
                        Pilih jenis pemberitahuan yang ingin Anda terima.
                      </p>

                      <div className="mb-3">
                        <label className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" defaultChecked />
                          <span className="form-check-label">Peringatan Anggaran</span>
                        </label>
                        <div className="text-secondary small ms-5">
                          Dapatkan notifikasi ketika anggaran Anda hampir habis.
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-check form-switch">
                          <input className="form-check-input" type="checkbox" defaultChecked />
                          <span className="form-check-label">Transaksi Baru</span>
                        </label>
                        <div className="text-secondary small ms-5">
                          Pemberitahuan untuk setiap transaksi yang berhasil.
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'apps' && (
                    <>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h2>Aplikasi Terhubung</h2>
                        <span className="badge bg-secondary-lt">Demo Mode</span>
                      </div>
                      <p className="card-subtitle mb-4">
                        Kelola akses aplikasi pihak ketiga ke akun Anda.
                      </p>

                      <div className="list-group list-group-flush mb-4">
                        <div className="list-group-item px-0">
                          <div className="row align-items-center">
                            <div className="col text-truncate">
                              <div className="text-reset d-block">BCA Mobile</div>
                              <div className="text-secondary text-truncate mt-n1">
                                Terakhir sinkronisasi: 2 jam lalu
                              </div>
                            </div>
                            <div className="col-auto">
                              <Button
                                type="button"
                                text="Putuskan"
                                color="danger"
                                ghost
                                size="sm"
                                onClick={() => handleComingSoon('Putuskan Aplikasi Terhubung')}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === 'plan' && (
                    <>
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <h2>Paket & Langganan</h2>
                        <span className="badge bg-success-lt">Aktif</span>
                      </div>

                      <div className="card bg-primary-lt mb-4">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            <div className="me-3">
                              <span className="avatar bg-primary text-white">
                                <Icon icon="crown" />
                              </span>
                            </div>
                            <div>
                              <h4 className="m-0">Paket Standard Free</h4>
                              <div className="text-secondary">Berlaku Selamanya</div>
                            </div>
                          </div>
                          <p className="mb-3">
                            Anda menggunakan Morapi versi standar dengan fitur dasar pengelolaan keuangan lengkap.
                          </p>
                          <Button
                            type="button"
                            text="Kelola Langganan"
                            color="primary"
                            onClick={() => handleComingSoon('Kelola Langganan / Upgrade')}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="card-footer bg-transparent mt-auto">
                  <div className="btn-list justify-content-end">
                    <Button type="button" text="Batal" ghost onClick={handleReset} />
                    <Button
                      type="submit"
                      text={isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                      color="primary"
                      disabled={isSaving}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Change Password */}
      {showPasswordModal && (
        <Modal
          show={showPasswordModal}
          onClose={() => setShowPasswordModal(false)}
        >
          <ModalHeader title="Atur Kata Sandi Baru" onClose={() => setShowPasswordModal(false)} />
          <div className="modal-body">
            <form onSubmit={handleChangePassword}>
              {passwordSuccess && (
                <div className="alert alert-success mb-3" role="alert">
                  Kata sandi Anda berhasil diperbarui!
                </div>
              )}
              {passwordError && (
                <div className="alert alert-danger mb-3" role="alert">
                  {passwordError}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label" htmlFor="current_password">
                  Kata Sandi Saat Ini
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="current_password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="new_password">
                  Kata Sandi Baru
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="new_password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <Button type="button" text="Batal" ghost onClick={() => setShowPasswordModal(false)} />
                <Button
                  type="submit"
                  text={isChangingPassword ? 'Memproses...' : 'Simpan Kata Sandi'}
                  color="primary"
                  disabled={isChangingPassword}
                />
              </div>
            </form>
          </div>
        </Modal>
      )}
    </BaseLayout>
  )
}
