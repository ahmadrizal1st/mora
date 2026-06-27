# Visatamora — Monorepo Setup Guide

Monorepo ini terdiri dari **4 aplikasi** yang saling terhubung. Semua service harus berjalan agar sistem berfungsi penuh.

```
apps/
├── api/        → Laravel 13 (REST API + Queue)
├── personal/   → React + Vite (Frontend)
├── ai/         → FastAPI (AI & Audio ML Service)
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
| Python | ^3.10 | AI FastAPI |
| PostgreSQL | ^14 | Laravel API |
| Poppler | latest | AI (pdf2image) |

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
APP_URL=https://api.mora.localhost
FRONTEND_URL=https://mora.localhost

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

# AI Service (untuk tracker Image & File)
AI_URL=http://localhost:8001/api/extract
AI_KEY=your-secret-api-key

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

> ⚠️ **Queue worker wajib dijalankan.** Tanpanya, semua proses AI/LLM (tracker image, file, text, audio) tidak akan dieksekusi meskipun data sudah tersimpan.

---

## 🤖 3. AI FastAPI Service (`apps/ai`)

Digunakan untuk tracker **Image**, **File**, dan **Audio**. Tracker **Text** tidak memerlukan service ini.

### Setup Pertama Kali

```bash
cd apps/ai

# 1. Buat virtual environment
python3 -m venv venv

# 2. Aktifkan venv
source venv/bin/activate  # macOS/Linux
# atau: venv\Scripts\activate  (Windows)

# 3. Install dependencies Python
pip install -r requirements.txt
# ⚠️ Proses ini lama — surya-ai & faster-whisper perlu download model ML

# 4. Salin dan konfigurasi env
cp .env.template .env
```

### Konfigurasi `.env`

```env
APP_NAME="AI Service"
APP_ENV="development"
APP_PORT=8001
APP_HOST="0.0.0.0"

UPLOAD_DIR="./uploads"
MODEL_CACHE_DIR="./.models"

# Harus sama dengan AI_KEY di apps/api/.env
API_KEY="vistamora_secure_secret_key_2026"
```

### Menjalankan AI Service

```bash
cd apps/ai
source venv/bin/activate

# Development (dengan auto-reload)
uvicorn main:app --reload --host 0.0.0.0 --port 8001

# Production (multi-worker)
uvicorn main:app --host 0.0.0.0 --port 8001 --workers 4
```

Service berjalan di: `http://localhost:8001`
Dokumentasi API: `http://localhost:8001/docs`

### Alternatif — Jalankan dengan Docker

```bash
cd apps/ai
docker-compose up --build
```

> Docker image memerlukan minimal **8GB RAM** (untuk model ML surya-ai & faster-whisper).

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

## 🌐 5. Caddy Server (Local HTTPS)

Project ini menyertakan `Caddyfile` di *root directory* untuk memudahkan akses melalui HTTPS menggunakan custom domain `*.localhost`. Caddy berfungsi sebagai *Reverse Proxy* untuk service-service di atas.

### Setup Caddy
Install Caddy (macOS menggunakan Homebrew):
```bash
brew install caddy
```

### Konfigurasi Domain
Berdasarkan `Caddyfile`, port yang diarahkan adalah:
- **mora.localhost** ──→ `127.0.0.1:5173` (Frontend)
- **api.mora.localhost** ──→ `127.0.0.1:8000` (Laravel API)
- **ai.mora.localhost** ──→ `127.0.0.1:8001` (AI Service)

### Menjalankan Caddy
Buka terminal di **folder root project (`visatamora/`)**:
```bash
caddy start  # Menjalankan di background
# ATAU
caddy run    # Menjalankan di foreground (terlihat log)
```

Setelah Caddy dan aplikasi lain berjalan, Anda bisa mengakses project di:
- **Frontend:** [https://mora.localhost](https://mora.localhost)
- **API:** [https://api.mora.localhost](https://api.mora.localhost)
- **AI Service:** [https://ai.mora.localhost](https://ai.mora.localhost)

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
# Restart queue
php artisan queue:restart
# Memproses job LLM (AI result → transaksi)
# Tanpa ini, hasil tracker TIDAK akan tersimpan ke database
```

**Terminal 3 — AI FastAPI ML Service** 
```bash
cd apps/ai
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8001
# Berjalan di: http://localhost:8001
# Dibutuhkan untuk tracker Image, File, dan Audio
# Tracker Text TIDAK memerlukan service ini
```

**Terminal 4 — Frontend React**
```bash
cd apps/personal
pnpm dev
# Berjalan di: http://localhost:5173
```

**Terminal 5 — Caddy (Reverse Proxy)**
```bash
caddy run
# Mengarahkan domain *.localhost ke port di atas
```

> ✨ **Akses Aplikasi:** Setelah semua service berjalan, buka browser Anda ke:
> - 🌐 **[http://mora.localhost](http://mora.localhost)** (Untuk melihat tampilan UI/Frontend)
> - ⚙️ **[http://api.mora.localhost](http://api.mora.localhost)** (Untuk mengakses API backend)

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
     (Image/File/Audio)               (Text — bypass AI)
               │                               │
               ▼                               │
┌──────────────────────────┐                   │
│   AI FastAPI (Python)   │                   │
│   :8001/api/extract      │                   │
│   surya-ai / whisper    │                   │
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
                    │  ProcessAIResult   │
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

| Fitur Tracker | PostgreSQL | Laravel API | Queue Worker | AI FastAPI | LLM Key |
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
| POST | `/api/documents/upload` | Upload file (AI) |
| POST | `/api/documents/text` | Input teks langsung (bypass AI) |
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

### AI Service tidak bisa diakses
- Pastikan venv aktif sebelum menjalankan uvicorn
- Pastikan port 8001 tidak dipakai proses lain: `lsof -i :8001`
- Pastikan `API_KEY` di `.env` AI sama dengan `AI_KEY` di `.env` Laravel

### Error saat install requirements.txt (AI)
- Pastikan Poppler terinstall: `brew install poppler`
- Jika `surya-ai` gagal, pastikan Python >= 3.10 dan pip terbaru: `pip install --upgrade pip`

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

# Reinstall AI Python
cd apps/ai
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
