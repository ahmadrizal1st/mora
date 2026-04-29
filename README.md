# Visatamora — Monorepo Setup Guide

Monorepo ini terdiri dari **4 aplikasi** yang saling terhubung. Semua service harus berjalan agar sistem berfungsi penuh.

```
apps/
├── api/        → Laravel 13 (REST API + Queue)
├── personal/   → React + Vite (Frontend)
├── ocr/        → FastAPI (OCR & Audio ML Service)
├── business/   → (coming soon)
└── logistic/   → (coming soon)
```

---

## 📋 Persyaratan Sistem

| Tool | Versi Minimum | Dibutuhkan oleh |
|------|--------------|-----------------|
| PHP | ^8.3 | Laravel API |
| Composer | latest | Laravel API |
| Node.js | ^20 | Frontend |
| pnpm | latest | Frontend |
| Python | ^3.10 | OCR FastAPI |
| PostgreSQL | ^14 | Laravel API |
| Poppler | latest | OCR (pdf2image) |

> Install Poppler di macOS: `brew install poppler`

---

## 🗄️ 1. Database (PostgreSQL)

Pastikan PostgreSQL sudah berjalan dan buat database:

```bash
psql -U postgres
```

```sql
CREATE DATABASE vistamora;
\q
```

Konfigurasi database ada di `apps/api/.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=vistamora
DB_USERNAME=postgres
DB_PASSWORD=123
```

---

## ⚙️ 2. Laravel API (`apps/api`)

### Setup Pertama Kali

```bash
cd apps/api

# 1. Install dependencies PHP
composer install

# 2. Salin file env
cp .env.example .env

# 3. Generate app key
php artisan key:generate

# 4. Jalankan migrasi database
php artisan migrate

# 5. (Opsional) Jalankan seeder jika tersedia
php artisan db:seed
```

### Konfigurasi `.env` Wajib

```env
# App
APP_URL=https://vistamora.test
FRONTEND_URL=https://mora.test:5173

# Database PostgreSQL
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=vistamora
DB_USERNAME=postgres
DB_PASSWORD=your_password

# Queue — WAJIB database agar LLM job berjalan
QUEUE_CONNECTION=database

# LLM Keys (salah satu wajib diisi)
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# OCR Service (untuk tracker Image & File)
OCR_URL=http://localhost:8000/api/extract
OCR_KEY=your-secret-api-key

# OAuth Google
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URL="${FRONTEND_URL}/auth/google/callback"

# Security
API_KEY=vistamora_secure_secret_key_2026
```

### Menjalankan API

**Cara 1 — Satu perintah (recommended, jalankan semua sekaligus):**

```bash
cd apps/api
composer run dev
```

> Perintah ini menjalankan secara bersamaan: Laravel server, Queue worker, Log viewer (Pail), dan Vite.

**Cara 2 — Manual (pisah terminal):**

```bash
# Terminal A — Laravel server
cd apps/api
php artisan serve
# Berjalan di: http://127.0.0.1:8000

# Terminal B — Queue Worker (WAJIB untuk LLM job)
cd apps/api
php artisan queue:work --tries=3

# Terminal C — (Opsional) Log viewer real-time
cd apps/api
php artisan pail
```

> ⚠️ **Queue worker wajib dijalankan.** Tanpanya, semua proses OCR/LLM (tracker image, file, text, audio) tidak akan dieksekusi meskipun data sudah tersimpan.

---

## 🤖 3. OCR FastAPI Service (`apps/ocr`)

Digunakan untuk tracker **Image**, **File**, dan **Audio**. Tracker **Text** tidak memerlukan service ini.

### Setup Pertama Kali

```bash
cd apps/ocr

# 1. Buat virtual environment
python3 -m venv venv

# 2. Aktifkan venv
source venv/bin/activate  # macOS/Linux
# atau: venv\Scripts\activate  (Windows)

# 3. Install dependencies Python
pip install -r requirements.txt
# ⚠️ Proses ini lama — surya-ocr & faster-whisper perlu download model ML

# 4. Salin dan konfigurasi env
cp .env.template .env
```

### Konfigurasi `.env`

```env
APP_NAME="OCR Service"
APP_ENV="development"
APP_PORT=8000
APP_HOST="0.0.0.0"

UPLOAD_DIR="./uploads"
MODEL_CACHE_DIR="./.models"

# Harus sama dengan OCR_KEY di apps/api/.env
API_KEY="vistamora_secure_secret_key_2026"
```

### Menjalankan OCR Service

```bash
cd apps/ocr
source venv/bin/activate

# Development (dengan auto-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production (multi-worker)
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

Service berjalan di: `http://localhost:8000`
Dokumentasi API: `http://localhost:8000/docs`

### Alternatif — Jalankan dengan Docker

```bash
cd apps/ocr
docker-compose up --build
```

> Docker image memerlukan minimal **8GB RAM** (untuk model ML surya-ocr & faster-whisper).

---

## 💻 4. Frontend React (`apps/personal`)

### Setup Pertama Kali

```bash
cd apps/personal

# Install dependencies
pnpm install
```

### Konfigurasi Environment

Buat file `.env.local` di `apps/personal/`:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

### Menjalankan Frontend

