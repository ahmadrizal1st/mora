# Database Conventions

> **Version:** 1.1.0 | Konvensi database untuk seluruh entitas Vista & Mora.

## Primary Key

- **Format:** ULID (`varchar(26)`) menggunakan trait `HasUlids` bawaan Laravel.
- **Alasan:** Sortable, URL-safe, tidak bisa di-guess seperti auto-increment.
- ❌ **Jangan** gunakan `bigIncrements` untuk tabel utama.

```php
// ✅ Benar
use Illuminate\Database\Eloquent\Concerns\HasUlids;

class User extends Model
{
    use HasUlids;
}

// Migration
$table->ulid('id')->primary();
```

## Naming Conventions

| Elemen | Konvensi | Contoh |
|:-------|:---------|:-------|
| **Tabel** | snake_case, plural | `users`, `payroll_runs`, `split_bills` |
| **Kolom** | snake_case | `full_name`, `base_salary`, `is_verified` |
| **Foreign Key** | `{table_singular}_id` | `user_id`, `workspace_id` |
| **Pivot Table** | Alphabetical, singular | `role_user`, `workspace_member` |
| **Migration** | Default Laravel timestamp | `2026_04_02_000001_create_users_table.php` |
| **Model** | PascalCase, singular | `User`, `PayrollRun`, `SplitBill` |

## Data Types

| Tipe Data | Penggunaan | Definisi |
|:----------|:-----------|:---------|
| `ulid` | Primary & Foreign Key | `$table->ulid('id')->primary()` |
| `varchar(255)` | String pendek | `$table->string('name')` |
| `text` | String panjang, URL | `$table->text('description')->nullable()` |
| `numeric(15,2)` | Semua nilai uang/nominal | `$table->decimal('amount', 15, 2)` |
| `boolean` | Flag on/off | `$table->boolean('is_verified')->default(false)` |
| `jsonb` | Data dinamis/fleksibel | `$table->json('metadata')->nullable()` |
| `date` | Tanggal tanpa waktu | `$table->date('join_date')` |
| `timestamp` | Waktu lengkap | `$table->timestamp('created_at')` |

## Relasi

- Definisikan semua relasi di **Model**, bukan di Controller/Service.
- Gunakan **eager loading** (`with()`) di Repository untuk mencegah N+1.
- Gunakan **soft deletes** (`SoftDeletes` trait) untuk data penting (employees, workspaces).

```php
// ✅ Repository: eager loading
public function findAll(string $workspaceId): Collection
{
    return Employee::where('workspace_id', $workspaceId)
        ->with(['user', 'documents'])
        ->get();
}
```

## Seeding

- Gunakan **Factory + Seeder** bawaan Laravel untuk data testing.
- Buat `DatabaseSeeder` yang idempotent (bisa dijalankan berulang kali).
- Selalu sediakan user demo: `admin@vistamora.id` / `password`.

## Migration Rules

- Satu migration per perubahan skema (jangan gabung banyak tabel dalam satu migration).
- Selalu definisikan `down()` method untuk rollback.
- Gunakan `foreignUlid()` untuk foreign key yang merujuk ULID.

```php
// ✅ Foreign key ke tabel ULID
$table->foreignUlid('user_id')->constrained()->cascadeOnDelete();
```
