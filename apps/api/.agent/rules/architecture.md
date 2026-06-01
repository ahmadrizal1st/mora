# Aturan Arsitektur Laravel (API)

Backend API ini secara ketat menerapkan pola arsitektur **Controller -> Service -> Repository**. Pemisahan tanggung jawab (Separation of Concerns) adalah kewajiban mutlak.

## Alur Data & Tanggung Jawab

### 1. Controllers (`app/Http/Controllers/`)
- **Tugas**: Menerima request masuk, meneruskannya ke Service, dan memformat *HTTP response* (seperti mereturn JSON).
- ❌ **DILARANG**: Menempatkan logika bisnis yang kompleks di dalam Controller.
- ❌ **DILARANG**: Melakukan query database langsung (contoh: `User::find($id)`) di dalam Controller.

### 2. Services (`app/Services/`)
- **Tugas**: Menangani seluruh inti Logika Bisnis (*Business Logic*).
- Service akan memproses data dari Controller, melakukan kalkulasi atau aturan bisnis, dan mendelegasikan penyimpanan/pengambilan data ke Repository.
- Service tidak peduli dari mana data berasal (HTTP, Console, dll).

### 3. Repositories (`app/Repositories/`)
- **Tugas**: Berinteraksi langsung dengan Database menggunakan Model Eloquent.
- Ini adalah satu-satunya lapisan yang diizinkan untuk memanggil metode query (contoh: `where`, `create`, `update`, `get`).
- *Service layer* WAJIB memanggil *Repository layer* untuk segala urusan transaksi data.

## Direktori Penting Lainnya
- **`app/Models/`**: Digunakan semata-mata untuk mendefinisikan *schema* Eloquent, relasi (*relationships*), dan *casts*/*mutators*.
- **`app/Http/Requests/`**: Semua validasi input WAJIB berada di dalam kelas FormRequest. Jangan melakukan validasi manual dengan `$request->validate()` di dalam Controller.
- **`app/Data/` & `app/Enums/`**: Manfaatkan direktori ini untuk *Data Transfer Objects* (DTO) dan *Enumerations* demi menjaga tipe data yang kuat (*Type-Safe*) saat memindahkan data antar *layer*.
