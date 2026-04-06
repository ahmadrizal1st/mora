# 📑 Vista & Mora — Workspace Registry

Repo ini berisi blueprint, spesifikasi teknis, dan panduan operasional untuk ekosistem **Vista** dan **Mora**. Proyek ini dirancang dengan prinsip **Performa Maksimal** dan **Biaya Infrastruktur Rp 0 (Free Forever)**.

---

## 🚀 Ekosistem Aplikasi

| Aplikasi | Deskripsi | Tech Stack |
| :--- | :--- | :--- |
| **Vista** | Dashboard B2B untuk manajemen HR (data karyawan, payroll, absensi) dan keuangan perusahaan. | Tabler React (apps/vista). |
| **Mora** | PWA (Progressive Web App) untuk manajemen keuangan personal karyawan. | Tabler React (apps/mora). |
| **API** | Shared backend service bermutu tinggi yang melayani Vista dan Mora. | Laravel 13, PostgreSQL. |

---

## 🏗️ Tech Stack & Infrastruktur 
*Detail lengkap tersedia di [tech-stack.yml](./tech-stack.yml)*

- **Cloud Infrastructure:** Hetzner Cloud CX22 — 2 vCPU, 4GB RAM, 40GB SSD.
- **Database & Cache:** PostgreSQL 16 (Self-hosted), Redis 7 (Job Queue & AI Cache).
- **AI Ecosystem:** Hybrid: Gemini 2.0 Flash (Real-time), Groq (Fast Categorization), Ollama (Local Batch Processing).
- **Repository Management:** MVP structure dalam satu folder (Arsitektur Tabler UI & API Laravel).

---

## 🤖 Panduan Agent AI
Jika Anda adalah agent AI yang mengerjakan proyek ini, Anda **WAJIB** mengikuti hirarki instruksi berikut:

1. **Baca Entry Point:** [agent/AGENTS.yml](../agent/AGENTS.yml) adalah pusat komando.
2. **Pahami Konteks:** Folder `agent/context/` berisi visi produk dan kontrak API.
3. **Ikuti Aturan:** Folder `agent/rules/` berisi standar koding non-negosiasi.
4. **Gunakan Workflow:** Pilih alur kerja yang tepat di `agent/workflows/`.

---

## 📂 Struktur Folder Worksheet

- `agent.yml` — Blueprint sistem instruksi agent.
- `tech-stack.yml` — Spesifikasi teknis infrastruktur dan library.
- `route.yml` — Definisi API endpoints dan routing halaman.
- `page.yml` — Struktur UI dan komponen halaman.
- `ui.yml` — Definisi elemen UI visual.
- `vista/` — Spesifikasi khusus aplikasi Vista.
- `mora/` — Spesifikasi khusus aplikasi Mora.
- `api/` — Spesifikasi khusus backend API.

---

> **Prinsip Utama:** Kualitas sistem ditentukan oleh kejelasan dokumentasi dan konsistensi arsitektur.
