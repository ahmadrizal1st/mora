# Fintech Super App
### Menu JSON + Dokumentasi Lengkap Seluruh Fitur

---

## Ringkasan Menu

| Menu | Jumlah Fitur |
|---|---|
| Dashboard | 1 |
| Cashflow | 8 |
| Wealth | 9 |
| Credit | 7 |
| Planning | 8 |
| Analytics | 7 |
| AI & Tools | 7 |
| Local | 2 |
| Ecosystem | 7 |
| Gamification | 8 |
| **Total** | **64 fitur** |

---

## JSON Lengkap

```json
{
  "dashboard": {
    "title": "Dashboard",
    "icon": "home",
    "url": "dashboard"
  },

  "cashflow": {
    "title": "Cashflow",
    "icon": "cash",
    "columns": 2,
    "children": {
      "transactions":  { "url": "tracker/history", "title": "Riwayat Transaksi" },
      "input":         { "url": "tracker/input",   "title": "Catat Transaksi" },
      "voice":         { "url": "tracker/voice",   "title": "Input Suara" },
      "accounts":      { "url": "accounts",         "title": "Kelola Akun" },
      "budget":        { "url": "budget",           "title": "Budgeting Control" },
      "subscriptions": { "url": "subscription",     "title": "Subscription Hub" },
      "split":         { "url": "split",            "title": "Split Bill" },
      "forecast":      { "url": "ai/forecast",      "title": "Cash Flow Forecast" }
    }
  },

  "wealth": {
    "title": "Wealth",
    "icon": "building-bank",
    "columns": 2,
    "children": {
      "portfolio":    { "url": "portfolio",              "title": "My Portfolio" },
      "comparison":   { "url": "portfolio/compare",      "title": "Compare Strategy" },
      "market":       { "url": "market",                 "title": "Market Prices" },
      "watchlist":    { "url": "market/watchlist",       "title": "My Watchlist" },
      "halal":        { "url": "market/halal-screener",  "title": "Halal & ESG Screener" },
      "dividend":     { "url": "portfolio/dividend",     "title": "Dividend Calendar" },
      "converter":    { "url": "converter",              "title": "Forex & Crypto Conv" },
      "robo_advisor": { "url": "portfolio/robo-advisor", "title": "Robo-Advisor" },
      "tax":          { "url": "portfolio/tax",          "title": "Investment Tax" }
    }
  },

  "credit": {
    "title": "Credit",
    "icon": "credit-card",
    "columns": 2,
    "children": {
      "summary":       { "url": "credit",               "title": "Credit Overview" },
      "personal_loan": { "url": "credit/personal-loan", "title": "Personal Loans" },
      "mortgage":      { "url": "credit/mortgage",      "title": "Home Mortgage" },
      "cards":         { "url": "credit/cards",         "title": "Credit Cards" },
      "paylater":      { "url": "credit/paylater",      "title": "Paylater Manage" },
      "planner":       { "url": "credit/debt-planner",  "title": "Debt Payoff Plan" },
      "score":         { "url": "credit/score",         "title": "Credit Score" }
    }
  },

  "planning": {
    "title": "Planning",
    "icon": "target",
    "columns": 2,
    "children": {
      "goals":      { "url": "goals",                "title": "Financial Goals" },
      "emergency":  { "url": "goals/emergency-fund", "title": "Emergency Fund" },
      "retirement": { "url": "goals/retirement",     "title": "Retirement Simulation" },
      "insurance":  { "url": "goals/insurance",      "title": "Insurance Planner" },
      "hajj":       { "url": "goals/hajj-saving",    "title": "Hajj Planning" },
      "reminders":  { "url": "reminder",             "title": "Bill Reminders" },
      "zakat_tax":  { "url": "zakat",                "title": "Zakat & Tax" },
      "net_worth":  { "url": "analytics/networth",   "title": "Net Worth" }
    }
  },

  "analytics": {
    "title": "Analytics",
    "icon": "chart-bar",
    "columns": 2,
    "children": {
      "overview":      { "url": "analytics",         "title": "Analytics Overview" },
      "cashflow":      { "url": "analytics/cashflow", "title": "Cashflow Report" },
      "behavior":      { "url": "behavior",           "title": "Spending Behavior" },
      "health_score":  { "url": "behavior/score",     "title": "Financial Health Score" },
      "benchmark":     { "url": "benchmark",          "title": "Spending Benchmark" },
      "budget_report": { "url": "budget/report",      "title": "Budget Report" },
      "forecast":      { "url": "ai/forecast",        "title": "Cash Flow Forecast" }
    }
  },

  "ai_tools": {
    "title": "AI & Tools",
    "icon": "cpu",
    "columns": 2,
    "children": {
      "ai_chat":      { "url": "ai",           "title": "AI Copilot" },
      "autopilot":    { "url": "ai/autopilot", "title": "AI Autopilot" },
      "price_check":  { "url": "price-check",  "title": "Price Checker" },
      "rules":        { "url": "rules",        "title": "Automation Rules" },
      "round_up":     { "url": "round-up",     "title": "Round-Up Saving" },
      "salary_split": { "url": "salary-split", "title": "Salary Splitter" },
      "receipts":     { "url": "receipts",     "title": "Receipt Scanner" }
    }
  },

  "local": {
    "title": "Local",
    "icon": "map-pin",
    "columns": 2,
    "children": {
      "atm":   { "url": "nearby/atm",   "title": "Nearby ATM" },
      "promo": { "url": "nearby/promo", "title": "Nearby Promo" }
    }
  },

  "ecosystem": {
    "title": "Ecosystem",
    "icon": "grid-dots",
    "columns": 2,
    "children": {
      "bank_sync": { "url": "bank-sync",       "title": "Bank & Finance Hub" },
      "vault":     { "url": "vault",           "title": "File Vault" },
      "learn":     { "url": "learn",           "title": "Academy Hub" },
      "news":      { "url": "news",            "title": "Financial News" },
      "family":    { "url": "settings/family", "title": "Family Mode" },
      "profile":   { "url": "profile",         "title": "My Account" },
      "settings":  { "url": "settings",        "title": "System Settings" }
    }
  },

  "gamification": {
    "title": "Achievements",
    "icon": "trophy",
    "columns": 2,
    "children": {
      "streak":       { "url": "gamification/streak", "title": "Daily Streak" },
      "quests":       { "url": "gamification/quests", "title": "Daily Quests" },
      "achievements": { "url": "achievements",         "title": "Achievements Hub" },
      "leaderboard":  { "url": "leaderboard",          "title": "Leaderboard" },
      "challenges":   { "url": "challenges",           "title": "Saving Challenges" },
      "referral":     { "url": "referral",             "title": "Referral & Reward" },
      "recap":        { "url": "recap/weekly",         "title": "Weekly Recap" },
      "reward_store": { "url": "gamification/store",   "title": "Reward Store" }
    }
  }
}
```

