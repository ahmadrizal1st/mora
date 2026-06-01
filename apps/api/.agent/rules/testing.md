# Aturan Pengujian (Testing) API

Pengujian dilakukan menggunakan **PHPUnit**.

## 1. Feature Tests
- Buat pengujian *Feature* untuk setiap *endpoint* API (berada di `tests/Feature/`).
- Pastikan menguji *Happy Path* (HTTP 200/201) dan *Error Path* (HTTP 422 Validasi, HTTP 401 Unauthorized, HTTP 403 Forbidden, HTTP 404 Not Found).

## 2. Lingkungan Testing
- Gunakan trait `RefreshDatabase` pada *test class* untuk memastikan database pengujian selalu bersih.
- Manfaatkan *Model Factories* untuk men-generate data *dummy* secara cepat.
