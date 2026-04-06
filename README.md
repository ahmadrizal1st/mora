# 🌐 Vista & Mora — Financial Network Ecosystem

Selamat datang di monorepo **Vista & Mora**, sebuah platform terintegrasi yang menggabungkan manajemen HR tingkat perusahaan (B2B) dengan manajemen keuangan personal karyawan (B2C) dalam satu ekosistem yang kohesif.

---

## 🏛️ Arsitektur Proyek

Proyek ini menggunakan struktur MVP sebagai berikut:

- **`apps/`**: Frontend menggunakan Tabler UI HTML.
  - `tabler/`, `core/`, `shared/`: Komponen shared dan konfigurasi UI.
  - `vista/`: Dashboard HR & Keuangan B2B (HTML/TS/SCSS).
  - `mora/`: PWA Keuangan Personal Karyawan (HTML/TS/SCSS).
- **`api/`**: Backend Shared Service (Laravel 13).
- **`worksheet/`**: Blueprint, spesifikasi teknis, dan rancangan sistem.
- **`agent/`**: Sistem instruksi, aturan koding, dan alur kerja AI Agent.

---

## 🚀 Filosofi Proyek

Sistem ini dibangun dengan tiga pilar utama:
1. **Performa Maksimal**: Menggunakan native fetch, Laravel Router, Eloquent ORM, dan SSE untuk throughput tinggi dan bundle size minimal.
2. **Biaya Efisien**: Dioptimalkan sepenuhnya untuk berjalan di atas Hetzner Cloud VPS, Gemini Free Tier, Groq, dan self-hosted AI.
3. **AI-First**: Integrasi AI yang cerdas untuk mengotomatisasi input keuangan dan memberikan insight prediktif.

---

## 📑 Panduan Cepat

| Jika Anda Ingin... | Lihat Folder... |
| :--- | :--- |
| Mempelajari teknologi & infrastruktur | [`worksheet/tech-stack.yml`](./worksheet/tech-stack.yml) |
| Melihat kontrak API & rute halaman | [`worksheet/route.yml`](./worksheet/route.yml) |
| Memahami standar koding & aturan agent | [`agent/README.md`](./agent/README.md) |
| Mulai pengembangan sebagai AI Agent | [`agent/AGENTS.yml`](./agent/AGENTS.yml) |

---

## 🛠️ Tech Stack Utama

- **Framework**: Tabler UI HTML, Laravel 13
- **Runtime**: PHP 8.2+, Node.js (untuk tooling FE)
- **Database**: PostgreSQL 16

- **Cache & Queue**: Redis 7 (Supervisor / Laravel Horizon)
- **Cloud**: Hetzner Cloud (CX22)
- **AI**: Gemini 2.0 Flash, Groq, Ollama

---

> **Vista & Mora** — Menghubungkan efisiensi perusahaan dengan kesejahteraan finansial karyawan.
