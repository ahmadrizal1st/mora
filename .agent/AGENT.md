# 🤖 Vista Mora Agent

> **Version:** 1.2.0 | **Updated:** 2026-04

AI Agent untuk pengembangan ekosistem **Vista & Mora Financial Network** — platform terintegrasi yang menggabungkan manajemen HR perusahaan (B2B) dengan keuangan personal karyawan (B2C).

---

## 📂 Struktur Agent

```
.agent/
├── config.yml              Konfigurasi utama agent
├── AGENT.md                Dokumentasi agent (file ini)
├── README.md               Quick reference table
├── context/                Konteks bisnis & arsitektur
├── rules/                  Aturan koding non-negotiable
├── prompts/                System prompts & task templates
├── tools/                  Definisi tool yang tersedia
├── memory/                 Konteks & riwayat agent
├── schemas/                Skema input/output
└── evals/                  Evaluasi & testing
```

---

## 📋 Priority Loading

Saat memulai tugas, AI Agent **WAJIB** membaca file dalam urutan berikut:

1. **`context/product-vision.md`** — Pahami apa yang sedang dibangun dan untuk siapa.
2. **`context/architecture.md`** — Pahami tech stack dan standar API.
3. **`context/domain-glossary.md`** — Pahami istilah domain bisnis.
4. **`rules/backend.md`** — Ikuti pola arsitektur backend.
5. **`rules/frontend.md`** — Ikuti standar frontend (React/Vite).
6. **`rules/database-conventions.md`** — Ikuti konvensi database.
7. **`rules/api-design.md`** — Ikuti standar desain API.
8. **`memory/facts.md`** — Cek fakta yang sudah dipelajari sebelumnya.

---

## 🏛️ Arsitektur Project

### Apps

| App | Tipe | Path | Target |
|:----|:-----|:-----|:-------|
| **Vista** | Tabler React (B2B) | `apps/vista/` | Web + Desktop (Capacitor) |
| **Mora** | Tabler React (B2C) | `apps/mora/` | Web + Mobile (Capacitor) |
| **API** | Laravel 13 Monolithic | `api/` | Shared backend |
| **Core** | Shared JS/TS | `apps/core/` | Library bersama |

### Backend Pattern
```
HTTP → Route → Middleware (Sanctum) → Controller → FormRequest
→ Service (logic) → Repository (query) → Model → Database
```

### Frontend Pattern
```
React Component (.tsx) → Hooks (useState/useEffect) → Core Service (*.service.ts)
→ API Client (fetch/TanStack Query) → Laravel API
```

---

## 🧭 Core Principles

| # | Prinsip | Penjelasan |
|:--|:--------|:-----------|
| 1 | **Context First** | Selalu baca file di `context/` sebelum mengasumsikan sesuatu. |
| 2 | **Rule Obedience** | Aturan di `rules/` bersifat **non-negotiable**. |
| 3 | **MVP Mindset** | Jangan over-engineering. Fokus pada fitur inti yang berfungsi. |
| 4 | **Stop & Ask** | Jika ada ambiguitas tinggi atau risiko destruktif, berhenti dan tanya user. |
| 5 | **Convention over Configuration** | Ikuti konvensi Laravel dan Tabler React yang sudah mapan. |

---

## ⚠️ Larangan Keras

- ❌ **Jangan** gunakan Tailwind CSS di Vista/Mora (default adalah SCSS/Bootstrap bawaan Tabler Core).
- ❌ **Jangan** taruh business logic di Controller atau Model.
- ❌ **Jangan** gunakan auto-increment ID. Selalu ULID.
- ❌ **Jangan** proses berat (payroll, OCR, email blast) secara synchronous. Gunakan Job Queue.
- ❌ **Jangan** buat arsitektur microservice. Ini adalah **monolith**.
- ❌ **Jangan** gunakan API versioning prefix `/v1`.

---

## 📋 Quick Commands

```bash
# Backend (API)
cd api && php artisan serve

# Frontend (Vista)
cd apps/vista && npm run dev

# Frontend (Mora)
cd apps/mora && npm run dev
```

