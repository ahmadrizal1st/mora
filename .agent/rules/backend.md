# Laravel Backend Rules

> **Version:** 1.1.0 | **Architecture:** MVC + Service Pattern + Repository Pattern

## Request Flow

```
HTTP Request → Route → Middleware (auth:sanctum) → Controller → FormRequest (validasi)
→ Service (business logic) → Repository (database query) → Model → Database
→ Response ← Controller ← Service
```

## Layer Rules

### Controller (`app/Http/Controllers/`)
Menerima HTTP request, validasi via Form Request, panggil Service, return response.
- ❌ **TIDAK BOLEH** ada business logic di controller.
- ❌ **TIDAK BOLEH** query database langsung di controller.
- ✅ Satu controller per resource (e.g. `UserController`, `PayrollController`).
- ✅ Gunakan **Form Request** untuk validasi, bukan `validate()` manual.

### Service (`app/Services/`)
Business logic utama. Dipanggil oleh Controller atau Job/Queue.
- ✅ Service berisi semua logika bisnis (kalkulasi, kondisi, orchestration).
- ✅ Service memanggil **Repository** untuk akses database.
- ❌ Service **TIDAK BOLEH** return HTTP response (`response()->json()`).
- ✅ Satu service per domain (e.g. `PayrollService`, `TransactionService`).

### Repository (`app/Repositories/`)
Abstraksi akses database. Hanya query Eloquent di sini.
- ✅ Repository berisi query Eloquent (find, create, update, delete, filter).
- ❌ Repository **TIDAK BOLEH** berisi business logic.
- ✅ Gunakan **Interface + Implementation** agar bisa di-swap/mock saat testing.
- ✅ Wajib **eager loading** untuk mencegah N+1 query.
- **Interface:** `app/Repositories/Contracts/`
- **Implementation:** `app/Repositories/Eloquent/`

### Model (`app/Models/`)
Representasi tabel database. Relasi Eloquent, casts, dan scopes.
- ❌ **TIDAK BOLEH** ada business logic di Model.
- ✅ Definisikan relasi (`hasMany`, `belongsTo`, dll) di Model.
- ✅ Gunakan trait **HasUlids** untuk ULID primary key.
- ✅ Gunakan **soft deletes** jika diperlukan.

### Form Request (`app/Http/Requests/`)
Validasi dan autorisasi request HTTP.
- ✅ Satu FormRequest per endpoint yang butuh validasi.
- ✅ Gunakan `authorize()` untuk cek permission.

## Prinsip Umum
- **Auth:** Selalu gunakan middleware `auth:sanctum` untuk route terproteksi.
- **ID:** Primary Key WAJIB menggunakan **ULID** (varchar 26) via trait `HasUlids`.
- **AI:** Bungkus logika panggilan AI Gemini dalam `app/Services/AI/AIService.php`.
- **Storage:** Gunakan Laravel Storage Facade yang terhubung ke R2 via disk S3.
- **Queue:** Proses berat (payroll, OCR, email) WAJIB melalui **Job Queue**, bukan synchronous.

## Folder Structure

```
app/
├── Http/
│   ├── Controllers/     AuthController, EmployeeController, PayrollController
│   ├── Requests/        LoginRequest, CreateEmployeeRequest
│   └── Middleware/      Custom middleware
├── Models/              User, Profile, Workspace, Employee, Transaction
├── Services/            AuthService, PayrollService, TransactionService, AIService
├── Repositories/
│   ├── Contracts/       UserRepositoryInterface, EmployeeRepositoryInterface
│   └── Eloquent/        UserRepository, EmployeeRepository
├── Jobs/                ProcessPayrollJob, ScanReceiptJob
├── Events/              PayrollProcessed, TransactionCreated
├── Listeners/           SendPayslipNotification, UpdateWalletBalance
└── Providers/           RepositoryServiceProvider (bind interface → implementation)
```