---

## Penjelasan Per Menu

---

### 1. Dashboard
**URL:** `dashboard`

Halaman utama yang menampilkan ringkasan keuangan user secara real-time dalam satu layar. Menampilkan total aset, Net Worth terkini, streak aktif hari ini, quest harian yang belum selesai, grafik arus kas singkat, dan notifikasi terbaru. Dirancang agar user mendapat gambaran penuh kondisi keuangannya dalam hitungan detik tanpa perlu masuk ke menu lain.

---

### 2. Cashflow

Pusat kendali seluruh arus kas harian. Mencakup pencatatan transaksi dari berbagai sumber input, manajemen anggaran, pelacakan langganan, hingga prediksi arus kas ke depan.

| Key | URL | Fitur | Penjelasan |
|---|---|---|---|
| `transactions` | `tracker/history` | Riwayat Transaksi | Histori lengkap semua transaksi lintas akun dengan filter tanggal, kategori, nominal, dan pencarian kata kunci |
| `input` | `tracker/input` | Catat Transaksi | Form input transaksi manual: nominal, kategori, akun, catatan, dan foto struk opsional |
| `voice` | `tracker/voice` | Input Suara | Rekam suara "Makan siang 35 ribu", AI transkripsi dan kategorisasi otomatis tanpa ketik manual |
| `accounts` | `accounts` | Kelola Akun | Manajemen semua rekening bank, e-wallet, dan kas tunai dalam satu tampilan dengan saldo terkini. Termasuk pengaturan auto-kategorisasi transaksi yang belajar dari kebiasaan user |
| `budget` | `budget` | Budgeting Control | Ringkasan anggaran bulan ini dan progres per kategori dengan alert otomatis saat mendekati batas. Mendukung metode amplop digital (Envelope Budget) dan opsi rollover sisa anggaran ke bulan berikutnya |
| `subscriptions` | `subscription` | Subscription Hub | Pantau semua langganan aktif, total biaya bulanan, dan alert otomatis sebelum tanggal auto-renew |
| `split` | `split` | Split Bill | Bagi tagihan bersama teman secara adil, pantau siapa sudah bayar, dan kirim reminder langsung dari app |
| `forecast` | `ai/forecast` | Cash Flow Forecast | Prediksi arus kas 30 dan 90 hari ke depan berdasarkan pola histori transaksi dan tagihan rutin |

