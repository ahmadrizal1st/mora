# 🚀 Morapi — Deployment Guide (Ubuntu 24 LTS)

Panduan ini berlaku untuk deployment ke:
- **Multipass** (VM lokal di macOS untuk staging/testing)
- **VPS Ubuntu 24 LTS** (production: DigitalOcean, Vultr, Hetzner, dll.)

---

## 📐 Arsitektur Deployment

```
Internet / Browser
        │
        ▼
┌───────────────────────┐
│      Nginx            │  Port 80 / 443
│  (Reverse Proxy)      │
└──────┬────────────────┘
       │
       ├──→ api.morapi.com  ──→ Laravel API  :9000 (php-fpm)
       ├──→ ai.morapi.com   ──→ FastAPI AI   :8001 (uvicorn)
       └──→ morapi.com      ──→ React Build  (static files)

                    ▼
            PostgreSQL :5432
```

> **Port Layout:**
> | Service | Internal Port |
> |---------|--------------|
> | PHP-FPM (Laravel) | unix socket |
> | Uvicorn (FastAPI AI) | 8001 |
> | Nginx | 80 / 443 |
> | PostgreSQL | 5432 |

---

## 🖥️ BAGIAN 1 — Setup Multipass (Opsional, untuk lokal/staging)

Jika kamu menggunakan VPS langsung, lewati bagian ini dan lanjut ke Bagian 2.

### 1.1 Install Multipass di macOS

```bash
brew install --cask multipass
```

### 1.2 Buat Instance Ubuntu 24 LTS

```bash
# Buat VM dengan resource yang memadai
# Minimum: 4 CPU, 8GB RAM (untuk surya-ocr ML model)
multipass launch 24.04 \
  --name morapi \
  --cpus 4 \
  --memory 8G \
  --disk 40G

# Masuk ke VM
multipass shell morapi
```

### 1.3 Cek IP Instance

```bash
# Di host macOS (bukan di dalam VM)
multipass info morapi
# Catat IP-nya, misal: 192.168.64.10
```

### 1.4 Mount Project ke VM (Opsional)

```bash
# Mount dari macOS ke VM untuk sync kode langsung
multipass mount /Users/macbook/Documents/morapi morapi:/home/ubuntu/morapi
```

> Atau gunakan `git clone` di dalam VM (lebih direkomendasikan untuk production).

---

## 🛠️ BAGIAN 2 — Persiapan Server Ubuntu 24 LTS

Semua perintah berikut dijalankan **di dalam server/VM Ubuntu**.

### 2.1 Update Sistem

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip software-properties-common
```

### 2.2 Install PHP 8.3 + Extensions

```bash
# Tambah repository PHP Ondrej
sudo add-apt-repository ppa:ondrej/php -y
sudo apt update

# Install PHP 8.3 dan semua ekstensi yang dibutuhkan Laravel
sudo apt install -y \
  php8.3 php8.3-fpm php8.3-cli \
  php8.3-pgsql php8.3-mbstring php8.3-xml \
  php8.3-curl php8.3-zip php8.3-bcmath \
  php8.3-gd php8.3-intl

# Verifikasi
php -v
```

### 2.3 Install Composer

```bash
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
composer --version
```

### 2.4 Install Node.js 20 + pnpm

```bash
# Install Node.js 20 via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Verifikasi
node -v   # v20.x.x
pnpm -v
```

### 2.5 Install Python 3.10+ + pip + venv

```bash
sudo apt install -y python3 python3-pip python3-venv python3-dev

# Verifikasi
python3 --version   # 3.12.x (Ubuntu 24 sudah include Python 3.12)
pip3 --version
```

### 2.6 Install Poppler (untuk pdf2image di OCR)

```bash
sudo apt install -y poppler-utils libpoppler-dev

# Verifikasi
pdfinfo --version
```

### 2.7 Install PostgreSQL 16

```bash
sudo apt install -y postgresql postgresql-contrib

