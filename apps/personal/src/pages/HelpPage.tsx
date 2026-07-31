import BaseLayout from '@/shared/layouts/BaseLayout'
import { Button, Icon, Accordion, InputIcon, Badge } from '@/shared/components/ui'
import { useState } from 'react'

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const faqs = [
    {
      question: 'Bagaimana cara menghubungkan rekening bank saya?',
      answer:
        'Anda dapat pergi ke halaman Pengaturan > Aplikasi Terhubung, lalu klik Hubungkan Bank. Pilih bank Anda dan masukkan detail keamanan Anda. Proses enkripsi bank kami memastikan data Anda selalu aman dan terlindungi.',
    },
    {
      question: 'Apakah data keuangan saya aman di Morapi?',
      answer:
        'Sangat aman. Morapi menggunakan enkripsi enk-ke-enk tingkat militer (AES-256) serta autentikasi dua faktor (2FA) untuk memastikan data keuangan, transaksi, dan data pribadi Anda tidak dapat diakses oleh pihak luar.',
    },
    {
      question: 'Bagaimana cara menarik dana investasi dari portofolio?',
      answer:
        'Untuk menarik dana investasi, navigasikan ke menu Wealth > Portofolio, klik tombol Penarikan. Tentukan jumlah dana yang ingin Anda tarik ke rekening utama Anda. Proses transfer biasanya memakan waktu 1-3 hari kerja bergantung pada jenis aset.',
    },
    {
      question: 'Bagaimana cara mengganti kata sandi atau email akun?',
      answer:
        'Anda dapat mengganti kata sandi atau email langsung dari halaman Pengaturan & Privasi di bawah tab "Akun Saya" untuk email, dan tab "Privasi & Keamanan" untuk perubahan kata sandi.',
    },
  ]

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('Pilih kategori...')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || category === 'Pilih kategori...' || !message) return
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setName('')
      setEmail('')
      setCategory('Pilih kategori...')
      setMessage('')
    }, 800)
  }

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <BaseLayout pageTitle="Pusat Bantuan & Dukungan" pagePretitle="Support" containerFlushMobile>
      <div className="container-xl">
        <div
          className="card card-md mb-4 bg-primary text-white"
          style={{
            backgroundImage:
              'radial-gradient(circle at 100% 0%, rgba(255,255,255,0.08) 0%, transparent 80%)',
          }}
        >
          <div className="card-body text-center py-5">
            <h1 className="display-6 mb-3 text-white">Ada yang bisa kami bantu?</h1>
            <p
              className="fs-3 mx-auto mb-4 text-white text-opacity-75"
              style={{ maxWidth: '32rem' }}
            >
              Cari panduan, FAQ, atau hubungi langsung tim bantuan kami yang siap melayani Anda
              24/7.
            </p>
            <div className="mx-auto" style={{ maxWidth: '500px' }}>
              <InputIcon
                icon="search"
                prepend
                rounded
                placeholder="Cari pertanyaan, panduan, atau topik bantuan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="row row-cards mb-4">
          <div className="col-md-6 col-lg-3">
            <div className="card h-100">
              <div className="card-body text-center py-4">
                <span className="avatar bg-primary-lt text-primary avatar-lg mb-3">
                  <Icon icon="user" />
                </span>
                <h3 className="card-title">Akun & Profil</h3>
                <p className="text-secondary small">
                  Kelola pendaftaran, ganti kata sandi, verifikasi data diri (KYC), dan pengaturan
                  profil keamanan.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card h-100">
              <div className="card-body text-center py-4">
                <span className="avatar bg-green-lt text-green avatar-lg mb-3">
                  <Icon icon="credit-card" />
                </span>
                <h3 className="card-title">Transaksi & Pembayaran</h3>
                <p className="text-secondary small">
                  Panduan tentang transfer dana, pembayaran tagihan, penarikan investasi, dan
                  e-wallet.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card h-100">
              <div className="card-body text-center py-4">
                <span className="avatar bg-azure-lt text-azure avatar-lg mb-3">
                  <Icon icon="chart-pie" />
                </span>
                <h3 className="card-title">Keuangan & Wealth</h3>
                <p className="text-secondary small">
                  Informasi tentang pengelolaan aset, portofolio saham, reksadana, dan analisis
                  finansial premium Anda.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg-3">
            <div className="card h-100">
              <div className="card-body text-center py-4">
                <span className="avatar bg-red-lt text-red avatar-lg mb-3">
                  <Icon icon="shield" />
                </span>
                <h3 className="card-title">Kemanan & Kebijakan</h3>
                <p className="text-secondary small">
                  Pelajari enkripsi data kami, kebijakan privasi, serta langkah pencegahan kejahatan
                  siber.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="card-title">Pertanyaan yang Sering Diajukan (FAQ)</h3>
                <Badge color="green" light className="d-flex align-items-center gap-2 px-2 py-1">
                  <span className="badge-dot bg-green"></span> Semua Sistem Aktif
                </Badge>
              </div>
              <div className="card-body">
                {filteredFaqs.length > 0 ? (
                  <Accordion id="faq-accordion" type="flush" items={filteredFaqs} />
                ) : (
                  <div className="text-center py-5 text-secondary">
                    <Icon icon="search" className="mb-2 text-muted" style={{ fontSize: '2rem' }} />
                    <p className="m-0">Tidak ditemukan hasil pencarian untuk "{searchQuery}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Kirim Tiket Bantuan</h3>
              </div>
              <div className="card-body">
                {isSubmitted && (
                  <div className="alert alert-success mb-3" role="alert">
                    <Icon icon="circle-check" className="me-2" />
                    Tiket Bantuan Anda telah berhasil dikirim! Tim support kami akan menghubungi Anda melalui email.
                  </div>
                )}
                <p className="text-secondary small mb-4">
                  Tidak menemukan jawaban yang Anda cari? Silakan isi formulir di bawah ini, tim
                  support kami akan membalas dalam waktu kurang dari 1 jam.
                </p>
                <form onSubmit={handleSubmitTicket} className="row g-3">
                  <div className="col-12">
                    <label className="form-label" htmlFor="ticket-name">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="ticket-name"
                      placeholder="Masukkan nama lengkap Anda"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="ticket-email">
                      Alamat Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="ticket-email"
                      placeholder="nama@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="ticket-category">
                      Kategori Masalah
                    </label>
                    <select
                      className="form-select"
                      id="ticket-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option disabled>Pilih kategori...</option>
                      <option value="Keamanan Akun & Login">Keamanan Akun & Login</option>
                      <option value="Transaksi Finansial / Pembayaran">Transaksi Finansial / Pembayaran</option>
                      <option value="Portofolio Wealth & Aset">Portofolio Wealth & Aset</option>
                      <option value="Bug Aplikasi / Kendala Sistem">Bug Aplikasi / Kendala Sistem</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="ticket-message">
                      Pesan / Deskripsi Masalah
                    </label>
                    <textarea
                      className="form-control"
                      id="ticket-message"
                      rows={4}
                      placeholder="Tuliskan sedetail mungkin kendala yang Anda alami..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="col-12 mt-4">
                    <Button
                      type="submit"
                      text={isSubmitting ? 'Mengirim Tiket...' : 'Kirim Tiket Bantuan'}
                      color="primary"
                      className="w-100"
                      disabled={isSubmitting}
                    />
                  </div>
                </form>
              </div>
            </div>

            <div className="card mt-3 border-0 bg-primary-lt">
              <div className="card-body">
                <h4 className="m-0 mb-2">Butuh Respon Instan?</h4>
                <div className="row g-2">
                  <div className="col-6">
                    <a
                      href="https://wa.me/#"
                      className="btn btn-white w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                    >
                      <Icon icon="message" /> WhatsApp Chat
                    </a>
                  </div>
                  <div className="col-6">
                    <a
                      href="mailto:support@morapi.com"
                      className="btn btn-white w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                    >
                      <Icon icon="mail" /> Kirim Email
                    </a>
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
