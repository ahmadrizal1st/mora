# Output Format Standards

Standar format output yang harus diikuti agent saat menghasilkan kode atau dokumen.

---

## PHP / Laravel

### Controller
```php
<?php

namespace App\Http\Controllers;

use App\Http\Requests\{NamaRequest};
use App\Services\{NamaService};
use Illuminate\Http\JsonResponse;

class NamaController extends Controller
{
    public function __construct(
        private readonly NamaService $service
    ) {}

    public function index(): JsonResponse
    {
        $data = $this->service->getAll();
        return response()->json(['data' => $data]);
    }

    public function store(NamaRequest $request): JsonResponse
    {
        $result = $this->service->create($request->validated());
        return response()->json(['data' => $result], 201);
    }
}
```

### Service
```php
<?php

namespace App\Services;

use App\Repositories\Contracts\NamaRepositoryInterface;

class NamaService
{
    public function __construct(
        private readonly NamaRepositoryInterface $repository
    ) {}

    public function getAll()
    {
        return $this->repository->findAll();
    }

    public function create(array $data)
    {
        // Business logic di sini
        return $this->repository->create($data);
    }
}
```

### Repository Interface
```php
<?php

namespace App\Repositories\Contracts;

interface NamaRepositoryInterface
{
    public function findAll();
    public function findById(string $id);
    public function create(array $data);
    public function update(string $id, array $data);
    public function delete(string $id);
}
```

### Repository Implementation
```php
<?php

namespace App\Repositories\Eloquent;

use App\Models\Nama;
use App\Repositories\Contracts\NamaRepositoryInterface;

class NamaRepository implements NamaRepositoryInterface
{
    public function findAll()
    {
        return Nama::with(['relasi'])->get();
    }

    public function findById(string $id)
    {
        return Nama::with(['relasi'])->findOrFail($id);
    }

    public function create(array $data)
    {
        return Nama::create($data);
    }

    public function update(string $id, array $data)
    {
        $model = $this->findById($id);
        $model->update($data);
        return $model->fresh();
    }

    public function delete(string $id)
    {
        return Nama::findOrFail($id)->delete();
    }
}
```

### Model
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Nama extends Model
{
    use HasUlids, SoftDeletes;

    protected $fillable = ['kolom1', 'kolom2'];

    protected $casts = [
        'metadata' => 'array',
        'is_active' => 'boolean',
    ];

    public function relasi()
    {
        return $this->belongsTo(Model::class);
    }
}
```

### Migration
```php
Schema::create('nama_tabel', function (Blueprint $table) {
    $table->ulid('id')->primary();
    $table->foreignUlid('user_id')->constrained()->cascadeOnDelete();
    $table->string('name');
    $table->decimal('amount', 15, 2)->default(0);
    $table->boolean('is_active')->default(true);
    $table->json('metadata')->nullable();
    $table->softDeletes();
    $table->timestamps();
});
```

---

## TypeScript / Frontend

### Page Script (`*.page.ts`)
```typescript
import { AuthService } from '../../core/js/src/services/auth.service';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form') as HTMLFormElement;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        try {
            const result = await AuthService.login({
                email: formData.get('email') as string,
                password: formData.get('password') as string,
            });
            window.location.href = '/dashboard';
        } catch (error) {
            console.error('Login failed:', error);
        }
    });
});
```

### Service (`*.service.ts`)
```typescript
import { api } from '../api/index';

export class AuthService {
    static async login(credentials: { email: string; password: string }) {
        return api.post('/auth/login', credentials);
    }

    static async me() {
        return api.get('/auth/me');
    }

    static async logout() {
        return api.post('/auth/logout');
    }
}
```

### API Client (`api/index.ts`)
```typescript
const BASE_URL = import.meta.env.VITE_API_URL || 'http://vistamora.test';

export const api = {
    async get(path: string) {
        const res = await fetch(`${BASE_URL}${path}`, {
            headers: this.headers(),
        });
        return this.handle(res);
    },

    async post(path: string, body?: unknown) {
        const res = await fetch(`${BASE_URL}${path}`, {
            method: 'POST',
            headers: this.headers(),
            body: body ? JSON.stringify(body) : undefined,
        });
        return this.handle(res);
    },

    headers(): HeadersInit {
        const token = localStorage.getItem('access_token');
        return {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };
    },

    async handle(res: Response) {
        if (!res.ok) throw await res.json();
        return res.json();
    },
};
```

---

## Commit Message Format

```
<type>(<scope>): <deskripsi singkat>

Tipe: feat, fix, refactor, docs, test, chore
Scope: api, vista, mora, core, shared, db

Contoh:
feat(api): implement auth register endpoint
fix(mora): fix wallet balance calculation
refactor(api): extract payroll logic to PayrollService
docs(agent): update domain glossary
test(api): add unit tests for AuthService
```
