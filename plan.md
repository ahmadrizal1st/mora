# 🛠️ Rencana Implementasi Sinkronisasi Frontend & Backend (Visatamora)

Dokumen ini adalah cetak biru (blueprint) teknis untuk mengimplementasikan fitur-fitur yang masih gantung (belum memiliki backend) secara berurutan.

## TAHAP 0: Simplifikasi & Pembersihan (Hasil Review Mendalam)
Setelah melakukan inspeksi menyeluruh (deep-dive) terhadap seluruh komponen, routing, dan *mock data* di frontend `apps/personal`, saya telah memverifikasi mana tabel/fitur backend yang benar-benar dipakai dan mana yang menjadi *dead weight* (beban mati).

**Koreksi Penting:** 
1. Tabel `split_bills` **TIDAK JADI DIHAPUS**, karena *property* `split_bill_id` ternyata digunakan dalam formulir transaksi di frontend (`transaction.types.ts`).
2. Tabel `leaderboard_snapshots` **TIDAK JADI DIHAPUS**, karena halaman *Achievements* memiliki komponen *Weekly Leaderboard*.
3. Fitur **Aset** (`AssetsPage.tsx`) ternyata *tidak mengambil data dari tabel assets*, melainkan hanya menjumlahkan saldo dari tabel `accounts` yang bertipe *investment* dan *saving*. Jadi tabel `assets` di backend benar-benar tidak terpakai!

**Daftar Tabel yang PASTI DIHAPUS (Migration Cleanup):**
- **Investasi Lanjutan (Tidak dipakai UI):** `assets`, `asset_price_history`, `portfolios`, `dividend_events`, `watchlists`.
- **Fitur Spesifik (Tidak ada UI-nya):** `zakat_calculations`, `insurance_policies`.
- **Sosial/Keluarga (Tidak ada UI-nya):** `families`, `family_members`.
- **Otomatisasi & Rekap (Tidak ada UI-nya):** `automation_rules`, `round_up_configs`, `salary_split_configs`, `weekly_recaps`, `shareable_cards`.

*Kita akan membuat migration `php artisan make:migration drop_unused_overengineered_tables` untuk mengeksekusinya secara rapi.*

---

## TAHAP 1: Database & Migrations (Struktur Tabel)
Kita akan menyesuaikan skema PostgreSQL agar cocok dengan ekspektasi frontend.

### 1.1 Tabel Baru: `debts` (Utang Piutang)
Frontend memiliki fitur ini secara penuh, namun database belum punya.
`php artisan make:migration create_debts_table`

**Kolom:**
- `id` (uuid, primary), `user_id` (uuid, foreign key)
- `person_name` (string), `description` (text, nullable)
- `type` (enum: 'utang', 'piutang')
- `amount` (decimal), `amount_paid` (decimal)
- `status` (string), `priority` (string), `due_date` (date)
- `timestamps`

### 1.2 Penyesuaian Tabel: `goals` (Target/Planning)
Tabel `goals` sudah ada, tapi kurang atribut UI.
`php artisan make:migration add_visual_fields_to_goals_table`

**Aksi:**
- **Tambah kolom:** `monthly_deposit` (decimal), `icon` (string), `color` (string), `image_url` (string).
- **Hapus kolom (Opsional):** `linked_account_id` dan `type` (karena frontend hanya butuh nama, target, progress, dan visual icon).

### 1.3 Penyesuaian Tabel: `subscriptions` (Langganan)
Tabel `subscriptions` sudah ada, kurang penanda status dan visual ikon.
`php artisan make:migration add_visual_fields_to_subscriptions_table`

**Aksi:**
- **Tambah kolom:** `status` (string), `icon` (string), `color` (string).
- **Hapus kolom (Opsional):** `last_transaction_id` (karena frontend hanya melacak status aktif/bayar per siklus secara mandiri).

---

## TAHAP 2: Eloquent Models (Lapisan ORM)
Setelah tabel siap, kita memperbarui model PHP-nya.

1. **Model `Debt`**: Buat model baru beserta `$fillable` dan relasinya.
2. **Model `Goal` & `Subscription`**: Tambahkan field visual yang baru dibuat ke dalam array `$fillable`.

---

## TAHAP 3: Controller & Routes (Lapisan API Backend)

1. **Buat `DebtController`**: Menyediakan fungsi index, store, update, destroy.
2. **Buat `GoalController` & `SubscriptionController`**: Walau modelnya sudah ada, controllernya belum. Kita buatkan agar React bisa `fetch`.
3. **Update `AccountController`**: Tambahkan method `summary()` yang mengembalikan JSON komprehensif (Saldo, Transaksi Terakhir, Kategori Pengeluaran) agar pas dengan ekspektasi halaman `Accounts`.
4. **Registrasi Routes**: Daftarkan semua controller di atas ke `routes/api.php` (`apiResource`).

---

## TAHAP 4 & 5: Frontend Integration (React Query & Axios)
1. **Definisi Tipe (TypeScript):** Membuat interface seperti `DebtRecord` di `src/shared/types/`.
2. **API Clients & React Query:** Membuat *service file* dan *custom hooks* (seperti `useGetDebts`).
3. **Ganti Mock Data:** Menghapus `MOCK_DEBTS_DATA` dari UI dan menggantinya dengan data asli dari database.
