# Facts — Vista & Mora

> Fakta-fakta penting yang telah dipelajari selama pengembangan project.

## Arsitektur

- Project ini adalah **monolith**, bukan microservice.
- Backend Laravel 13 ada di folder `/api`.
- Frontend Tabler UI ada di folder `/apps` (core, shared, vista, mora).
- Vista dan Mora adalah **website** yang bisa dijadikan native app via **Capacitor**.
- Vista targetnya Web + Desktop. Mora targetnya Web + Mobile.

## Database

- Semua primary key menggunakan **ULID** (varchar 26), bukan auto-increment.
- Laravel menyediakan trait `HasUlids` secara native.
- Migration menggunakan `$table->ulid('id')->primary()`.
- Foreign key menggunakan `$table->foreignUlid('user_id')->constrained()`.

## Autentikasi

- Menggunakan **Laravel Sanctum**, bukan JWT custom.
- Token dikirim via `Authorization: Bearer {token}`.
- Refresh token disimpan di httpOnly cookie.
- Middleware: `auth:sanctum`.

## API

- Base URL: `http://vistamora.test`
- **Tanpa** prefix versioning `/v1`. Langsung flat route.
- Response format menggunakan standar Laravel JSON.
- Rate limiting diterapkan khususnya pada endpoint auth.

## Infrastruktur

- Cloud: **Hetzner Cloud CX22** (2 vCPU, 4GB RAM, 40GB SSD) — bukan OCI.
- Storage: **Cloudflare R2** (S3-compatible) — bukan OCI Object Storage.
- Email: **Resend** (3,000 email/bulan free tier).
- Payment: **Tripay QRIS**.
- Monitoring: **Sentry** (error tracking) + **UptimeRobot** (uptime).
- Queue: **Redis 7** + **Supervisor** (bukan BullMQ/Horizon untuk MVP).

## Domain Bisnis

- **Workspace** = representasi perusahaan di Vista.
- Roles: owner, admin, hr, staff.
- **Employee** di Vista bisa dilink ke akun **Mora** user.
- Payroll diproses async via Job Queue, bukan synchronous.
- AI menggunakan **Gemini 2.0 Flash** untuk kategorisasi dan chat advisor.