---

### 3. Wealth

Pusat investasi dan manajemen kekayaan lintas semua kelas aset. Dirancang menyaingi Bibit dan Ajaib namun dengan cakupan lebih luas, ditambah fitur syariah dan ESG yang terintegrasi penuh.

| Key | URL | Fitur | Penjelasan |
|---|---|---|---|
| `portfolio` | `portfolio` | My Portfolio | Overview semua aset investasi: saham, reksa dana, obligasi, kripto, dan emas dalam satu tampilan terpadu |
| `comparison` | `portfolio/compare` | Compare Strategy | Bandingkan performa dua hingga tiga skenario alokasi portofolio berbeda secara visual dengan grafik historis |
| `market` | `market` | Market Prices | Harga pasar real-time untuk saham, reksa dana, kripto, dan komoditas dengan perubahan 24 jam |
| `watchlist` | `market/watchlist` | My Watchlist | Daftar pantau instrumen favorit dengan alert harga custom yang dikirim via notifikasi push |
| `halal` | `market/halal-screener` | Halal & ESG Screener | Filter saham dan reksa dana berdasarkan kriteria syariah OJK lengkap dengan alasan kelulusan atau penolakan. Tab ESG menampilkan rating lingkungan, sosial, dan tata kelola per instrumen — kombinasi unik yang belum ada di pasar Indonesia |
| `dividend` | `portfolio/dividend` | Dividend Calendar | Kalender jadwal dividen semua saham di portofolio dengan estimasi nominal yang akan diterima |
| `converter` | `converter` | Forex & Crypto Conv | Konversi mata uang asing dan kripto dengan live rate, alert pergerakan harga, dan konversi multi-currency sekaligus |
| `robo_advisor` | `portfolio/robo-advisor` | Robo-Advisor | Rebalancing portofolio otomatis berbasis profil risiko user, bekerja lintas kelas aset saham, reksa dana, dan obligasi |
| `tax` | `portfolio/tax` | Investment Tax | Estimasi pajak investasi dan capital gain per aset, lengkap dengan riwayat realisasi keuntungan |

---

### 4. Credit

Manajemen utang dan kredit terpusat dalam satu aplikasi. Mencakup semua jenis kredit dari KPR hingga paylater, dilengkapi simulator dan strategi pelunasan cerdas.

