Berikut prompt singkat untuk setiap task, siap copy-paste ke Claude:

---

**Sprint 1 — Fondasi & Setup**

1.1 `Buat struktur folder FastAPI OCR service dengan Clean Architecture: api/, services/, engines/, utils/, schemas/. Sertakan requirements.txt MVP tier (surya-ocr, faster-whisper, pymupdf, python-docx, openpyxl, python-pptx, dll), .env template, dan .gitignore.`

1.2 `Buat main.py dan router.py FastAPI. Tambahkan endpoint GET /health yang return {status, tier, version, uptime_seconds} tanpa autentikasi.`

1.3 `Buat FastAPI dependency untuk validasi header X-API-Key dari environment variable. Buat schemas/request.py (ExtractRequest) dan schemas/response.py (ExtractResponse) sesuai field: text, type, engine_used, language, confidence, pages, processing_time_ms, file_info.`

1.4 `Buat Dockerfile python:3.11-slim dengan install ffmpeg, poppler-utils, libmagic. Buat docker-compose.yml dengan memory limit 8G, env_file, volume /tmp/ocr, restart unless-stopped, uvicorn 4 workers.`

---

**Sprint 2 — POST /extract (Non-OCR)**

2.1 `Buat endpoint POST /extract yang terima multipart/form-data (field: file, language, engine_hint). Validasi: file size max 100MB (return 413), MIME type via python-magic bukan ekstensi (return 415 jika tidak didukung), simpan ke /tmp/ocr/{uuid}. Return 400 jika file kosong.`

2.2 `Buat services/document_service.py yang ekstrak teks dari DOCX (python-docx), XLSX (openpyxl/pandas → join cell per row), PPTX (python-pptx → join semua slide), TXT dan RTF (striprtf). Return plain text dan engine_used string.`

2.3 `Buat engines/pymupdf_engine.py yang buka PDF dengan PyMuPDF. Deteksi PDF selectable: jika total karakter per halaman > 10, ekstrak langsung. Return teks, jumlah pages, confidence 0.99, type "pdf_text".`

2.4 `Buat services/detector.py yang routing file ke engine yang tepat berdasarkan MIME type. Sprint ini: DOCX/XLSX/PPTX/TXT → document_service, PDF selectable → pymupdf_engine. Return dict {text, type, engine_used, confidence, pages}.`

2.5 `Pastikan file /tmp/ocr/{uuid} selalu dihapus setelah proses dengan try/finally. Tambahkan response headers: X-Processing-Time, X-Engine-Used, X-Confidence, X-Request-ID (echo dari request header).`

---

**Sprint 3 — OCR Engine (Surya) + Audio (Whisper)**

3.1 `Buat engines/base.py dengan abstract class BaseOCREngine (method: extract(file_path) → dict). Buat engines/surya_engine.py implementasi SuryaEngine dengan lazy loading: model hanya di-load saat pertama dipanggil, reuse setelahnya. Device CPU only.`

3.2 `Buat utils/preprocessor.py dengan fungsi: (1) blur_score menggunakan Laplacian variance, (2) enhance_image yang jalankan grayscale → denoise → Otsu threshold → deskew jika blur_score < threshold. Return image yang sudah diproses.`

3.3 `Buat services/image_service.py: terima path gambar → cek blur → jika perlu preprocess → kirim ke SuryaEngine → jika confidence < 0.75 retry dengan preprocessing. Buat services/pdf_service.py: konversi PDF scan ke images dengan pdf2image per halaman → OCR tiap halaman → gabung teks. Update detector.py untuk routing gambar dan PDF scan.`

3.4 `Buat utils/audio_utils.py yang wrap FFmpeg untuk normalize audio ke 16kHz mono WAV. Buat engines/whisper_engine.py dengan Faster-Whisper model=small, device=cpu, compute_type=int8, lazy loading. Support input MP3/WAV/M4A/OGG. Return teks transkripsi dan confidence.`

3.5 `Buat endpoint GET /engines (butuh X-API-Key) yang return status tiap engine {name, status: ready/loading/error, loaded, model, device} dan system info {ram_used_gb, ram_total_gb, cpu_percent}. Update GET /health return status "degraded" + message jika ada engine error.`

---

**Sprint 4 — Stabilisasi & Testing**

4.1 `Implementasi rate limiter in-memory di FastAPI (gunakan slowapi atau manual middleware). Limit 60 request/menit per IP. Return 429 dengan header Retry-After jika melebihi limit.`

4.2 `Buat global exception handler FastAPI untuk semua error code PRD: 400 invalid_request, 401 unauthorized, 413 file_too_large, 415 unsupported_format, 422 extraction_failed, 429 rate_limit_exceeded, 500 internal_error, 503 engine_unavailable. Semua return format {success: false, error: string, message: string}.`

4.3 `Buat endpoint POST /extract/batch (max 10 file, masing-masing max 100MB). Untuk MVP proses sequential, return langsung semua hasil tanpa async queue. Simpan hasil di in-memory dict dengan key batch_id (UUID). Buat GET /extract/batch/{batch_id} untuk ambil hasil. Buat DELETE /extract/batch/{batch_id} untuk cancel yang belum selesai.`

4.4 `Buat pytest di tests/ untuk semua format: JPG, PNG, PDF text, PDF scan, DOCX, XLSX, PPTX, TXT, MP3. Siapkan file sample kecil di tests/samples/. Test juga error cases: tanpa API key (401), file kosong (400), MIME tidak didukung (415), file terlalu besar (413).`

4.5 `Buat script benchmark Python yang test POST /extract dengan 20+ file berbeda dan catat processing_time_ms dari response. Validasi target PRD: PDF text <2 dtk, gambar <4 dtk, audio <8 dtk per menit audio. Print summary hasil dan flag mana yang tidak memenuhi target.`