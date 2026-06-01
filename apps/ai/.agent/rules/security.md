# Aturan Keamanan (Security) Python AI Service

## 1. Manajemen API Key & Kredensial
- ❌ **DILARANG KERAS** melakukan *hardcode* API Key LLM (seperti OPENAI_API_KEY) di dalam kode sumber.
- ✅ Semua variabel environment rahasia harus dibaca melalui library pengelola konfigurasi (misal `os.getenv` atau Pydantic BaseSettings) dan dimuat dari file `.env`.

## 2. Exception Handling
- Jangan mereturn atau menampilkan *stack trace* Python asli ke klien API saat terjadi *Internal Server Error*, karena dapat membocorkan path direktori atau struktur logika. 
- Tangkap *Exception* dengan `try-except` dan kembalikan response JSON yang terstruktur.

## 3. Sanitasi Input Prompt
- Jika menerima prompt gabungan dari input user, waspadai risiko *Prompt Injection*. Jangan pernah mengeksekusi instruksi sistem langsung dari input mentah pengguna.
