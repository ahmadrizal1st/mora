# Eksekusi Bertahap: Database Migration & Codebase Refactoring

Dokumen ini berisi *step-by-step roadmap* agar proses *migration* dari nol (*from scratch*) dan *refactoring codebase* bisa dilakukan secara bertahap tanpa memberikan beban konteks yang terlalu besar pada satu waktu eksekusi.

Pendekatan yang kita gunakan: **Hapus semua file migration lama, lalu buat ulang sesuai ERD terbaru.**

> [!IMPORTANT]
> Semua tabel sekarang menggunakan **UUID** sebagai Primary Key (`id`) dan Foreign Key, bukan lagi auto-incrementing integer (kecuali untuk tabel metadata Laravel tertentu jika diperlukan).

---

## Tahap 1: Database Setup (Laravel Migrations)

### Step 1: Wipe & Core Migration
- **Aksi:** Hapus seluruh isi folder `apps/api/database/migrations`.
- **Aksi:** Buat ulang file migration dasar dengan konvensi Laravel bawaan (`sessions`, `cache`, `jobs`).
- **Aksi:** Buat file migration untuk modul **Users & Auth** (`users`, `otp_codes`, `family_members`, `user_settings`, `personal_access_tokens`).
- **Aksi:** Buat file migration untuk modul inti **Cashflow** tahap awal (`currencies`, `accounts`, `categories`, `tags`, `statuses`, `recurring_types`, `transactions`, `transaction_tags`).
- **Validasi:** Jalankan `php artisan migrate`.

### Step 2: Extended Cashflow & Budgeting
- **Aksi:** Buat file migration untuk fitur ekstensi Cashflow: `account_balances`, `budget_plans`, `budget_items`, `budget_item_categories`, `split_bills`, `split_participants`, `subscriptions`, `reminders`, `automation_rules`, `round_up_configs`, `salary_split_configs`.
- **Validasi:** Jalankan `php artisan migrate`.

### Step 3: AI, Wealth, Credit & Planning
- **Aksi:** Buat migration untuk **AI**: `document_extractions` (pengganti `documents`), `llm_providers`.
- **Aksi:** Buat migration untuk **Wealth**: `assets`, `asset_price_history`, `portfolios`, `watchlists`, `dividend_events`.
- **Aksi:** Buat migration untuk **Credit & Planning**: `credit_accounts` (pengganti `credits`), `credit_schedules`, `goals`, `insurance_policies`, `zakat_calculations`, `notifications`.
- **Aksi:** Buat migration untuk **Ecosystem**: `vault_documents`, `news_preferences`, `learning_progress`.
- **Validasi:** Jalankan `php artisan migrate`.

### Step 4: Gamification & Final Check
- **Aksi:** Buat migration untuk ekosistem **Gamification** (`gamification_profiles`, `streaks`, `quests`, `user_quests`, `badges`, `user_badges`, `challenges`, `challenge_participants`, `referrals`, `reward_items`, `reward_redemptions`, `leaderboard_snapshots`, `weekly_recaps`, `shareable_cards`).
- **Validasi:** Jalankan `php artisan migrate:fresh` untuk memastikan seluruh database dari Step 1-4 terbentuk dengan sempurna tanpa error relasi (*Foreign Keys*).

---

## Tahap 2: Backend Refactoring (Laravel API)

### Step 5: Models & Relationships
- **Aksi:** Hapus model `Document` dan buat model `DocumentExtraction`.
- **Aksi:** Hapus model `Credit` dan buat model `CreditAccount`.
- **Aksi:** Perbarui properti `$fillable` dan `$casts` di model `Account` (`account_type`), `Transaction` (`exchange_rate`, `input_method`), `BudgetPlan` (`budget_method`, `period`).
- **Aksi:** Tambahkan seluruh relasi baru (metode `hasMany`, `belongsTo`) di model `User`, `Transaction`, dan `Account` sesuai struktur ERD.

### Step 6: Requests, DTOs, dan Services
- **Aksi:** Perbarui validasi di Form Requests (misal: `StoreTransactionRequest` diubah dari `rate_snapshot` menjadi `exchange_rate`).
- **Aksi:** Perbarui `TransactionData` dan DTO lainnya agar menampung key baru.
- **Aksi:** Refactor *business logic* di `TransactionService` dan `AccountService`.
- **Aksi:** Refactor `ProcessAIResult` Job dan `LLMMapper` Service agar menyimpan data ke `DocumentExtraction` dengan `document_type` dan `parsed_data`.

---

## Tahap 3: Database Seeding & Data Adjustments

### Step 7: Update Factories & Seeders
- **Aksi:** Buka `DatabaseSeeder.php` dan file factory/seeder yang ada (`UserSeeder`, `AccountSeeder`, `TransactionSeeder` dll).
- **Aksi:** Sesuaikan *dummy data* agar cocok dengan nama kolom baru (gunakan `account_type`, `exchange_rate`, `input_method`).
- **Aksi:** Tambahkan dummy data untuk tabel krusial yang baru (seperti `user_settings` atau `gamification_profiles`) agar aplikasi dapat berjalan tanpa error saat di-test.
- **Validasi:** Jalankan `php artisan migrate:fresh --seed` untuk memastikan data dummy berhasil masuk ke struktur database baru.

---

## Tahap 4: AI Service Refactoring (FastAPI)

### Step 8: Update Pydantic Schemas
- **Aksi:** Buka `apps/ai/main.py` atau file pydantic schemas.
- **Aksi:** Pastikan format JSON yang dikembalikan oleh AI ke backend saat ekstraksi dokumen sesuai dengan penamaan baru (contohnya memastikan tidak ada lagi pengiriman key `doc_type` tapi `document_type`).

---

## Tahap 5: Frontend Refactoring (React Vite)

### Step 9: Update TypeScript Interfaces & API Types
- **Aksi:** Cari interface yang lama di `apps/personal/src/types/` (atau lokasinya) dan update tipe propertinya:
  - `Account`: `type` -> `account_type`.
  - `Transaction`: `rate_snapshot` -> `exchange_rate`, `tracker` -> `input_method`.
  - `Document`: ubah menjadi `DocumentExtraction` dan `extracted_data` -> `parsed_data`.
- **Aksi:** Update API Payload Types untuk *mutation* di react-query/Zustand.

### Step 10: Component & UI Fixes
- **Aksi:** Refactor komponen form: `AccountsPage`, modul transaksi, dll agar mengirim parameter yang benar saat submit.
- **Aksi:** Refactor `TransactionTable` dan `TransactionSummaryCards` agar me-render data dari properti JSON yang baru.
- **Aksi:** Perbaiki logika *routing* atau *state* jika ada fitur yang *break* karena perubahan ini.

---

## Bagaimana Cara Eksekusi?
Karena plan ini sudah dibagi ke dalam **10 Step kecil**, Anda hanya perlu menginstruksikan saya:
> "Jalankan Step 1"

Setelah Step 1 selesai dan divalidasi, kita bisa lanjut ke Step berikutnya agar prosesnya stabil dan terukur.
