# Aturan Code Style PHP / Laravel

## 1. Standar Penulisan
- Ikuti standar **PSR-12**.
- Gunakan *Type Hinting* secara ketat untuk parameter fungsi dan *Return Type* (contoh: `public function getUser(int $id): User`).
- Aktifkan strict types di file baru jika memungkinkan: `declare(strict_types=1);`

## 2. Penamaan
- Kelas & Interface: `PascalCase` (contoh: `PaymentService`).
- Fungsi & Variabel: `camelCase` (contoh: `$totalAmount`, `calculateTax()`).
- Database & Kolom: `snake_case` (contoh: `user_id`, `created_at`).

## 3. Clean Code
- Tulis kode dengan nama yang jelas sehingga tidak membutuhkan komentar penjelasan baris-per-baris.
