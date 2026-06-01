# Aturan Arsitektur Python (FastAPI/Service)

Aplikasi ini adalah servis AI berbasis Python.

## Struktur Direktori
- **`api/`** atau **`routers/`**: Tempat mendeklarasikan endpoint API.
- **`services/`**: Tempat meletakkan logika integrasi LLM, pemrosesan teks/OCR, dan logika bisnis utama.
- **`schemas/`**: Pydantic models untuk validasi Input/Output data (Request/Response).
- **`utils/`**: Fungsi pembantu (*helpers*), formatter, atau kalkulasi independen.
- **`engines/`**: Konfigurasi koneksi ke eksternal AI provider (misal: OpenAI, Gemini, Anthropic).

## Prinsip Ketergantungan
- Router hanya bertugas menerima request, memanggil fungsi di `services/`, dan mereturn response. Dilarang menaruh logika *prompting* di Router.
