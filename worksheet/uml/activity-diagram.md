# Activity Diagram - Fitur Tracker

Diagram aktivitas ini menggambarkan alur kontrol dari pengiriman data (media atau teks) hingga diproses menjadi transaksi yang disimpan di *database* sesuai arsitektur terbaru.

```mermaid
flowchart TD
    Start((Mulai)) --> Choose["User mengirim data Tracker dari Frontend (:5173)"]
    Choose --> IsText{"Apakah input berupa Text?"}
    
    IsText -- Ya --> PostText["Laravel API: POST /api/documents/text"]
    IsText -- Tidak (Image/Audio/File) --> PostUpload["Laravel API: POST /api/documents/upload"]
    
    PostUpload --> FastAPI["AI FastAPI (:8000) - Ekstraksi dengan surya-ai / whisper"]
    FastAPI --> ExtractResult["Hasilkan raw_text"]
    
    PostText --> BypassAI["Bypass AI: Langsung gunakan input text sebagai raw_text"]
    BypassAI --> Queue
    
    ExtractResult --> Queue["Laravel API: Dispatch Job dengan raw_text ke Database Queue (PostgreSQL)"]
    
    Queue --> Worker["Queue Worker (php artisan queue:work) memproses ProcessAIResult"]
    Worker --> LLM["Kirim raw_text ke LLM Mapper (Gemini / Groq)"]
    LLM --> JSON["Dapatkan balasan berupa structured JSON"]
    
    JSON --> SaveDB["Simpan data ke tabel transactions (PostgreSQL)"]
    SaveDB --> End((Selesai))
```
