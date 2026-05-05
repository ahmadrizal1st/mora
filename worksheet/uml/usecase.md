# Use Case Diagram - Fitur Tracker

Diagram Use Case ini menggambarkan interaksi antara pengguna (User) dengan sistem serta aktor sistem lainnya (AI FastAPI dan LLM) dalam memproses media menjadi transaksi terstruktur.

```mermaid
flowchart LR
    User((User))
    SysAI(("AI FastAPI (surya-ai / whisper)"))
    SysLLM(("LLM Mapper (Gemini / Groq)"))

    subgraph Tracker System
        UC1([Upload Image / Audio / File])
        UC2([Input Text Manual])
        UC3([Ekstraksi Teks dari Media])
        UC4([Mapping Teks ke Structured JSON])
        UC5([Simpan Data Transaksi])
    end

    User --> UC1
    User --> UC2
    
    UC1 --> UC3
    SysAI --> UC3
    
    UC2 --> UC4
    UC3 --> UC4
    SysLLM --> UC4
    
    UC4 --> UC5
```
