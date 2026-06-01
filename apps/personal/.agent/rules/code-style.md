# Aturan Penulisan Kode (Code Style)

Panduan ini mengatur tumpukan teknologi (tech stack), penulisan komponen, dan gaya UI untuk menjaga antarmuka tetap seragam dan premium.

## 1. Teknologi UI & Styling
- **Framework**: React / Next.js.
- **Styling**: Proyek ini secara ketat menggunakan utilitas class dari **Bootstrap 5** dan panduan komponen **Tabler UI**.
- **Aturan CSS Utama**: 
  - ✅ **Wajib Gunakan Class Framework**: Selesaikan semua kebutuhan styling menggunakan utility class Bootstrap / Tabler (contoh: `d-flex`, `text-muted`, `card`, dll).
  - ❌ **Hindari Native CSS**: DILARANG membuat file CSS kustom (`.css` / `.scss` / `.module.css`) atau menulis CSS asli (*native styling*) secara langsung jika styling tersebut masih bisa ditangani oleh class bawaan.
  - ❌ **DILARANG KERAS** menggunakan Tailwind CSS di proyek ini.
  - ❌ **Hindari inline style**, kecuali untuk hal-hal yang perhitungannya sangat dinamis (misalnya perhitungan gauge chart atau animasi `rotate`).

## 2. React & TypeScript
- Selalu gunakan **Functional Components** dengan sintaks deklarasi eksplisit: `export function NamaKomponen()`. Hindari `export default` (kecuali diwajibkan oleh mekanisme *routing* framework).
- ❌ Hindari tipe `any`. Selalu pastikan untuk mendefinisikan `interface` atau `type` untuk *props* komponen.
- ✅ Gunakan `useMemo` dan `useCallback` jika dibutuhkan, terutama untuk memproses *derived state* kalkulasi skor yang berat atau mem-parsing data grafik (*chart data*).

## 3. Bahasa & Estetika Antarmuka (Wajib)
- **Bahasa**: Semua teks yang terlihat oleh pengguna (*user-facing text*) **WAJIB** menggunakan **Bahasa Indonesia** yang bernada positif, bersih, dan ramah (contoh penggunaan: "Skor Anda baik!", "Aman", "Lihat Detail").
- **Tampilan**: Pastikan semua komponen dirancang secara responsif (*mobile-first*) dan mengikuti estetika *dashboard* modern dari Tabler UI.

## 4. Kerapian & Komentar Kode (Clean Code)
- **Self-Documenting Code**: Kode **WAJIB** ditulis dengan sangat rapi, terstruktur, dan menggunakan penamaan variabel/fungsi yang sangat jelas (deskriptif).
- **Tanpa Komentar**: ❌ **DILARANG** menulis komentar penjelasan di dalam kode. Kode yang ditulis harus cukup jelas sehingga bisa menjelaskan dirinya sendiri (*self-explanatory*). Hindari menambahkan blok komentar yang tidak perlu.