| Key | URL | Fitur | Penjelasan |
|---|---|---|---|
| `summary` | `credit` | Credit Overview | Dashboard total utang aktif, total cicilan bulanan, total bunga berjalan, dan proyeksi tanggal lunas semua kredit. Termasuk riwayat lengkap semua pinjaman dan pembayaran, termasuk kredit yang sudah lunas |
| `personal_loan` | `credit/personal-loan` | Personal Loans | Kelola pinjaman personal aktif, simulator cicilan, perbandingan produk antar bank, dan rekomendasi refinancing |
| `mortgage` | `credit/mortgage` | Home Mortgage | Manajemen KPR aktif dengan simulator harga dan uang muka, perbandingan produk, dan simulasi pelunasan dipercepat |
| `cards` | `credit/cards` | Credit Cards | Pantau limit, tagihan, due date, dan reward point semua kartu kredit dalam satu tampilan terpadu |
| `paylater` | `credit/paylater` | Paylater Manage | Agregasi semua akun paylater aktif seperti Kredivo, Akulaku, GoPay Later, dan ShopeePayLater dengan total tagihan |
| `planner` | `credit/debt-planner` | Debt Payoff Plan | Strategi pelunasan utang dengan simulasi interaktif metode avalanche dan snowball, perbandingan total bunga yang bisa dihemat |
| `score` | `credit/score` | Credit Score | Estimasi skor kredit dengan histori perubahan bulanan, faktor penentu skor, dan rekomendasi konkret untuk meningkatkan skor. Menampilkan perbandingan data dari SLIK OJK dan Pefindo sekaligus dalam satu layar |

---

### 5. Planning

Perencanaan keuangan jangka panjang yang mencakup kebutuhan umum dan spesifik Muslim Indonesia. Menu ini yang paling membedakan app dari seluruh kompetitor karena kedalaman dan kelengkapan fiturnya.

| Key | URL | Fitur | Penjelasan |
|---|---|---|---|
| `goals` | `goals` | Financial Goals | Buat dan pantau tujuan keuangan spesifik dengan target nominal, tanggal, dan opsi kontribusi otomatis. Dilengkapi kalkulator bunga sederhana dan majemuk untuk simulasi pertumbuhan tabungan atau investasi menuju target |
| `emergency` | `goals/emergency-fund` | Emergency Fund | Kalkulator kebutuhan dana darurat ideal berdasarkan pengeluaran bulanan dan tracker progres pengisian |
| `retirement` | `goals/retirement` | Retirement Simulation | Simulasi dana pensiun dengan variabel inflasi, return investasi, usia pensiun, dan kebutuhan biaya hidup setelah pensiun |
| `insurance` | `goals/insurance` | Insurance Planner | Tracking semua polis asuransi aktif: jiwa, kesehatan, kendaraan, dengan tanggal jatuh tempo dan nilai premi. Dilengkapi analisis kesenjangan antara kebutuhan asuransi ideal berdasarkan profil user versus polis yang sudah dimiliki |
| `hajj` | `goals/hajj-saving` | Hajj Planning | Simulasi dan tracker tabungan haji dengan estimasi kenaikan biaya, integrasi data antrian Kemenag, dan estimasi tahun keberangkatan |
| `reminders` | `reminder` | Bill Reminders | Pengingat jatuh tempo tagihan, cicilan, pajak, dan zakat dengan notifikasi otomatis H-3, H-1, dan hari H |
| `zakat_tax` | `zakat` | Zakat & Tax | Kalkulator zakat mal, zakat penghasilan, dan zakat emas dalam satu fitur, dilengkapi estimasi pajak PPh 21 tahunan dan reminder deadline SPT |
| `net_worth` | `analytics/networth` | Net Worth | Ringkasan kekayaan bersih real-time: total seluruh aset dikurangi total seluruh liabilitas, diperbarui otomatis setiap ada perubahan. Dilengkapi grafik historis pertumbuhan kekayaan bersih dan proyeksi ke depan berdasarkan tren saat ini |

---

### 6. Analytics

Lapisan analitik mendalam yang mengubah data transaksi menjadi insight perilaku keuangan yang actionable. Terpisah dari Planning karena fokusnya pada pemahaman pola, bukan perencanaan masa depan.

