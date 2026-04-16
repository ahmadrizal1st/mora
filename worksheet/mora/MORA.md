## Phase 0 — Foundation (Minggu 1–2)

**Setup Monorepo**
Inisialisasi struktur project frontend dan backend

**Database Schema Core**
Desain dan migrate schema awal: tabel users, accounts, transactions, categories, dan sessions. Pastikan relasi antar tabel sudah benar sebelum mulai bangun fitur.

**CI/CD Pipeline**
Setup GitHub Actions untuk auto-deploy ke Vercel setiap push ke main branch. Tambahkan lint dan type-check sebagai gate sebelum deploy.

**Design System & Component Library**
Buat token warna, tipografi, spacing, dan komponen dasar (Button, Input, Card, Modal).

---

## Phase 1 — MVP (Bulan 1–3)

**Login Email & Password**
Form login dengan validasi client-side dan server-side. Handle error state: email tidak ditemukan, password salah, akun belum verifikasi.

**Google OAuth**
Tombol "Lanjut dengan Google" yang trigger OAuth. Handle callback, buat user record jika pertama kali, redirect ke dashboard.

**Register Akun Baru**
Form registrasi dengan field nama, email, password, dan konfirmasi password. Kirim email verifikasi setelah submit. Validasi email unik sebelum buat akun.

**Lupa Password & Reset via Email**
Form input email → kirim link reset → halaman set password baru dengan validasi token expired. Tampilkan pesan sukses dan arahkan ke login.

**Welcome Flow & Guided Setup**
Setelah register dan verifikasi email, user masuk ke flow onboarding multi-step: selamat datang, penjelasan singkat apa yang bisa dilakukan app, dan prompt untuk mulai setup profil.

**Isi Profil Dasar**
Form isi nama lengkap dan upload foto profil. Simpan ke Storage untuk foto, update tabel users untuk nama. Bisa dilewati dan diisi nanti.

**Input Transaksi Manual**
Form tambah transaksi: nominal, tipe (pemasukan/pengeluaran), kategori, tanggal, catatan opsional. Simpan ke tabel transactions. Validasi nominal tidak boleh nol.

**Auto Kategorisasi Dasar**
Saat user input nama merchant atau deskripsi transaksi, sistem mencocokkan dengan keyword mapping sederhana untuk assign kategori otomatis. Contoh: "Grab" → Transport, "Indomaret" → Belanja.

**Histori Transaksi & Filter**
Halaman daftar transaksi dengan tampilan list kronologis. Filter berdasarkan periode (minggu/bulan/custom), kategori, dan tipe (pemasukan/pengeluaran). Search berdasarkan deskripsi atau merchant.

**Edit & Hapus Transaksi**
Setiap transaksi bisa dibuka untuk edit semua field-nya. Hapus dengan konfirmasi dialog. Perubahan langsung tereflek di dashboard dan budget.

**Setup Budget 50/30/20 atau Kustom**
Onboarding budget: user pilih metode 50/30/20 (sistem auto-alokasi dari input penghasilan) atau kustom (input manual nominal per kategori). Simpan sebagai budget aktif bulan ini.

**Progres Budget per Kategori**
Tampilkan setiap kategori budget sebagai progress bar: sudah terpakai vs total limit. Warna berubah saat mendekati atau melebihi limit. Update real-time saat transaksi baru masuk.

**Ringkasan Total & Grafik Pengeluaran/Pemasukan**
Dashboard utama: total saldo, total pemasukan bulan ini, total pengeluaran bulan ini. Grafik bar atau line sederhana membandingkan pemasukan vs pengeluaran per minggu dalam bulan berjalan.

**Buat & Tracking Goals Sederhana**
Form buat goal: nama tujuan, target nominal, target tanggal. Tampilkan progress bar dari total yang sudah dialokasikan vs target. User bisa manual tambah dana ke goal.

**Progres Dana Darurat**
Goal khusus dana darurat dengan kalkulator otomatis: input pengeluaran bulanan rata-rata → sistem hitung target ideal (3–6 bulan pengeluaran). Tampilkan progres dan estimasi bulan tercapai.

---

## Phase 2 — MCP Core (Bulan 4–6)

