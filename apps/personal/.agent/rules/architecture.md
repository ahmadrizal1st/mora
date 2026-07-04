# Aturan Arsitektur & Struktur Direktori

Aplikasi `morapi` mengadopsi pola **Feature-Sliced Design (FSD)** secara adaptif untuk memisahkan domain logika bisnis agar kode mudah dikelola dan diskalakan.

## Struktur Direktori Utama (`src/`)

### 1. `features/`
- Berisi modul fungsional spesifik yang berpusat pada domain bisnis tertentu (misal: `debts`, `credit`).
- Setiap fitur harus diisolasi dan menangani logikanya sendiri.
- Di dalam setiap folder fitur, Anda akan menemukan:
  - `components/`: Komponen UI spesifik untuk fitur tersebut.
  - `pages/`: Halaman/view yang merangkai komponen.
  - `data/`: Data statis, mock data, atau query logic.

### 2. `shared/`
- Berisi komponen, utilitas, tipe data, atau hook yang bersifat lintas domain (agnostik).
- Digunakan bersama oleh berbagai fitur (misal: `components/layout/BottomNav.tsx`, komponen `Chart`, format currency).

## Aturan Ketergantungan (Dependencies Rule)
- ❌ **Shared tidak boleh bergantung pada Features**. Modul di folder `shared/` sama sekali tidak boleh melakukan *import* apa pun dari folder `features/`.
- ❌ **Hindari Cross-Feature Import**. Fitur A (misal `debts`) sebaiknya tidak memanggil langsung komponen dari Fitur B (`credit`).
- ✅ **Ekstraksi ke Shared**. Jika ada logika atau komponen yang dibutuhkan oleh dua fitur berbeda, angkat komponen tersebut dan pindahkan ke direktori `shared/`.