| Key | URL | Fitur | Penjelasan |
|---|---|---|---|
| `overview` | `analytics` | Analytics Overview | Dashboard ringkasan semua data analitik: pengeluaran, pemasukan, tren, dan skor kesehatan keuangan dalam satu layar |
| `cashflow` | `analytics/cashflow` | Cashflow Report | Laporan arus kas pemasukan vs pengeluaran per periode dengan grafik tren bulanan dan tahunan |
| `behavior` | `behavior` | Spending Behavior | Analisis kebiasaan belanja berdasarkan waktu, hari, kategori, dan lokasi untuk mengenali pola konsumsi. Termasuk deteksi pola emotional spending dan korelasi kapan user cenderung belanja impulsif |
| `health_score` | `behavior/score` | Financial Health Score | Skor kesehatan keuangan 0–100 dengan breakdown per dimensi: tabungan, utang, investasi, dan proteksi |
| `benchmark` | `benchmark` | Spending Benchmark | Bandingkan pengeluaran user secara anonim vs rata-rata orang dengan profil serupa berdasarkan kota dan kisaran penghasilan |
| `budget_report` | `budget/report` | Budget Report | Laporan anggaran bulanan dan tahunan lengkap dengan grafik tren per kategori dan opsi ekspor PDF |
| `forecast` | `ai/forecast` | Cash Flow Forecast | Prediksi arus kas 30 dan 90 hari ke depan berdasarkan pola histori transaksi dan tagihan rutin |

---

### 7. AI & Tools

Kumpulan alat produktivitas keuangan berbasis AI dan otomasi. Semua fitur di menu ini dirancang untuk mengurangi kerja manual user dalam mengelola keuangan sehari-hari. AI Copilot juga dapat diakses via floating button di seluruh halaman app.

| Key | URL | Fitur | Penjelasan |
|---|---|---|---|
| `ai_chat` | `ai` | AI Copilot | Chatbot keuangan AI yang menjawab pertanyaan, menganalisis kondisi keuangan, dan memberikan rekomendasi personal berbasis data transaksi nyata |
| `autopilot` | `ai/autopilot` | AI Autopilot | Kategorisasi transaksi otomatis dan pengiriman ringkasan saran keuangan mingguan tanpa perlu input manual |
| `price_check` | `price-check` | Price Checker | Input nama produk atau layanan, AI cek apakah harganya wajar, murah, atau mahal berdasarkan data pasar terkini |
| `rules` | `rules` | Automation Rules | Buat aturan otomasi manajemen uang: "jika saldo di atas X, transfer Y ke tabungan" tanpa perlu ingat manual |
| `round_up` | `round-up` | Round-Up Saving | Setiap transaksi dibulatkan ke atas, selisihnya otomatis masuk ke goal tabungan yang dipilih user |
| `salary_split` | `salary-split` | Salary Splitter | Gaji masuk langsung otomatis dibagi ke rekening kebutuhan, tabungan, dan investasi sesuai persentase yang diatur |
| `receipts` | `receipts` | Receipt Scanner | Scan struk belanja via kamera atau galeri, OCR membaca detail transaksi dan menyimpannya otomatis |

---

### 8. Local

Fitur berbasis lokasi yang dirancang khusus untuk konteks pengguna Indonesia. Fokus pada layanan yang membutuhkan GPS dan ketersediaan data lokasi fisik.

| Key | URL | Fitur | Penjelasan |
|---|---|---|---|
| `atm` | `nearby/atm` | Nearby ATM | Temukan ATM dan kantor bank terdekat dengan filter jaringan dan info biaya admin antar bank |
| `promo` | `nearby/promo` | Nearby Promo | Temukan promo QRIS cashback dan diskon merchant terdekat berdasarkan lokasi GPS user saat ini |

---

### 9. Ecosystem

Lapisan infrastruktur, konektivitas, dan komunitas yang menghubungkan semua fitur dengan sumber data eksternal dan memperkuat ekosistem jangka panjang app.