**Upload PDF Mutasi Bank → Ekstrak Transaksi**
User upload PDF mutasi dari BCA, Mandiri, BNI, BRI, atau bank lain. Sistem parse teks dari PDF menggunakan PDF.js atau pdfplumber, kirim ke AI untuk ekstrak baris transaksi menjadi data terstruktur: tanggal, deskripsi, nominal, tipe debit/kredit.

**Upload CSV/Excel Ekspor M-Banking**
User upload file CSV atau XLSX dari ekspor m-banking. Sistem deteksi format kolom secara otomatis (tanggal, keterangan, debit, kredit, saldo). Parse dan mapping ke schema transaksi internal.

**Upload Foto Struk OCR**
User upload foto struk belanja. Sistem kirim gambar ke AI vision untuk ekstrak: nama merchant, total nominal, tanggal, dan item-item jika ada. Hasilkan satu transaksi draft untuk direview user.

**Review & Koreksi Hasil AI Sebelum Disimpan**
Setelah proses upload selesai, tampilkan semua transaksi hasil ekstraksi dalam tabel review. User bisa edit nominal, tanggal, kategori, atau hapus baris yang salah sebelum konfirmasi simpan ke database.

**Confidence Score per Transaksi**
Setiap transaksi hasil ekstraksi AI diberi skor kepercayaan 0–100%. Transaksi dengan skor rendah diberi label kuning sebagai peringatan agar user lebih teliti saat review.

