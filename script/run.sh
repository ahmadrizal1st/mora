#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")/.." && pwd)"
API_DIR="$DIR/apps/api"
PERSONAL_DIR="$DIR/apps/personal"

info()  { echo -e "\033[0;32m[INFO]\033[0m $1"; }
warn()  { echo -e "\033[1;33m[WARN]\033[0m $1"; }
error() { echo -e "\033[0;31m[ERROR]\033[0m $1"; }

run_docker() {
    info "Setup .env untuk Docker..."
    if [ ! -f "$API_DIR/.env" ]; then
        cp "$API_DIR/.env.example" "$API_DIR/.env"
        sed -i '' 's/DB_HOST=.*/DB_HOST=db/' "$API_DIR/.env"
    fi
    if [ ! -f "$DIR/apps/ai/.env" ]; then
        cp "$DIR/apps/ai/.env.template" "$DIR/apps/ai/.env" 2>/dev/null || true
    fi

    info "Build & jalankan Docker Compose..."
    cd "$DIR" && docker compose up -d --build

    info "Setup Laravel di container..."
    docker exec morapi_api php artisan key:generate --force 2>/dev/null || true
    docker exec morapi_api php artisan migrate --force 2>/dev/null || true
    docker exec morapi_api php artisan db:seed --force 2>/dev/null || true

    echo ""
    echo "╔════════════════════════════════════════╗"
    echo "║      Docker Services Running            ║"
    echo "╠════════════════════════════════════════╣"
    echo "║  Frontend : http://localhost:5173       ║"
    echo "║  API      : http://localhost:8000       ║"
    echo "║  AI       : http://localhost:8001/docs  ║"
    echo "╚════════════════════════════════════════╝"
    exit 0
}

run_local() {
    local RUN_ALL=true
    local START_DB=false
    local RUN_SEED=false
    local START_API=false
    local START_PERSONAL=false
    local START_AI=false
    local START_QUEUE=false
    local START_CADDY=false

    # Parsing argumen/flag
    if [ $# -gt 0 ]; then
        RUN_ALL=false
        for arg in "$@"; do
            case "$arg" in
                db)        START_DB=true ;;
                seed)      RUN_SEED=true ;;
                api)       START_API=true ;;
                personal|frontend) START_PERSONAL=true ;;
                ai)        START_AI=true ;;
                queue|worker)    START_QUEUE=true ;;
                caddy|proxy)     START_CADDY=true ;;
                all)       RUN_ALL=true ;;
                *)         warn "Flag '$arg' tidak dikenal. Pilihan: api, personal, ai, db, seed, queue, caddy, all" ;;
            esac
        done
    fi

    if [ "$RUN_ALL" = true ]; then
        START_DB=true
        RUN_SEED=true
        START_API=true
        START_PERSONAL=true
        START_AI=true
        START_QUEUE=true
        START_CADDY=true
    fi

    info "Memeriksa prasyarat..."
    command -v php >/dev/null 2>&1      || { error "PHP tidak ditemukan"; exit 1; }
    command -v composer >/dev/null 2>&1  || { error "Composer tidak ditemukan"; exit 1; }
    command -v pnpm >/dev/null 2>&1      || { error "pnpm tidak ditemukan (npm install -g pnpm)"; exit 1; }
    command -v psql >/dev/null 2>&1      || { error "PostgreSQL tidak ditemukan"; exit 1; }

    if [ "$START_DB" = true ]; then
        info "Menyalakan PostgreSQL..."
        pg_ctl -D /opt/homebrew/var/postgresql@14 start 2>/dev/null ||
          brew services start postgresql@14 2>/dev/null || true
        sleep 1

        cd "$API_DIR"
        if [ ! -f .env ]; then
            info "Membuat apps/api/.env..."
            cp .env.example .env
        fi

        if ! grep -q '^APP_KEY=[A-Z]' .env 2>/dev/null; then
            info "Generate APP_KEY..."
            php artisan key:generate --force
        fi

        DB_NAME=$(grep -oP '^DB_DATABASE=\K.*' .env 2>/dev/null || echo "morapi")
        DB_USER=$(grep -oP '^DB_USERNAME=\K.*' .env 2>/dev/null || echo "postgres")
        psql -U "$DB_USER" -d postgres -tc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" 2>/dev/null | grep -q 1 || {
            info "Membuat database '$DB_NAME'..."
            createdb -U "$DB_USER" "$DB_NAME" 2>/dev/null || warn "Gagal buat database. Buat manual: createdb $DB_NAME"
        }

        if [ ! -d vendor ]; then
            info "composer install..."
            composer install --no-interaction --prefer-dist
        fi

        info "Migrasi database..."
        php artisan migrate --force 2>/dev/null || warn "Migrasi gagal. Cek DB_HOST/DB_DATABASE/DB_USERNAME/DB_PASSWORD di .env"
    fi

    if [ "$RUN_SEED" = true ]; then
        cd "$API_DIR"
        info "Running database seeder..."
        php artisan db:seed --force 2>/dev/null || true
        php artisan config:clear 2>/dev/null || true
    fi

    if [ "$START_PERSONAL" = true ]; then
        cd "$PERSONAL_DIR"
        if [ ! -f .env ]; then
            info "Membuat apps/personal/.env..."
            cat > .env << 'EOF'
