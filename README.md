# Morapi Monorepo

Monorepo fintech personal finance management. Terdiri dari **3 aplikasi**:

| App | Tech | Port |
|-----|------|------|
| `apps/api` | Laravel 13 (PHP 8.3) — REST API + Queue | `:8000` |
| `apps/personal` | React 19 + Vite (TypeScript) — Frontend | `:5173` |
| `apps/ai` | FastAPI (Python) — AI/ML Service (OCR, STT) | `:8001` |

## Quick Start

### Lokal (langsung)

```bash
./morapi run
```

Akses: **https://morapi.localhost** — Login: `user@morapi.com` / `password`

> Butuh `caddy` untuk akses HTTPS via `*.morapi.localhost`. Install: `brew install caddy`

### Docker

```bash
./morapi run docker
```

Akses: **http://localhost:5173** (tidak perlu Caddy)

> Service AI butuh min **8GB RAM** untuk model ML.

## Persyaratan Sistem

| Tool | Versi | Untuk |
|------|-------|-------|
| PHP | ^8.3 | Laravel API |
| Composer | latest | Laravel API |
| Node.js | ^20 | Frontend |
| pnpm | latest | Frontend |
| PostgreSQL | ^14 | Database |
| Caddy | latest | Reverse Proxy (opsional) |

## Konfigurasi `.env`

### API (`apps/api/.env`)

Edit jika perlu:

```env
DB_DATABASE=morapi
DB_USERNAME=postgres
DB_PASSWORD=123

# LLM API Keys (salah satu wajib untuk fitur tracker)
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key

# API Key untuk middleware (harus sama dengan frontend)
API_KEY=morapipipi_secure_api_key_2026
```

### Frontend (`apps/personal/.env`)

```env
VITE_API_URL=http://127.0.0.1:8000
VITE_API_KEY=morapipipi_secure_api_key_2026   # Harus sama dengan API_KEY di api/.env
```

## Manual Setup

```bash
# API
cd apps/api
cp .env.example .env               # lalu edit .env
composer install
php artisan key:generate
php artisan migrate --seed

# Frontend
cd apps/personal
cp .env.example .env                # lalu edit .env
pnpm install
```

## Service per Fitur

| Fitur | PostgreSQL | API | Queue Worker | AI FastAPI | LLM Key |
|-------|:----------:|:---:|:------------:|:----------:|:-------:|
| Text | ✅ | ✅ | ✅ | ❌ | ✅ |
| Image | ✅ | ✅ | ✅ | ✅ | ✅ |
| File | ✅ | ✅ | ✅ | ✅ | ✅ |
| Audio | ✅ | ✅ | ✅ | ✅ | ✅ |

> Queue Worker WAJIB jalan. Tanpanya hasil tracker tidak akan diproses ke database.

## API Endpoints

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Registrasi |
| GET | `/api/transactions` | List transaksi |
| POST | `/api/documents/upload` | Upload file (Image/File/Audio) |
| POST | `/api/documents/text` | Input teks langsung |
| GET | `/api/budgets` | List budget |
| GET | `/api/currencies` | List mata uang |

## Troubleshooting

**Login gagal ("Email atau password salah")**
- Cek PostgreSQL sudah jalan
- Cek `php artisan migrate --seed` sudah dijalankan

**401 Unauthorized**
- Login dulu lewat halaman login

**403 Forbidden**
- Cek `VITE_API_KEY` di frontend `.env` sama dengan `API_KEY` di backend `.env`

**Transaksi tidak muncul setelah upload**
- Queue worker belum jalan: `php artisan queue:work --tries=3`

## Stop Services

### Lokal

```bash
./morapi stop
```

### Docker

```bash
docker compose down
```