# Start & enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verifikasi
sudo -u postgres psql -c "SELECT version();"
```

### 2.8 Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2.9 Install Supervisor (Process Manager)

```bash
sudo apt install -y supervisor
sudo systemctl start supervisor
sudo systemctl enable supervisor
```

---

## 🗄️ BAGIAN 3 — Setup Database PostgreSQL

```bash
# Masuk sebagai user postgres
sudo -u postgres psql
```

```sql
-- Buat user dan database
CREATE USER morapi WITH PASSWORD 'ganti_password_kuat_ini';
CREATE DATABASE morapi OWNER morapi;
GRANT ALL PRIVILEGES ON DATABASE morapi TO morapi;
\q
```

---

## 📂 BAGIAN 4 — Deploy Kode Aplikasi

### 4.1 Clone Repository

```bash
# Buat direktori aplikasi
sudo mkdir -p /var/www/morapi
sudo chown $USER:$USER /var/www/morapi

# Clone repo
cd /var/www/morapi
git clone https://github.com/your-username/morapi.git .
```

---

## ⚙️ BAGIAN 5 — Setup Laravel API (`apps/api`)

### 5.1 Install Dependencies

```bash
cd /var/www/morapi/apps/api

# Install PHP dependencies (tanpa dev dependencies)
composer install --optimize-autoloader --no-dev
```

### 5.2 Konfigurasi Environment

```bash
cp .env.example .env
nano .env
```

Isi `.env` untuk production:

```env
APP_NAME="Morapi API"
APP_ENV=production
APP_KEY=                          # akan di-generate
APP_DEBUG=false
APP_URL=https://api.morapi.com

FRONTEND_URL=https://morapi.com

# Database
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=morapi
DB_USERNAME=morapi
DB_PASSWORD=ganti_password_kuat_ini

# Queue — WAJIB pakai database
QUEUE_CONNECTION=database

# LLM Keys
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# AI Service — port 8001 (internal, tidak expose ke luar)
AI_URL=http://127.0.0.1:8001/api/extract
AI_KEY=morapi_secure_secret_key_2026

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URL="${FRONTEND_URL}/auth/google/callback"

# Security
API_KEY=morapi_secure_secret_key_2026
```

### 5.3 Generate Key & Migrasi

```bash
cd /var/www/morapi/apps/api

# Generate app key
php artisan key:generate

# Jalankan migrasi
php artisan migrate --force

# (Opsional) Seeder
php artisan db:seed --force

# Optimize untuk production
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 5.4 Permissions

```bash
# Beri permission ke storage dan bootstrap/cache
sudo chown -R www-data:www-data /var/www/morapi/apps/api/storage
sudo chown -R www-data:www-data /var/www/morapi/apps/api/bootstrap/cache
sudo chmod -R 775 /var/www/morapi/apps/api/storage
sudo chmod -R 775 /var/www/morapi/apps/api/bootstrap/cache
```

---

## 🤖 BAGIAN 6 — Setup OCR FastAPI (`apps/ocr`)

### 6.1 Buat Virtual Environment

```bash
cd /var/www/morapi/apps/ocr

# Buat venv
python3 -m venv venv
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies (proses ini lama — download model ML)
pip install -r requirements.txt
```

> ⚠️ `surya-ocr` dan `faster-whisper` akan mendownload model yang cukup besar.
> Pastikan disk free minimal **10GB** dan koneksi stabil.

### 6.2 Konfigurasi Environment OCR

```bash
cp .env.template .env
nano .env
```

```env
APP_NAME="AI Service"
APP_ENV="production"
APP_PORT=8001
APP_HOST="127.0.0.1"

UPLOAD_DIR="./uploads"
MODEL_CACHE_DIR="./.models"

# Harus sama dengan AI_KEY di apps/api/.env
API_KEY="morapi_secure_secret_key_2026"
```

### 6.3 Test Jalankan Manual (untuk verifikasi)

```bash
cd /var/www/morapi/apps/ai
source venv/bin/activate

uvicorn main:app --host 127.0.0.1 --port 8001 --workers 2
# Ctrl+C setelah verifikasi berhasil
```

---

## 💻 BAGIAN 7 — Build Frontend React (`apps/personal`)

```bash
cd /var/www/morapi/apps/personal

# Install dependencies
pnpm install

# Buat file .env untuk production
cat > .env.production << 'EOF'
VITE_API_URL=https://api.morapi.com/api
EOF

# Build untuk production
pnpm build
# Output ada di: apps/personal/dist/
```

---