| Key | URL | Fitur | Penjelasan |
|---|---|---|---|
| `bank_sync` | `bank-sync` | Bank & Finance Hub | Sinkronisasi terpadu dengan 50+ bank lokal, BPR, dan semua e-wallet utama Indonesia via open banking API. Mengagregasi seluruh akun keuangan user — bank, investasi, paylater, dan asuransi — dalam satu dashboard koneksi |
| `vault` | `vault` | File Vault | Penyimpanan terenkripsi untuk dokumen keuangan penting: slip gaji, NPWP, polis asuransi, dan sertifikat investasi |
| `learn` | `learn` | Academy Hub | Konten edukasi keuangan terstruktur: artikel, video pendek, kuis, dan learning path dari level pemula hingga mahir. Termasuk simulasi investasi virtual tanpa uang nyata untuk belajar strategi tanpa risiko kerugian finansial |
| `news` | `news` | Financial News | Berita pasar dan keuangan terkurasi dan dipersonalisasi berdasarkan komposisi portofolio dan minat user |
| `family` | `settings/family` | Family Mode | Kelola anggota keluarga dalam satu akun dengan kontrol akses berbeda per anggota dan dashboard keluarga bersama |
| `profile` | `profile` | My Account | Profil lengkap user: level gamifikasi, koleksi badge, statistik keuangan, dan pengaturan privasi data |
| `settings` | `settings` | System Settings | Pengaturan notifikasi push dan email, keamanan akun 2FA, preferensi tampilan, mata uang, dan bahasa |

---

### 10. Gamification

Menu khusus gamifikasi yang menjadi pembeda utama dari seluruh kompetitor fintech Indonesia. Dirancang agar user aktif setiap hari, termotivasi membangun kebiasaan finansial baik, dan memamerkan pencapaian ke sosial media secara organik.

| Key | URL | Fitur | Penjelasan |
|---|---|---|---|
| `streak` | `gamification/streak` | Daily Streak | Hitung hari aktif berturut-turut dengan visualisasi api seperti TikTok. Makin panjang streak makin besar multiplier XP. Streak Shield melindungi jika lupa 1 hari |
| `quests` | `gamification/quests` | Daily Quests | Misi harian dan mingguan ringan: catat transaksi, cek portofolio, baca artikel Academy. Reward XP dan koin setiap misi selesai |
| `achievements` | `achievements` | Achievements Hub | Pusat pencapaian terpadu: koleksi badge dengan animasi, showcase user berprestasi, dan generator kartu share otomatis (streak card, finance wrapped, badge unlock, level up card) dalam format 9:16 Story dan 1:1 feed. Semua angka sensitif disensor otomatis kecuali user memilih menampilkannya |
| `leaderboard` | `leaderboard` | Leaderboard | Ranking streak dan XP antar teman, per kota, dan skala nasional. Anonim secara default, bisa reveal nama untuk pamer |
| `challenges` | `challenges` | Saving Challenges | Tantangan tabungan mingguan dan bulanan dengan tema tertentu, leaderboard komunitas, dan hadiah untuk top kontributor |
| `referral` | `referral` | Referral & Reward | Ajak teman bergabung dan dapatkan XP, koin, dan bonus cashback untuk setiap referral yang berhasil aktif |
| `recap` | `recap/weekly` | Weekly Recap | Ringkasan otomatis keuangan mingguan dikirim via notifikasi: pemasukan, pengeluaran, streak, dan pencapaian minggu ini |
| `reward_store` | `gamification/store` | Reward Store | Tukar koin hasil aktivitas dengan cashback, voucher partner, frame profil eksklusif, tema app, dan streak shield |

---

## Sistem Streak Lengkap

### Tipe Streak

