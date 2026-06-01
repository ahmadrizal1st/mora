# Aturan Pengujian (Testing) Python

Pengujian dilakukan menggunakan **Pytest**.

## 1. Isolasi Pengujian
- Jangan melakukan panggilan jaringan yang sebenarnya (*real network call*) ke API penyedia AI (OpenAI/Gemini) selama pengujian *Unit Test*, karena akan memakan biaya dan berjalan lambat.
- Selalu gunakan `pytest-mock` (mocker) atau library *mocking* bawaan untuk memalsukan respon dari *LLM provider*.

## 2. Pengecekan Coverage
- Pastikan rute API utama diuji kelayakannya menggunakan `TestClient` (FastAPI). 
- Pengujian harus memverifikasi bahwa respons mengikuti skema *Pydantic* yang ditentukan.