## 🔧 BAGIAN 8 — Konfigurasi Nginx

### 8.1 Konfigurasi untuk Laravel API

```bash
sudo nano /etc/nginx/sites-available/morapi-api
```

```nginx
server {
    listen 80;
    server_name api.morapi.com;
    root /var/www/morapi/apps/api/public;
    index index.php;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    # Max upload size (untuk dokumen OCR)
    client_max_body_size 50M;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 300;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    access_log /var/log/nginx/morapi-api-access.log;
    error_log  /var/log/nginx/morapi-api-error.log;
}
```

### 8.2 Konfigurasi untuk FastAPI AI

```bash
sudo nano /etc/nginx/sites-available/morapi-ai
```

```nginx
server {
    listen 80;
    server_name ai.morapi.com;

    client_max_body_size 100M;

    location / {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300;
        proxy_connect_timeout 60;
    }

    access_log /var/log/nginx/morapi-ai-access.log;
    error_log  /var/log/nginx/morapi-ai-error.log;
}
```

### 8.3 Konfigurasi untuk Frontend React

```bash
sudo nano /etc/nginx/sites-available/morapi-frontend
```

```nginx
server {
    listen 80;
    server_name morapi.com www.morapi.com;
    root /var/www/morapi/apps/personal/dist;
    index index.html;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback — semua route ke index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    access_log /var/log/nginx/morapi-frontend-access.log;
    error_log  /var/log/nginx/morapi-frontend-error.log;
}
```

### 8.4 Aktifkan Konfigurasi Nginx

```bash
# Enable semua site
sudo ln -s /etc/nginx/sites-available/morapi-api      /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/morapi-ai      /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/morapi-frontend /etc/nginx/sites-enabled/

# Hapus default config
sudo rm -f /etc/nginx/sites-enabled/default

# Test konfigurasi
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## 👷 BAGIAN 9 — Supervisor (Process Manager)

Supervisor memastikan Laravel Queue Worker dan Uvicorn berjalan terus-menerus dan otomatis restart jika crash.

### 9.1 Supervisor untuk Laravel Queue Worker

```bash
sudo nano /etc/supervisor/conf.d/morapi-queue.conf
```

```ini
[program:morapi-queue]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/morapi/apps/api/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/log/supervisor/morapi-queue.log
stopwaitsecs=3600
```

### 9.2 Supervisor untuk FastAPI AI

```bash
sudo nano /etc/supervisor/conf.d/morapi-ai.conf
```

```ini
[program:morapi-ai]
process_name=%(program_name)s
command=/var/www/morapi/apps/ai/venv/bin/uvicorn main:app --host 127.0.0.1 --port 8001 --workers 2
directory=/var/www/morapi/apps/ai
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
redirect_stderr=true
stdout_logfile=/var/log/supervisor/morapi-ai.log
environment=HOME="/var/www/morapi/apps/ai"
```

### 9.3 Aktifkan Supervisor

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all

# Cek status
sudo supervisorctl status
```

Output yang diharapkan:
```
morapi-ai          RUNNING   pid 12345, uptime 0:00:05
morapi-queue:00     RUNNING   pid 12346, uptime 0:00:05
morapi-queue:01     RUNNING   pid 12347, uptime 0:00:05
```

---

## 🔒 BAGIAN 10 — SSL dengan Certbot (Domain Asli / VPS)

> Lewati bagian ini jika menggunakan Multipass dengan IP lokal.

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d morapi.com -d www.morapi.com
sudo certbot --nginx -d api.morapi.com
sudo certbot --nginx -d ai.morapi.com

# Verifikasi auto-renewal
sudo certbot renew --dry-run
```

---

## 🌐 BAGIAN 11 — Setup Berbasis IP/Port (Multipass / Tanpa Domain)

Jika menggunakan Multipass atau VPS tanpa domain, gunakan port berbeda untuk tiap service.

```bash
sudo nano /etc/nginx/sites-available/morapi-all
```

```nginx
# Frontend — port 3000
server {
    listen 3000;
    server_name _;
    root /var/www/morapi/apps/personal/dist;
    index index.html;
    location / { try_files $uri $uri/ /index.html; }
}

