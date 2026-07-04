# Panduan AI Agent untuk Morapi (Personal App)

File ini adalah titik masuk utama bagi asisten AI (seperti Antigravity, Cursor, atau Copilot) saat berinteraksi dengan codebase ini.

Sebelum memulai tugas modifikasi kode yang signifikan atau penambahan fitur baru, AI Agent **WAJIB** membaca aturan-aturan yang ada di dalam direktori `.agent/rules/`.

## Daftar Aturan
Semua pedoman teknis dan konvensi proyek dibagi ke dalam kategori berikut:

1. [Architecture & Struktur Direktori](./.agent/rules/architecture.md)
2. [Code Style & UI/UX](./.agent/rules/code-style.md)
3. [Git Workflow](./.agent/rules/git.md)
4. [Keamanan (Security)](./.agent/rules/security.md)
5. [Testing](./.agent/rules/testing.md)

## Instruksi Umum untuk AI:
- Baca dokumen aturan yang relevan menggunakan alat pembaca file Anda sebelum merancang solusi.
- **Jangan pernah menggunakan asumsi default AI** (seperti menggunakan Tailwind CSS secara otomatis) tanpa memeriksa `code-style.md`.
- Selalu utamakan solusi yang ada atau komponen yang sudah tersedia (seperti komponen di `src/shared/`) sebelum membuat yang baru.