**Tag & Catatan per Transaksi**
Setiap transaksi bisa ditambahkan tag bebas (contoh: #liburan, #kerja) dan catatan teks panjang. Tag bisa digunakan sebagai filter tambahan di histori transaksi.

**Scan Struk via Kamera Langsung**
Fitur di halaman khusus yang membuka kamera device. User foto struk langsung dari app, hasil foto langsung diproses OCR tanpa harus keluar ke gallery dulu.

**Kelola Kategori Kustom**
Halaman manajemen kategori: tampilkan semua kategori default dan kategori buatan user. Bisa tambah kategori baru dengan nama dan ikon, edit nama, atau hapus kategori kustom.

**Parser Mutasi GoPay**
Parser khusus untuk format PDF atau CSV mutasi GoPay. Handle format tanggal, deskripsi transaksi, dan pemisahan saldo GoPay vs GoPay Plus. Mapping merchant GoPay ke kategori yang relevan.

**Parser Mutasi OVO**
Parser khusus format ekspor OVO. Handle kolom OVO Cash vs OVO Points, format deskripsi transfer OVO ke OVO, dan transaksi dari merchant partner OVO.

**Parser Mutasi Dana**
Parser khusus format PDF atau CSV Dana. Handle format deskripsi Dana ke Dana, top-up dari bank, pembayaran merchant, dan cashback yang muncul sebagai kredit terpisah.

**Parser Mutasi ShopeePay**
Parser khusus ShopeePay yang sering punya format tidak standar. Handle transaksi dari Shopee Mall, SPayLater, refund, dan cashback koin yang perlu dipisahkan dari transaksi uang tunai.

**Digital Envelope per Kategori**
Setiap kategori budget divisualisasikan sebagai amplop digital. User bisa pindahkan sisa budget antar amplop secara manual. Tampilkan sisa dana dan estimasi aman sampai akhir bulan.

**Rollover Sisa Budget Otomatis**
Saat awal bulan baru, sisa budget yang belum terpakai dari bulan sebelumnya otomatis ditambahkan ke limit bulan ini per kategori. User bisa disable rollover per kategori.

**Notifikasi Mendekati Limit Budget**
Kirim push notification dan in-app notification saat pengeluaran di kategori tertentu sudah mencapai 80% dan 100% dari limit budget. Include informasi sisa budget dan kategori yang dimaksud.

**Buat Pengingat Tagihan & Cicilan**
Form buat reminder: nama tagihan, nominal, tanggal jatuh tempo, tipe (sekali / berulang). Simpan ke tabel reminders. Tampilkan di halaman reminder dan dashboard.

**Pengingat Berulang Otomatis**
Reminder yang diset berulang (mingguan, bulanan, tahunan) otomatis dibuat ulang setelah ditandai selesai.

**Cash Flow per Periode**
Halaman analitik menampilkan total pemasukan vs pengeluaran per bulan dalam bentuk grafik bar berdampingan. Bisa ganti periode: 3 bulan, 6 bulan, 12 bulan terakhir.

**Tren Net Worth Historis**
Grafik line menampilkan perubahan net worth (total aset - total utang) dari bulan ke bulan. Kalkulasi otomatis dari data transaksi dan input aset/utang manual.

**Financial Health Score dengan Narasi & Persona**
Score 0–100 dikalkulasi dari beberapa faktor: savings rate, konsistensi budget, progres goals, rasio utang. Score ditampilkan dengan narasi singkat dan label persona seperti "Financial Rookie," "Steady Saver," atau "Smart Optimizer."

**Kalimat Perbandingan Sosial**
Di bawah health score, tampilkan kalimat kontekstual seperti "Kamu lebih hemat dari 68% pengguna seusiamu bulan ini." Data agregat anonim dari seluruh user, dibandingkan berdasarkan rentang usia.

**Foto/Moodboard Attachment di Goals**
User bisa upload satu foto atau gambar referensi ke setiap goal sebagai visual motivasi. Foto ditampilkan sebagai background kartu goal di halaman goals.

**Estimasi Waktu Dinamis di Goals**
Berdasarkan rata-rata jumlah yang dialokasikan ke goal per bulan, sistem kalkulasi dan tampilkan estimasi bulan/tahun goal akan tercapai. Update otomatis setiap ada perubahan alokasi.

**Push Notification & Email Digest**
Setup Firebase Cloud Messaging untuk push notification mobile dan web. Email digest mingguan dikirim via Resend atau Postmark berisi ringkasan pemasukan, pengeluaran, dan alert penting minggu ini.

**Alert Anomali Pengeluaran**
Sistem deteksi pengeluaran yang jauh di atas rata-rata historis kategori tersebut. Contoh: rata-rata makan Rp 800rb/bulan, bulan ini sudah Rp 1,5 juta di minggu ketiga → kirim alert.

**Notifikasi Berbasis Konteks Waktu**
Notifikasi yang dikirim di waktu relevan berdasarkan pola user. Contoh: notif jam makan siang tentang sisa budget makan, atau notif Sabtu pagi karena data menunjukkan user paling boros di akhir pekan.

---

## Phase 3 — MCP Extended (Bulan 7–10)

**Input Portofolio Manual**
Form tambah aset investasi: jenis aset (saham, reksa dana, emas, kripto, deposito), nama aset, jumlah unit/lot, harga beli, tanggal beli. Semua input manual, tidak ada koneksi ke broker.

**Template Import Bibit**
Parser khusus untuk file ekspor CSV dari aplikasi Bibit. Ekstrak data reksa dana: nama produk, NAB saat beli, jumlah unit, total investasi, dan return saat ini.

**Template Import Bareksa**
Parser untuk format ekspor Bareksa. Handle multi-produk dalam satu file, format tanggal Bareksa, dan kolom return yang formatnya berbeda dari Bibit.

**Template Import Stockbit**
Parser untuk ekspor portofolio Stockbit. Ekstrak data saham: kode emiten, lot, harga average, nilai pasar saat ini, unrealized gain/loss.

**Template Import Emas Digital Pegadaian/Antam**
Parser untuk ekspor tabungan emas Pegadaian atau pembelian emas Antam Logam Mulia. Ekstrak gram, harga beli per gram, total nilai, dan tanggal transaksi.

**Simulasi Skenario Alokasi Portofolio**
User bisa buat 2–3 skenario alokasi berbeda (contoh: 60% saham 40% obligasi vs 80% saham 20% emas) dan lihat perbandingan estimasi return, risiko, dan proyeksi nilai dalam grafik.

**Kalender Dividen**
Tampilkan jadwal dividen dari saham yang dimiliki user: tanggal cum date, tanggal pembayaran, estimasi nominal dividen berdasarkan jumlah lot. Data dividen diinput manual atau dari feed yang diupdate admin.

**Overview Utang Aktif**
Halaman ringkasan semua utang: kartu kredit, pinjaman personal, KPR, paylater. Tampilkan total utang, total cicilan per bulan, dan estimasi kapan semua lunas berdasarkan jadwal pembayaran.

**Tracker Pinjaman Personal Aktif**
Form input pinjaman: nama pemberi pinjaman, nominal awal, bunga, tenor, tanggal mulai. Sistem kalkulasi otomatis jadwal cicilan, sisa pokok, dan total bunga yang sudah dan akan dibayar.

**Tracker KPR Aktif**
Form input KPR: bank, harga properti, DP, nominal kredit, bunga, tenor, tanggal mulai. Tampilkan jadwal amortisasi lengkap, sisa pokok, dan proyeksi lunas.

**Simulasi Cicilan Pinjaman**
Kalkulator: input nominal, tenor, dan bunga → output cicilan per bulan, total pembayaran, dan total bunga. Bisa bandingkan skenario tenor berbeda dalam satu tampilan.

**Simulasi KPR**
Kalkulator KPR: input harga properti, DP, tenor, dan bunga → output cicilan per bulan, total kredit, total bunga, dan tabel amortisasi yang bisa di-scroll.

**Simulasi Pelunasan Awal KPR**
Input: kapan rencana pelunasan dan berapa nominal yang dibayar ekstra → sistem kalkulasi berapa bulan lebih cepat lunas dan berapa total bunga yang dihemat.

**Kelola Kartu Kredit**
Form input kartu kredit: nama bank, limit, tanggal jatuh tempo tagihan, tanggal cetak tagihan. Tampilkan tagihan bulan ini (dari transaksi yang ditag ke kartu ini), persentase limit terpakai, dan countdown jatuh tempo.

**Kelola Paylater Aktif**
Form input akun paylater (Akulaku, Kredivo, Shopee PayLater, dll): limit, tagihan aktif, tanggal jatuh tempo. Tampilkan semua paylater dalam satu halaman dengan total kewajiban bulan ini.

**Strategi Pelunasan Utang Snowball vs Avalanche**
Halaman yang mengambil semua utang aktif user dan menghitung dua strategi: snowball (lunasi nominal terkecil dulu) vs avalanche (lunasi bunga tertinggi dulu). Tampilkan perbandingan: berapa lama lunas dan total bunga yang dibayar di setiap strategi.

**Tracker Hutang Informal Peer-to-Peer**
Form catat hutang ke atau dari teman: nama, nominal, deskripsi, tanggal pinjam, tanggal jatuh tempo opsional. Tampilkan daftar "aku yang hutang" dan "mereka yang hutang ke aku" secara terpisah.

**Kirim Tagihan Hutang via Link WhatsApp**
Dari halaman hutang informal, user bisa generate link unik yang berisi detail hutang. Link dibuka di browser tanpa perlu login. User lalu share link itu via WhatsApp. Pihak yang dihutangi bisa konfirmasi sudah bayar lewat link tersebut.

**Multi-Sumber Penghasilan**
User bisa input lebih dari satu sumber penghasilan: gaji tetap, freelance, bisnis sampingan, dividen, sewa. Setiap sumber diberi label dan tipe. Dashboard pemasukan memecah total per sumber.

**Side Hustle & Gig Economy Tracker**
Halaman khusus untuk penghasilan tidak tetap. Setiap penghasilan gig bisa dicatat dengan nama klien, nominal, tanggal terima, dan status (sudah terima / belum). Tampilkan total per bulan dan tren per sumber.

**Invoice Tracker Sederhana untuk Freelancer**
Form buat invoice: nama klien, deskripsi pekerjaan, nominal, tanggal invoice, tanggal jatuh tempo, status (draft / terkirim / lunas / overdue). Tidak ada fitur kirim email otomatis di fase ini, hanya sebagai tracker.

**Kalkulasi Pajak Penghasilan Tidak Teratur**
Berdasarkan total penghasilan freelance yang dicatat, sistem estimasi PPh 21 atau PPh 23 yang perlu dibayar. Tampilkan estimasi pajak terutang per bulan dan kumulatif tahun ini berdasarkan tarif PTKP yang diinput user.

**Daftar & Kelola Langganan Aktif**
Halaman semua langganan: Netflix, Spotify, iCloud, domain hosting, dan lain-lain. Tampilkan nama, nominal, frekuensi (bulanan/tahunan), dan tanggal bayar berikutnya.

**Tambah Langganan Manual**
Form tambah langganan: nama layanan, nominal, mata uang, frekuensi, tanggal mulai, metode bayar. Sistem otomatis kalkulasi tanggal jatuh tempo berikutnya.

**Kalender Jatuh Tempo Langganan**
Tampilan kalender yang menandai tanggal-tanggal di mana ada langganan jatuh tempo. Klik tanggal untuk lihat detail langganan apa yang jatuh tempo hari itu.

**Rekomendasi Batalkan atau Pertahankan Langganan**
AI analisis frekuensi transaksi terkait layanan tersebut vs biaya langganan. Contoh: Spotify Rp 54rb/bulan tapi tidak ada transaksi terkait musik dalam 2 bulan → rekomendasikan untuk dipertimbangkan dibatalkan.

**Buat & Kelola Tagihan Bersama**
Form buat split bill: nama tagihan, total nominal, tambah anggota (by nama, tidak perlu akun). Sistem kalkulasi otomatis bagian per orang, bisa custom nominal per orang jika tidak rata.

**Detail Tagihan Split Bill**
Halaman detail per tagihan: siapa saja yang terlibat, nominal masing-masing, status lunas/belum. Bisa tambah catatan per orang, misalnya "sudah transfer via GoPay."

**Kirim Reminder Split Bill & Tandai Lunas**
Dari halaman detail, user bisa tap nama orang dan pilih "kirim reminder" yang generate pesan WhatsApp siap kirim. Tandai pembayaran lunas per orang dengan satu tap.

**Harga Aset Real-Time**
Daftar aset populer (saham IDX, reksa dana, kripto, emas) dengan harga terkini dari API publik. Tampilkan perubahan harga 24 jam dalam nominal dan persentase.

**Watchlist & Price Alert**
User bisa tambah aset ke watchlist. Setiap aset di watchlist bisa diset price alert: notifikasi saat harga naik di atas atau turun di bawah nilai tertentu.

**Konverter Mata Uang & Kripto Real-Time**
Kalkulator konversi: pilih dari-ke mata uang atau kripto, input nominal, tampilkan hasil konversi dengan kurs terkini. Kurs dari API publik seperti ExchangeRate-API atau CoinGecko.

**Kalkulator Worth It / Cost-per-Use**
Input: harga barang, estimasi frekuensi pakai per minggu, estimasi durasi pakai dalam bulan. Output: cost per use dan perbandingan dengan alternatif lebih murah jika ada. Membantu user evaluasi pembelian impulsif.

**Chatbot AI Kasual & Tidak Menghakimi**
Chatbot berbasis LLM dengan system prompt yang diatur agar berbicara santai, menggunakan bahasa Indonesia sehari-hari, tidak menghakimi kebiasaan boros, dan memberikan saran yang realistis. User bisa tanya apa saja seputar keuangan pribadi.

**Prediksi Pengeluaran Bulan Depan**
Berdasarkan histori 3–6 bulan terakhir per kategori, sistem kalkulasi rata-rata dan tren, lalu tampilkan prediksi pengeluaran bulan depan per kategori. Tampilkan sebagai tabel dengan perbandingan ke bulan ini.

**Roasting Keuangan Mode**
User bisa aktifkan mode ini dari halaman analitik. AI menganalisis pola belanja user dan menyajikan insight dalam format roast santai yang menghibur tapi tetap akurat secara data. Hasilnya bisa di-screenshot dan dibagikan.

**Cek Harga Wajar**
User input nama produk atau layanan. AI cari referensi harga dari pengetahuannya dan beri penilaian: murah, wajar, atau mahal, beserta penjelasan singkat dan rekomendasi alternatif jika ada.

**Kalkulator Zakat**
Hitung zakat maal (aset), zakat penghasilan, dan zakat emas berdasarkan input user. Gunakan nisab emas terkini. Tampilkan nominal zakat yang harus dibayar dan rekomendasi lembaga zakat terpercaya.

**Estimasi PPh & Reminder SPT**
Berdasarkan total penghasilan yang dicatat di app, estimasi PPh terutang setahun menggunakan tarif progresif terbaru. Kirim reminder mendekati deadline lapor SPT Tahunan (31 Maret untuk orang pribadi).

**Promo QRIS Cashback & Diskon Terdekat**
Halaman kurator promo QRIS aktif dari berbagai bank dan e-wallet. Filter berdasarkan metode pembayaran dan kategori merchant. Data diupdate manual oleh admin atau melalui feed yang dikurasi.

**Badge & Reward Pencapaian**
Sistem achievement: user dapat badge saat capai milestone tertentu seperti "30 hari streak input transaksi," "Goals pertama selesai," atau "Budget tidak jebol 3 bulan berturut-turut." Tampilkan di halaman profil.

**Tantangan Menabung**
Tantangan preset yang bisa diikuti user: tantangan 52 minggu, tantangan no-spend weekend, tantangan hemat kopi sebulan. Setiap tantangan punya tracker progres dan notifikasi pengingat.

**Program Referral**
Setiap user punya kode referral unik. Saat teman register pakai kode tersebut dan aktif selama minimal 7 hari, keduanya dapat reward (bisa berupa akses premium trial atau badge khusus). Tampilkan histori referral dan reward di halaman profil.

---

## Phase 4 — Full Product (Bulan 11–16)

**Magic Link Login**
Opsi login tanpa password: user input email → sistem kirim link sekali pakai → klik link → langsung masuk. Link expired dalam 15 menit. Berguna untuk user yang lupa password atau malas ingat password.

**2FA TOTP, SMS, dan Email OTP**
Halaman setup 2FA di pengaturan keamanan. User pilih metode: TOTP via Google Authenticator/Authy, SMS OTP, atau email OTP. Setelah aktif, setiap login baru minta kode verifikasi kedua.

**Lock Screen Sesi Aktif**
Setelah app tidak digunakan selama X menit (bisa dikonfigurasi user), tampilkan lock screen yang minta PIN atau biometrik sebelum bisa lanjut. Tidak logout, hanya lock.

**Kuesioner Risk Profile**
Flow di onboarding: serangkaian pertanyaan tentang toleransi risiko, horizon investasi, pengalaman investasi, dan kondisi keuangan. Hasilkan profil risiko: konservatif, moderat, atau agresif, beserta rekomendasi alokasi aset.

**Pilih Tujuan Keuangan Utama**
Langkah onboarding setelah risk profile: user pilih 1–3 tujuan utama dari opsi yang ada (beli rumah, pensiun dini, dana pendidikan anak, liburan, dll). Tujuan ini mempengaruhi rekomendasi yang muncul di dashboard.

**Dashboard Portofolio Lengkap**
Dashboard khusus investasi: total nilai portofolio, total unrealized gain/loss, alokasi aset dalam pie chart, performa per aset dalam tabel, dan grafik pertumbuhan portofolio dari waktu ke waktu.

**Risk Score & Rekomendasi Rebalancing**
Berdasarkan alokasi portofolio aktual vs profil risiko user, sistem kalkulasi apakah portofolio sudah sesuai. Jika tidak, tampilkan rekomendasi rebalancing: aset mana yang perlu ditambah atau dikurangi dan berapa persennya.

**Mode Survival Dashboard**
Di minggu ketiga dan keempat bulan (atau saat budget tersisa kurang dari 30%), dashboard otomatis beralih ke tampilan "mode survival": hanya tampilkan sisa budget per kategori esensial, pengeluaran hari ini, dan alert jika ada kategori yang hampir habis.

**Simulasi Pensiun dengan Inflasi**
Kalkulator pensiun: input usia sekarang, target usia pensiun, estimasi pengeluaran bulanan saat pensiun, asumsi inflasi, dan asumsi return investasi. Output: total dana yang dibutuhkan saat pensiun dan berapa yang perlu ditabung per bulan mulai sekarang.

**Simulasi Dana Haji**
Kalkulator dana haji: input tahun rencana berangkat, estimasi kenaikan biaya haji per tahun (histori BPS), dana yang sudah terkumpul. Output: estimasi biaya saat berangkat, kekurangan dana, dan cicilan bulanan yang dibutuhkan.

**Tracking & Rekomendasi Asuransi**
User input asuransi yang dimiliki: jiwa, kesehatan, kendaraan, properti. Tampilkan ringkasan coverage, premi per bulan, dan tanggal jatuh tempo. AI berikan gap analysis: coverage apa yang sebaiknya dimiliki berdasarkan profil user tapi belum ada.

**Deteksi Emotional Spending**
Analisis korelasi antara waktu transaksi, hari dalam minggu, dan kategori. Identifikasi pola seperti belanja online melonjak tiap Minggu malam atau pembelian makanan mahal tiap hari Jumat. Tampilkan insight ini di halaman analitik perilaku.

**Analisis Kebiasaan Belanja per Waktu**
Heatmap atau grafik yang menunjukkan kapan user paling sering dan paling besar belanja: per jam, per hari, per minggu. Berguna untuk user mengenali pola dan memutuskan kapan sebaiknya tidak membuka marketplace.

**Deteksi Langganan dari Transaksi**
AI scan histori transaksi dan identifikasi pola pembayaran berulang dengan nominal sama dari merchant yang sama. Suggest ke user: "Sepertinya kamu berlangganan Netflix Rp 54.000/bulan — mau ditambahkan ke subscription tracker?"

**Perbandingan Savings Rate vs Standar Ideal**
Kalkulasi savings rate user (total tabungan / total pemasukan × 100%) dan bandingkan dengan benchmark: standar umum 20%, standar ideal per rentang penghasilan, dan rata-rata user di app. Tampilkan tren savings rate bulanan.

**Grafik Teknikal MA, RSI, MACD**
Di halaman detail aset di watchlist atau portofolio, tampilkan grafik candlestick dengan overlay indikator teknikal: Moving Average (MA5, MA20), RSI, dan MACD. Data dari API publik seperti Yahoo Finance atau Alpha Vantage.

**Sharia Screener**
Filter di halaman market untuk tampilkan hanya saham dan reksa dana yang memenuhi kriteria syariah: tidak bergerak di sektor terlarang (alkohol, rokok, judi, riba), rasio utang berbasis bunga di bawah threshold tertentu. Data screener dari DES OJK atau sumber terpercaya.

**Wrapped Tahunan Shareable**
Setiap akhir tahun (atau bisa di-trigger manual), generate halaman infografis personal: total pengeluaran setahun, kategori terboros, bulan paling hemat, goals yang selesai, jumlah transaksi dicatat. Bisa di-screenshot dan dibagikan ke media sosial.

**Rekap Mingguan Otomatis**
Setiap Senin pagi, user terima push notification dan email berisi rekap minggu lalu: total pengeluaran, perbandingan vs minggu sebelumnya, kategori terbesar, dan satu insight atau tips singkat.

**Rules Otomasi Pengelolaan Uang**
User bisa buat aturan otomatis berbasis kondisi: "Jika ada transaksi dari Shopee, kategorikan sebagai Belanja Online" atau "Jika pemasukan masuk lebih dari Rp 5 juta, pindahkan 20% ke goals tabungan." Rules dieksekusi otomatis saat kondisi terpenuhi.

**Round-up Transaksi ke Goals**
Setiap transaksi pengeluaran di-round up ke nominal bulat terdekat. Selisihnya (beberapa ratus rupiah) dikumpulkan dan ditambahkan ke goals yang dipilih user. Contoh: belanja Rp 23.400 → round up ke Rp 24.000 → Rp 600 masuk ke goals.

**Auto Split Gaji**
User set aturan: saat ada pemasukan masuk (deteksi dari transaksi dengan label "gaji"), otomatis split ke beberapa alokasi dengan persentase yang diset. Contoh: 50% kebutuhan, 30% keinginan, 20% tabungan. Tampilkan simulasi split sebelum dikonfirmasi.

**Vault Dokumen Terenkripsi**
Halaman upload dan simpan dokumen keuangan penting: KTP, NPWP, polis asuransi, akta properti, kontrak kerja. File dienkripsi sebelum disimpan di storage. Bisa diakses kapan saja dan didownload kembali.

**Jurnal Keuangan Harian dengan Mood Tracking**
Setiap hari user bisa tulis catatan singkat tentang kondisi keuangan atau keputusan finansial yang diambil, disertai pilihan mood (senang, stres, khawatir, optimis). Over time, tampilkan korelasi antara mood dan pola pengeluaran.

**Artikel & Kuis Literasi Keuangan**
Perpustakaan artikel edukasi keuangan personal dengan kategori: investasi dasar, manajemen utang, perencanaan pensiun, pajak, dll. Setiap artikel disertai kuis singkat. User dapat poin atau badge setelah selesai kuis.

**Simulator Investasi Virtual**
User bisa "beli" dan "jual" aset dengan uang virtual menggunakan data harga real. Portofolio virtual terpisah dari portofolio nyata. Berguna untuk belajar investasi tanpa risiko kehilangan uang asli.

**Kurikulum Literasi Keuangan Step-by-Step**
Learning path terstruktur: dari dasar (apa itu anggaran, cara menabung) sampai lanjut (diversifikasi portofolio, tax planning). Setiap modul punya artikel, video embed, dan kuis. Progress tersimpan dan ditampilkan di profil.

**Leaderboard Tabungan Anonim**
Ranking pengguna berdasarkan savings rate atau konsistensi budget bulanan. Semua data anonim, tidak ada nama asli atau foto profil yang tampil. User bisa lihat posisinya dan berapa jauh dari peringkat berikutnya.

**Manajemen Anggota Keluarga**
User utama bisa tambahkan anggota keluarga (pasangan, anak dewasa) ke dalam satu "household." Setiap anggota punya akun terpisah tapi bisa ada goals bersama, budget bersama, dan dashboard keluarga yang merangkum semua anggota.

**Konfigurasi Widget Mobile**
Halaman pengaturan widget untuk homescreen smartphone. User pilih widget mana yang aktif (saldo, progres budget, goals terdekat) dan ukurannya. Widget update otomatis sesuai data terbaru.

**Langganan Premium & Histori Pembayaran**
Halaman kelola subscription premium app: tampilkan plan aktif, tanggal renewal, fitur yang didapat. Histori semua pembayaran premium dengan invoice yang bisa didownload. Tombol upgrade, downgrade, atau batalkan langganan.

**Log Aktivitas & Sesi Aktif**
Halaman keamanan menampilkan daftar sesi login aktif: device, lokasi, waktu login. User bisa logout dari sesi tertentu secara remote. Log aktivitas menampilkan histori aksi penting: login, perubahan password, export data.

**Daftar Semua Pengguna (Admin)**
Halaman admin menampilkan semua user terdaftar dalam tabel dengan filter berdasarkan tanggal daftar, status akun (aktif/suspended), plan (free/premium), dan aktivitas terakhir. Bisa search by email atau nama.

**Detail & Aktivitas per Pengguna (Admin)**
Admin bisa klik satu user dan lihat detail lengkap: profil, histori login, jumlah transaksi, plan aktif, dan aktivitas penting dalam timeline. Berguna untuk support dan investigasi masalah.

**Edit Data & Status Pengguna (Admin)**
Admin bisa update status akun user (aktif/suspend/hapus), reset password, atau ubah plan secara manual. Setiap perubahan tercatat di log admin dengan timestamp dan ID admin yang melakukan.

**Kelola Roles & Permissions (Admin)**
Halaman manajemen role: admin bisa assign role berbeda ke tim internal (super admin, support, content editor). Setiap role punya akses yang berbeda ke fitur admin panel.

**Monitoring Sistem & Feature Flag (Admin)**
Dashboard monitoring: uptime API, error rate, jumlah upload yang diproses, queue AI. Feature flag untuk enable/disable fitur tertentu tanpa deploy ulang. Berguna untuk gradual rollout fitur baru ke sebagian user.

**CMS Konten (Admin)**
Editor artikel edukasi langsung dari admin panel: buat, edit, publish, atau arsipkan artikel. Kelola notifikasi broadcast: buat pesan push notification massal yang dikirim ke semua user atau segment tertentu.