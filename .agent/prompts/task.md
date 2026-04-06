# Task Prompt Template

Template instruksi untuk memberikan task kepada agent.

---

## Format Task

```
### Task: [Judul Task]

**Tipe:** [feature | bugfix | refactor | docs | test]
**Scope:** [api | vista | mora | core | shared | full-stack]
**Priority:** [high | medium | low]

**Deskripsi:**
[Jelaskan apa yang harus dikerjakan]

**Acceptance Criteria:**
- [ ] [Kriteria 1]
- [ ] [Kriteria 2]
- [ ] [Kriteria 3]

**Referensi:**
- worksheet/[file].yml — [keterangan]
- .agent/rules/[file].md — [keterangan]

**Catatan:**
[Info tambahan jika ada]
```

---

## Contoh Task

### Task: Implementasi Auth Register

**Tipe:** feature
**Scope:** api
**Priority:** high

**Deskripsi:**
Buat endpoint `POST /auth/register` yang menerima name, email, password, dan role. Kirim OTP ke email setelah register berhasil.

**Acceptance Criteria:**
- [ ] Endpoint `POST /auth/register` berfungsi
- [ ] Validasi email unique, password min 8 chars
- [ ] Password di-hash dengan bcrypt
- [ ] OTP 6 digit digenerate dan disimpan di Redis (TTL 10 menit)
- [ ] Email OTP dikirim via Resend
- [ ] Response 201 dengan user_id dan message

**Referensi:**
- worksheet/route.yml — definisi endpoint auth
- worksheet/api/architecture.yml — auth service flow
- .agent/rules/laravel-backend.md — MVC + Service + Repository pattern

**Catatan:**
Gunakan FormRequest untuk validasi. Business logic di AuthService. Query di UserRepository.