| Tipe | Trigger | Reset |
|---|---|---|
| Daily Login Streak | Buka app setiap hari | Tidak buka lebih dari 24 jam |
| Transaction Streak | Catat minimal 1 transaksi per hari | Tidak catat selama 1 hari penuh |
| Budget Streak | Tidak melebihi budget harian | Pengeluaran melebihi batas |
| Investment Streak | Investasi rutin setiap minggu | Tidak ada investasi dalam 7 hari |
| Saving Streak | Menabung sesuai target harian | Tidak ada tabungan masuk |

### Multiplier XP

| Panjang Streak | Multiplier |
|---|---|
| 7 hari | XP ×1.5 |
| 30 hari | XP ×2.0 |
| 100 hari | XP ×3.0 + badge eksklusif |
| 365 hari | XP ×5.0 + gelar Financial Legend + reward fisik |

### Milestone Reward

| Hari | Badge | Reward |
|---|---|---|
| 3 | Starter Flame | +50 XP |
| 7 | Week Warrior | +200 XP + frame profil |
| 14 | Fortnight Saver | +400 XP + streak shield gratis |
| 30 | Monthly Master | +1.000 XP + cashback Rp10.000 |
| 60 | Consistency King | +2.000 XP + fee gratis 1 bulan |
| 100 | Century Club | +5.000 XP + badge eksklusif + fitur premium unlock |
| 365 | Financial Legend | +20.000 XP + reward fisik + masuk Achievements Hub permanen |

### Notifikasi Streak

| Waktu | Pesan |
|---|---|
| 08.00 | "Streak kamu N hari! Jangan putus hari ini." |
| 20.00 | "2 jam lagi streak N hari kamu hangus. Catat 1 transaksi sekarang!" |
| Putus | "Streak N hari kamu baru saja berakhir. Mulai lagi hari ini?" |
| Comeback | Setelah 3 hari tidak buka: "Streak baru dimulai dari 0. Tapi sekarang belum terlambat!" |

---

## Ekonomi In-App

### Mata Uang

| Mata Uang | Fungsi | Cara Dapat |
|---|---|---|
| **XP** | Naik level, tidak bisa dibeli | Aktivitas harian, quest, achievement |
| **Koin** | Tukar di Reward Store | Aktivitas, quest, bisa dibeli |
| **GemFin** | Item premium langka | Hanya dari achievement besar tertentu |

### Cara Mendapat XP & Koin

| Aktivitas | XP | Koin |
|---|---|---|
| Login harian | +10 | +5 |
| Catat transaksi | +15 | +8 |
| Bayar tagihan tepat waktu | +30 | +15 |
| Selesaikan quest harian | +50 | +25 |
| Capai budget mingguan | +100 | +50 |
| Selesaikan tantangan | +200 | +100 |
| Share ke sosial media | +75 | +40 |
| Referral teman baru aktif | +500 | +250 |

### Reward Store

| Item | Harga Koin |
|---|---|
| Streak Shield (1x) | 200 |
| Frame profil eksklusif | 500 |
| Tema app premium | 1.000 |
| Cashback Rp5.000 | 2.000 |
| Cashback Rp25.000 | 8.000 |
| Fee transaksi gratis 1 bulan | 15.000 |
| Voucher partner (Grab, Tokopedia, dll) | 5.000 |

---

## Konten Share ke Sosial Media

Semua konten share diakses dari Achievements Hub. Angka sensitif disensor otomatis kecuali user memilih menampilkannya. Hashtag ter-generate otomatis.

| Konten | Deskripsi | Format |
|---|---|---|
| Streak Card | Visual api dengan jumlah hari streak aktif | 9:16 Story |
| Finance Wrapped | Laporan keuangan bulanan dan tahunan bergaya Spotify Wrapped | 9:16 + 1:1 |
| Badge Unlock | Animasi badge muncul saat milestone tercapai | 9:16 Story |
| Goal Achieved | Selebrasi pencapaian tujuan keuangan seperti lunas KPR | 1:1 Feed |
| Level Up Card | Kartu naik level dengan frame eksklusif sesuai tier | 9:16 Story |
| Health Score | Share skor kesehatan keuangan 0–100 dengan breakdown | 1:1 Feed |