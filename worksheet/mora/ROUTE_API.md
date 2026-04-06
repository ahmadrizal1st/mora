**Auth** — `/api/auth`
- `POST /api/auth/register` — daftar akun baru
- `POST /api/auth/login` — login, return access & refresh token
- `POST /api/auth/logout` — invalidate token
- `POST /api/auth/refresh` — perbarui access token
- `POST /api/auth/forgot-password` — kirim email reset
- `POST /api/auth/reset-password` — reset password via token
- `POST /api/auth/verify-email` — verifikasi email via token
- `GET  /api/auth/me` — ambil data user yang sedang login

---

**Pengguna** — `/api/users`
- `GET    /api/users/profile` — ambil profil user
- `PUT    /api/users/profile` — update nama, foto, preferensi
- `PUT    /api/users/password` — ganti password
- `DELETE /api/users/account` — hapus akun

---

**Portofolio & Aset** — `/api/portfolio`
- `GET  /api/portfolio` — ringkasan total portofolio user
- `GET  /api/portfolio/assets` — daftar aset yang dimiliki
- `POST /api/portfolio/assets` — tambah aset baru
- `PUT  /api/portfolio/assets/:id` — update jumlah/harga beli aset
- `DELETE /api/portfolio/assets/:id` — hapus aset dari portofolio
- `GET  /api/portfolio/allocation` — breakdown alokasi per kategori
- `GET  /api/portfolio/performance` — grafik performa portofolio (daily/weekly/monthly)
- `GET  /api/portfolio/risk` — skor risiko & rekomendasi rebalancing

---

**Pasar & Harga** — `/api/market`
- `GET /api/market/prices` — harga real-time semua aset
- `GET /api/market/prices/:symbol` — harga real-time satu aset
- `GET /api/market/chart/:symbol` — data historis harga (OHLCV)
- `GET /api/market/trending` — aset trending hari ini
- `GET /api/market/search?q=` — cari aset berdasarkan nama/symbol

---

**Watchlist** — `/api/watchlist`
- `GET    /api/watchlist` — daftar aset yang dipantau user
- `POST   /api/watchlist` — tambah aset ke watchlist
- `DELETE /api/watchlist/:id` — hapus aset dari watchlist

---

**Price Alert** — `/api/alerts`
- `GET    /api/alerts` — daftar alert aktif user
- `POST   /api/alerts` — buat alert baru (symbol, target harga, kondisi)
- `PUT    /api/alerts/:id` — update alert
- `DELETE /api/alerts/:id` — hapus alert
- `GET    /api/alerts/history` — riwayat alert yang pernah terpicu

---

**Budget & Transaksi** — `/api/budget`
- `GET  /api/budget` — ringkasan budget bulan berjalan
- `GET  /api/budget/categories` — daftar kategori pengeluaran
- `POST /api/budget/categories` — buat kategori baru
- `PUT  /api/budget/categories/:id` — update limit kategori
- `DELETE /api/budget/categories/:id` — hapus kategori

- `GET    /api/budget/transactions` — daftar transaksi (filter: bulan, kategori)
- `POST   /api/budget/transactions` — catat transaksi baru
- `PUT    /api/budget/transactions/:id` — edit transaksi
- `DELETE /api/budget/transactions/:id` — hapus transaksi

- `GET /api/budget/report?month=&year=` — data laporan bulanan
- `GET /api/budget/report/export` — ekspor laporan ke PDF

---

**Goal & Perencanaan** — `/api/goals`
- `GET    /api/goals` — daftar semua goal user
- `POST   /api/goals` — buat goal baru
- `GET    /api/goals/:id` — detail satu goal
- `PUT    /api/goals/:id` — update goal (target, deadline)
- `DELETE /api/goals/:id` — hapus goal
- `POST   /api/goals/:id/deposit` — tambah setoran ke goal

- `POST /api/goals/simulate/interest` — simulasi bunga (input: modal, rate, tahun)
- `POST /api/goals/simulate/mortgage` — simulasi KPR (input: harga, DP, tenor, bunga)

---

**Konverter Kurs** — `/api/converter`
- `GET /api/converter/rates` — semua rate kurs terkini
- `POST /api/converter/convert` — konversi jumlah dari satu mata uang ke lain

---

**Berita** — `/api/news`
- `GET /api/news` — daftar berita keuangan terbaru
- `GET /api/news/:id` — detail berita + rangkuman AI
- `GET /api/news?topic=saham` — filter berita per topik

---

**AI & Insight** — `/api/ai`
- `POST /api/ai/chat` — kirim pesan ke chatbot advisor, return respons AI
- `GET  /api/ai/insights` — insight otomatis berdasarkan data portofolio & transaksi user
- `GET  /api/ai/cashflow` — prediksi cashflow bulan depan berdasarkan histori

---

**Keamanan** — `/api/security`
- `GET    /api/security/sessions` — daftar sesi aktif user
- `DELETE /api/security/sessions/:id` — logout sesi tertentu
- `POST   /api/security/2fa/enable` — aktifkan 2FA, return QR code
- `POST   /api/security/2fa/verify` — verifikasi kode TOTP
- `DELETE /api/security/2fa/disable` — nonaktifkan 2FA
- `GET    /api/security/activity` — log aktivitas akun (login, perubahan data)

---

**Multi-akun Keluarga** — `/api/family`
- `GET    /api/family/members` — daftar anggota keluarga
- `POST   /api/family/members` — undang anggota via email
- `PUT    /api/family/members/:id` — atur level akses anggota
- `DELETE /api/family/members/:id` — hapus anggota
- `GET    /api/family/summary` — ringkasan keuangan gabungan keluarga

---

**Notifikasi** — `/api/notifications`
- `GET    /api/notifications` — daftar notifikasi user
- `PUT    /api/notifications/:id/read` — tandai sudah dibaca
- `PUT    /api/notifications/read-all` — tandai semua sudah dibaca
- `DELETE /api/notifications/:id` — hapus notifikasi
- `GET    /api/notifications/settings` — preferensi notifikasi
- `PUT    /api/notifications/settings` — update preferensi (email, push, SMS)

---

Total sekitar **80 endpoint**.