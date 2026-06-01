# Aturan Keamanan (Security)

Aplikasi Personal Visatamora mengelola informasi sensitif (seperti hutang, skor kredit, dan perencanaan keuangan). Keamanan dan privasi adalah prioritas utama.

## 1. Penanganan Data Sensitif
- ❌ **No Hardcoding**: Jangan pernah meletakkan API Key, Secret Token, atau Endpoint Backend otentik di dalam *source code* secara *hardcode*. Selalu baca dari file Environment (`.env`).
- ❌ **No Real Data in Commits**: Jangan menyimpan data keuangan pribadi atau akun asli Anda ke dalam komponen UI maupun ke repositori. 
- ✅ **Gunakan Mock Data**: Selalu gunakan file seperti `mockDebtsData.ts` dengan data palsu (dummy) untuk pengembangan *frontend*.

## 2. Autentikasi & Proteksi Navigasi
- Pastikan bahwa halaman/fitur sensitif (seperti Dashboard Pribadi) dibungkus dengan pengecekan autentikasi pengguna (*Auth Guards*).
- Jika ada penarikan API (API Fetching), jangan berasumsi data selalu berhasil diambil. Siapkan kondisi render *fallback* (State Loading / Error State) agar aplikasi tidak *crash* putih (*white screen of death*).

## 3. Validasi Input
- Jika agent mengembangkan form (tambah utang, kalkulator kredit), semua input harus tervalidasi secara *client-side* sebelum dikirim, guna mencegah injeksi atau salah *type* perhitungan uang.
