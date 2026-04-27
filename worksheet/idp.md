Berikut prompt per step — singkat, kontekstual, langsung bisa dipakai.

---

### Step 1 — Verifikasi Response OCR
```
Saya punya OCR service (FastAPI Python) yang sudah selesai.
Response-nya berformat JSON dengan field: success, text, type, 
confidence, engine_used, processing_time_ms.

Bantu saya buat integration test untuk verifikasi response ini 
konsisten dari Laravel 13. Gunakan Http facade dan PHPUnit.
Sertakan case: success, file tidak didukung, dan confidence rendah.
```

---

### Step 2 — Definisikan Schema
```
Saya membangun Laravel 13 app yang memproses hasil OCR dari 
berbagai jenis dokumen (invoice, receipt, KTP, audio note).

Bantu saya buat DocumentSchema enum di Laravel menggunakan 
backed enum (string). Setiap case punya method schema() yang 
return array struktur data yang diharapkan dari LLM.
Gunakan tipe data yang jelas (string, number, YYYY-MM-DD, nullable).
```

---

### Step 3 — Prompt Builder
```
Saya punya raw text hasil OCR dari FastAPI service.
Text ini akan dikirim ke LLM (Gemini/Groq/OpenRouter) untuk 
di-extract ke struktur JSON sesuai schema.

Buatkan class PromptBuilder di Laravel 13 yang menerima: 
raw_text, schema array, dan doc_type. Output-nya string prompt 
yang instruktif, singkat, dan memaksa LLM return JSON only 
tanpa markdown. Sertakan instruksi untuk isi null jika field 
tidak ditemukan.
```

---

### Step 4 — LLM Mapper + Fallback
```
Saya di Laravel 13 ingin memanggil 3 LLM provider secara 
berurutan sebagai fallback: Gemini (Google AI Studio), 
Groq, OpenRouter.

Buatkan LLMMapper service yang: menerima prompt string, 
mencoba provider satu per satu, berhenti di provider pertama 
yang berhasil, parse response ke array PHP, dan throw exception 
jika semua gagal. Gunakan Laravel HTTP client (Http facade), 
bukan Guzzle langsung. Simpan API key di .env.
```

---

### Step 5 — Queue Job
```
Saya di Laravel 13 ingin proses mapping LLM secara async 
setelah OCR selesai.

Buatkan Job ProcessOCRResult yang: menerima raw_text, doc_type, 
dan document_id. Di dalam handle() panggil LLMMapper lalu 
update record Document dengan extracted_data dan status 
completed. Implementasi failed() untuk update status ke failed 
beserta error message. Set tries 3 dan backoff 10 detik.
```

---

### Step 6 — Controller
```
Saya di Laravel 13 punya OCR service internal (FastAPI) dan 
LLM mapping via queue job yang sudah selesai dibuat.

Buatkan method upload() di DocumentController yang: validasi 
file dan doc_type, kirim file ke OCR service via Http facade, 
simpan raw_text ke tabel documents dengan status pending, 
dispatch ProcessOCRResult job, return 202 dengan document_id. 
Gunakan try-catch untuk handle OCR service down.
```

---

**Cara pakainya:** Copy satu prompt per sesi chat baru, jalankan step by step. Jangan gabung semua sekaligus — supaya hasilnya fokus dan kodenya tidak melebar.