# Laravel API — port 8000
server {
    listen 8000;
    server_name _;
    root /var/www/morapi/apps/api/public;
    index index.php;
    client_max_body_size 50M;
    location / { try_files $uri $uri/ /index.php?$query_string; }
    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_read_timeout 300;
    }
}

# AI FastAPI — port 8002 (proxy ke uvicorn :8001 internal)
server {
    listen 8002;
    server_name _;
    client_max_body_size 100M;
    location / {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_read_timeout 300;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/morapi-all /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Kemudian rebuild frontend dengan IP Multipass:

```bash
cd /var/www/morapi/apps/personal
echo "VITE_API_URL=http://192.168.64.10:8000/api" > .env.production
pnpm build
```

---

## ✅ BAGIAN 12 — Verifikasi Deployment

```bash
# 1. Cek status semua service
sudo systemctl status nginx
sudo systemctl status php8.3-fpm
sudo systemctl status postgresql
sudo supervisorctl status

# 2. Test endpoint Laravel API
curl -I http://192.168.64.10:8000/api/health

# 3. Test AI FastAPI
curl -I http://192.168.64.10:8001/docs

# 4. Cek log real-time
sudo tail -f /var/log/supervisor/morapi-queue.log
sudo tail -f /var/log/supervisor/morapi-ai.log
sudo tail -f /var/log/nginx/morapi-api-error.log
```

---

## 🔄 BAGIAN 13 — Update & Redeploy

```bash
cd /var/www/morapi
git pull origin main

# Update Laravel
cd apps/api
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache && php artisan route:cache && php artisan view:cache
sudo supervisorctl restart morapi-queue:*

# Update AI (jika ada perubahan)
cd ../ai
source venv/bin/activate
pip install -r requirements.txt
sudo supervisorctl restart morapi-ai

# Rebuild frontend
cd ../personal
pnpm install && pnpm build
```

---

## 🐛 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| **502 Bad Gateway (Nginx → PHP-FPM)** | `sudo systemctl restart php8.3-fpm` |
| **502 Bad Gateway (Nginx → AI)** | `sudo supervisorctl restart morapi-ai` |
| **Queue tidak memproses job** | `sudo supervisorctl restart morapi-queue:*` |
| **Error permission di Laravel storage** | `sudo chown -R www-data:www-data apps/api/storage` |
| **Frontend SPA 404** | Pastikan `try_files $uri $uri/ /index.html` ada di Nginx |
| **AI gagal install requirements** | `sudo apt install -y build-essential libffi-dev` dulu |
| **Port sudah dipakai** | `ss -tlnp \| grep 8001` untuk cek port |

---

## 📋 Checklist Deployment

- [ ] PHP 8.3 + FPM terinstall
- [ ] Composer terinstall
- [ ] Node.js 20 + pnpm terinstall
- [ ] Python 3.10+ + venv terinstall
- [ ] Poppler terinstall
- [ ] PostgreSQL berjalan & database `morapi` dibuat
- [ ] Nginx berjalan
- [ ] Supervisor berjalan
- [ ] Repository di-clone ke `/var/www/morapi`
- [ ] `apps/api/.env` dikonfigurasi (DB, LLM keys, AI_URL)
- [ ] `php artisan key:generate` dijalankan
- [ ] `php artisan migrate --force` dijalankan
- [ ] `apps/api/storage` permissions benar (www-data)
- [ ] AI venv dibuat & requirements terinstall
- [ ] `apps/ai/.env` dikonfigurasi (port 8001, API_KEY sama)
- [ ] Frontend di-build (`pnpm build`)
- [ ] Nginx site config aktif & `nginx -t` OK
- [ ] Supervisor jobs berjalan (queue:00, queue:01, ai)
- [ ] SSL terpasang (jika pakai domain asli)
- [ ] Semua endpoint diverifikasi dengan `curl`

---

## 🐳 BAGIAN 14 — Deployment dengan Docker (Alternatif)

Jika kamu ingin melakukan deployment yang lebih cepat dan terisolasi, gunakan Docker Compose.

### 14.1 Install Docker
```bash
# Ubuntu 24.04
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER
```

### 14.2 Jalankan Service
Panduan lengkap ada di file [DOCKER.md](DOCKER.md).

```bash
cd /var/www/morapi
docker-compose up -d --build
```