```bash
cd apps/personal
pnpm dev
# Berjalan di: http://localhost:5173 (atau port yang tersedia)
```

---

## 🚀 Urutan Menjalankan Semua Service

### Quick Start (setelah setup pertama kali selesai)

Buka **4 terminal** secara bersamaan:

**Terminal 1 — Laravel API Server**
```bash
cd apps/api
php artisan serve
# Berjalan di: http://127.0.0.1:8000
```

**Terminal 2 — Queue Worker ⚠️ WAJIB**
```bash
cd apps/api
php artisan queue:work --tries=3
# Memproses job LLM (OCR result → transaksi)
# Tanpa ini, hasil tracker TIDAK akan tersimpan ke database
```

**Terminal 3 — OCR FastAPI ML Service**
```bash
cd apps/ocr
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# Berjalan di: http://localhost:8000
# Dibutuhkan untuk tracker Image, File, dan Audio
# Tracker Text TIDAK memerlukan service ini
```

**Terminal 4 — Frontend React**
```bash
cd apps/personal
pnpm dev
# Berjalan di: http://localhost:5173
```

> 💡 **Shortcut:** Untuk Terminal 1 + 2 sekaligus, gunakan `composer run dev` di `apps/api`. Perintah ini menjalankan Laravel server, queue worker, dan log viewer dalam satu proses menggunakan `concurrently`.

```bash
# Alternatif — Terminal 1 & 2 digabung
cd apps/api && composer run dev
```

---

## 🗺️ Arsitektur & Alur per Fitur Tracker

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Frontend (React/Vite)                       │
│                         :5173                                       │
└─────────────────────────┬───────────────────────────────────────────┘
                          │ HTTP Request
                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Laravel API (PHP 8.3)                          │
│                      :8000                                          │
│                                                                     │
│  POST /api/documents/upload  ──→ [upload()]                         │
│  POST /api/documents/text    ──→ [processText()]                    │
└──────────────┬───────────────────────────────┬──────────────────────┘
               │                               │
     (Image/File/Audio)               (Text — bypass OCR)
               │                               │
               ▼                               │
┌──────────────────────────┐                   │
│   OCR FastAPI (Python)   │                   │
│   :8000/api/extract      │                   │
│   surya-ocr / whisper    │                   │
└──────────────┬───────────┘                   │
               │ raw_text                      │ raw_text
               └───────────────┬───────────────┘
                                ▼
                    ┌─────────────────────┐
                    │  Database Queue     │
                    │  (PostgreSQL)       │
                    └──────────┬──────────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │  Queue Worker       │
                    │  ProcessOCRResult   │
                    │  (php artisan       │
                    │   queue:work)       │
                    └──────────┬──────────┘
                                │
                                ▼
                    ┌─────────────────────┐
                    │  LLM Mapper         │
                    │  (Gemini / Groq)    │
                    └──────────┬──────────┘
                                │ structured JSON
                                ▼
                    ┌─────────────────────┐
                    │  transactions table │
                    │  (PostgreSQL)       │
                    └─────────────────────┘
```

### Service yang Dibutuhkan per Fitur

| Fitur Tracker | PostgreSQL | Laravel API | Queue Worker | OCR FastAPI | LLM Key |
|---------------|:----------:|:-----------:|:------------:|:-----------:|:-------:|
| **Text**      | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Image**     | ✅ | ✅ | ✅ | ✅ | ✅ |
| **File**      | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Audio**     | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🔑 API Endpoints Utama

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/register` | Registrasi |
| GET | `/api/transactions` | List transaksi |
| POST | `/api/documents/upload` | Upload file (OCR) |
| POST | `/api/documents/text` | Input teks langsung (bypass OCR) |
| GET | `/api/budgets` | List budget |
| GET | `/api/currencies` | List mata uang |

---

## 🐛 Troubleshooting

### `"The selected doc type is invalid."`
- Pastikan `doc_type` yang dikirim adalah salah satu dari: `invoice`, `receipt`, `ktp`, `audio_note`, `expense`

### Transaksi tidak muncul setelah upload
- Pastikan **Queue Worker** berjalan: `php artisan queue:work`
- Cek log: `php artisan pail` atau `storage/logs/laravel.log`
- Cek status job: `SELECT * FROM jobs;` di database

### OCR Service tidak bisa diakses
- Pastikan venv aktif sebelum menjalankan uvicorn
- Pastikan port 8000 tidak dipakai proses lain: `lsof -i :8000`
- Pastikan `API_KEY` di `.env` OCR sama dengan `OCR_KEY` di `.env` Laravel

### Error saat install requirements.txt (OCR)
- Pastikan Poppler terinstall: `brew install poppler`
- Jika `surya-ocr` gagal, pastikan Python >= 3.10 dan pip terbaru: `pip install --upgrade pip`

---

## 🔄 Reset & Fresh Install

```bash
# Reset database Laravel
cd apps/api
php artisan migrate:fresh --seed

# Clear cache Laravel
php artisan cache:clear
php artisan config:clear
php artisan queue:clear

# Reinstall frontend
cd apps/personal
rm -rf node_modules
pnpm install

# Reinstall OCR Python
cd apps/ocr
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
