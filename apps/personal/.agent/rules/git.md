# Aturan Git & Workflow

Demi menjaga riwayat kolaborasi dan perubahan versi yang bersih, semua pihak (termasuk AI agent saat memberikan saran perintah Git) wajib mengikuti konvensi berikut.

## 1. Konvensi Penulisan Commit (Conventional Commits)
Setiap pesan *commit* harus informatif dan memiliki prefiks yang menunjukkan maksud perubahan. Format dasar:
`<type>(<scope>): <deskripsi menggunakan bahasa Indonesia atau Inggris>`

*Tipe (Type) yang diizinkan:*
- `feat`: Menambahkan fitur baru (misal: `feat(debts): tambah grafik skor kesehatan`)
- `fix`: Memperbaiki *bug* atau error (misal: `fix(nav): perbaiki z-index pada BottomNav`)
- `refactor`: Mengubah struktur kode tanpa menambah fitur baru atau memperbaiki *bug*
- `style`: Perubahan terkait pemformatan, perapian spasi, perubahan tata letak UI.
- `docs`: Menambah atau memperbaiki file dokumentasi atau file `.md`.
- `test`: Menambahkan pengujian atau memperbaiki skrip pengujian.

## 2. Branching Strategy
- Fitur baru harus dikerjakan pada *branch* baru dengan format: `feature/<nama-fitur>`
- Perbaikan *bug* dilakukan pada *branch*: `fix/<nama-bug>`
- Jangan melakukan *push* dan merubah langsung ke branch utama (`main` / `master`). Lakukan melalui Pull Request (PR) jika sedang berkolaborasi.