VITE_DOMAIN=morapi.localhost
VITE_SECURE=true
VITE_API_URL=https://api.morapi.localhost
VITE_WS_URL=wss://api.morapi.localhost
VITE_API_KEY=morapipipi_secure_api_key_2026
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
EOF
        fi

        if [ ! -d node_modules ]; then
            info "pnpm install..."
            pnpm install
        fi
    fi

    if [ "$START_AI" = true ]; then
        AI_DIR="$DIR/apps/ai"
        if [ ! -f "$AI_DIR/.env" ] && [ -f "$AI_DIR/.env.template" ]; then
            cp "$AI_DIR/.env.template" "$AI_DIR/.env"
        fi
    fi

    echo ""
    info "Menjalankan service yang dipilih..."

    if [ "$START_API" = true ]; then
        lsof -ti :8000 2>/dev/null | xargs kill -9 2>/dev/null || true
        cd "$API_DIR"
        nohup php artisan serve --host=127.0.0.1 --port=8000 > /tmp/laravel.log 2>&1 &
        info "Laravel API  → http://127.0.0.1:8000 (PID $!)"
    fi

    if [ "$START_QUEUE" = true ]; then
        cd "$API_DIR"
        nohup php artisan queue:listen --tries=3 --timeout=0 > /tmp/queue.log 2>&1 &
        info "Queue Worker → PID $!"
    fi

    if [ "$START_PERSONAL" = true ]; then
        lsof -ti :5173 2>/dev/null | xargs kill -9 2>/dev/null || true
        cd "$PERSONAL_DIR"
        nohup pnpm dev > /tmp/vite.log 2>&1 &
        info "Vite Personal→ http://localhost:5173 (PID $!)"
    fi

    if [ "$START_AI" = true ]; then
        lsof -ti :8001 2>/dev/null | xargs kill -9 2>/dev/null || true
        AI_DIR="$DIR/apps/ai"
        if [ -d "$AI_DIR" ]; then
            cd "$AI_DIR"
            if [ -f "$AI_DIR/venv/bin/python" ]; then
                nohup "$AI_DIR/venv/bin/python" -m uvicorn main:app --host 127.0.0.1 --port 8001 > /tmp/ai.log 2>&1 &
                info "AI FastAPI   → http://127.0.0.1:8001 (PID $!)"
            elif command -v uvicorn &>/dev/null; then
                nohup uvicorn main:app --host 127.0.0.1 --port 8001 > /tmp/ai.log 2>&1 &
                info "AI FastAPI   → http://127.0.0.1:8001 (PID $!)"
            else
                warn "Python virtual environment/uvicorn tidak ditemukan di apps/ai."
            fi
        fi
    fi

    if [ "$START_CADDY" = true ]; then
        cd "$DIR"
        if command -v caddy &>/dev/null; then
            caddy stop 2>/dev/null || true
            caddy fmt --overwrite 2>/dev/null || true
            caddy run 2>/dev/null &
            info "Caddy Proxy  → https://morapi.localhost"
        fi
    fi

    sleep 2
    echo ""
    echo "╔══════════════════════════════════════════════╗"
    echo "║         Service Siap Diterima                ║"
    echo "╠══════════════════════════════════════════════╣"
    [ "$START_PERSONAL" = true ] && echo "║  Frontend :  https://morapi.localhost        ║"
    [ "$START_API" = true ]      && echo "║  API      :  https://api.morapi.localhost    ║"
    [ "$START_AI" = true ]       && echo "║  AI Docs  :  https://ai.morapi.localhost/docs║"
    echo "║  Login    :  user@morapi.com / password      ║"
    echo "╚══════════════════════════════════════════════╝"
    echo ""
    echo "Stop:  morapi stop"
}

case "${1:-}" in
    docker) shift; run_docker "$@" ;;
    *)      run_local "$@" ;;
esac
