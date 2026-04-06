# API Design Standards

> **Version:** 1.1.0 | Standar desain REST API untuk backend Laravel Vista & Mora.

## Base URL & Routing

- **Base URL:** `http://vistamora.test`
- **Versioning:** ❌ Tanpa prefix `/v1`. Langsung flat (e.g. `/auth/login`, `/payroll/runs`).
- **Auth:** Bearer Token via **Laravel Sanctum**.

```
GET    /employees          → Daftar resource
POST   /employees          → Buat resource baru
GET    /employees/{id}     → Detail resource
PATCH  /employees/{id}     → Update sebagian resource
DELETE /employees/{id}     → Hapus resource (soft delete)
```

## Autentikasi

- Gunakan middleware `auth:sanctum` untuk semua route terproteksi.
- Token dikirim via header: `Authorization: Bearer {token}`.
- Refresh token disimpan di **httpOnly cookie** (bukan localStorage).

```php
// routes/api.php
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});
```

## Response Format

### Success Response
```json
{
    "data": { ... },
    "message": "Resource berhasil dibuat"
}
```

### Paginated Response
```json
{
    "data": [ ... ],
    "meta": {
        "current_page": 1,
        "per_page": 20,
        "total": 150,
        "last_page": 8
    }
}
```

### Error Response
```json
{
    "message": "Validasi gagal",
    "errors": {
        "email": ["Email sudah terdaftar"],
        "password": ["Password minimal 8 karakter"]
    }
}
```

## HTTP Status Codes

| Code | Penggunaan |
|:-----|:-----------|
| `200` | OK — request berhasil |
| `201` | Created — resource berhasil dibuat |
| `204` | No Content — delete berhasil |
| `400` | Bad Request — request tidak valid |
| `401` | Unauthorized — token tidak valid atau tidak ada |
| `403` | Forbidden — tidak punya akses ke resource |
| `404` | Not Found — resource tidak ditemukan |
| `422` | Unprocessable Entity — validasi gagal |
| `429` | Too Many Requests — rate limit tercapai |
| `500` | Internal Server Error — error di server |

## Rate Limiting

| Endpoint | Limit |
|:---------|:------|
| `POST /auth/login` | 5 req / 15 menit per IP |
| `POST /auth/register` | 10 req / 1 jam per IP |
| `POST /auth/forgot-password` | 5 req / 1 menit per IP |
| `POST /auth/resend-otp` | 3 req / 1 menit per IP |
| **Global (semua endpoint)** | 100 req / 1 menit per IP |

## Workspace Context

- Semua endpoint Vista **WAJIB** menyertakan `X-Workspace-ID` header.
- Backend memvalidasi bahwa user adalah member dari workspace tersebut.

```
GET /employees
Headers:
  Authorization: Bearer {token}
  X-Workspace-ID: {workspace_ulid}
```

## Naming Conventions

| Elemen | Konvensi | Contoh |
|:-------|:---------|:-------|
| **Endpoint** | kebab-case, plural noun | `/payroll-runs`, `/split-bills` |
| **Query param** | snake_case | `?start_date=2026-01-01&per_page=20` |
| **Request body** | snake_case | `{ "full_name": "John" }` |
| **Response body** | snake_case | `{ "created_at": "2026-04-02" }` |

## File Upload

- Gunakan `multipart/form-data` untuk upload.
- Max file size: **10MB**.
- Tipe file yang diterima: `jpg`, `jpeg`, `png`, `pdf`.
- File disimpan ke **Cloudflare R2** via Laravel Storage S3 driver.
