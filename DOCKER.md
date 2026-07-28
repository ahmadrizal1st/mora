# 🐳 Morapi — Docker Setup Guide

Monorepo ini mendukung deployment menggunakan Docker & Docker Compose untuk memudahkan setup development dan production.

## 🏗️ Struktur Docker

- **db**: PostgreSQL 16 (Port 5432)
- **api**: Laravel 13 (Port 8000)
- **worker**: Laravel Queue Worker (Background processing)
- **ai**: FastAPI Service (Port 8001)
- **frontend**: React + Vite (Port 5173)

---

## 🚀 Quick Start

### 1 Perintah

```bash
./run.sh docker
```

### Atau Manual

```bash
# 1. Persiapan .env
cp apps/api/.env.example apps/api/.env
cp apps/ai/.env.template apps/ai/.env

# 2. Build & jalankan
docker compose up -d --build

# 3. Setup awal Laravel (sekali)
docker exec morapi_api php artisan key:generate --force
docker exec morapi_api php artisan migrate --force
docker exec morapi_api php artisan db:seed --force
```

---

## 🔗 Akses Service

| Service | URL |
|---------|-----|
| **Frontend** | [http://localhost:5173](http://localhost:5173) |
| **API Backend** | [http://localhost:8000](http://localhost:8000) |
| **AI Documentation** | [http://localhost:8001/docs](http://localhost:8001/docs) |
| **Database** | `localhost:5432` (User: `postgres`, Pass: `123`) |

---

## 🛠️ Perintah Berguna

### Melihat Log

```bash
# Log semua service
docker-compose logs -f

# Log service tertentu
docker-compose logs -f api
docker-compose logs -f ai
```

### Restart Service

```bash
docker-compose restart api
```

### Masuk ke Shell Container

```bash
# Masuk ke Laravel
docker exec -it morapi_api bash

# Masuk ke AI
docker exec -it morapi_ai bash
```

---

## ⚠️ Catatan Penting

1. **Memory AI**: Service AI membutuhkan memory cukup besar (minimal 8GB direkomendasikan) untuk memuat model ML (surya-ai & whisper).
2. **Network**: Semua container berada dalam satu network Docker. Service `api` memanggil `db` menggunakan hostname `db`, dan memanggil `ai` menggunakan hostname `ai`.
3. **Persistensi**: Data database disimpan di volume `pgdata`, dan model AI disimpan di volume `ai_models` agar tidak download ulang saat container restart.
