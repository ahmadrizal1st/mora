# Aturan Keamanan (Security) API Laravel

## 1. Validasi & Sanitasi
- **WAJIB** memvalidasi semua request masuk menggunakan `FormRequest`.
- Jangan pernah menggunakan `$request->all()` secara langsung ke dalam model untuk menghindari *Mass Assignment Vulnerability*.

## 2. Database & SQL Injection
- Selalu gunakan Eloquent ORM atau Query Builder Laravel. Dilarang keras menggunakan *raw query* yang menyambung string secara langsung.

## 3. Data Sensitif
- Pastikan kata sandi selalu di-hash menggunakan facade `Hash::make`.
- Tidak ada data kredensial (*Secret Key*, kredensial DB) yang boleh di-*hardcode* di dalam kode. Selalu gunakan `config()` yang merujuk ke file `.env`.
