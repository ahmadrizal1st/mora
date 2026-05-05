# Sequence Diagram - Fitur Tracker

Diagram urutan ini memodelkan interaksi antar *services* (Frontend, Laravel API, AI FastAPI, Queue, Worker, dan LLM) secara asinkron (background process) untuk menghasilkan data transaksi.

```mermaid
sequenceDiagram
    actor User
    participant FE as Frontend (React/Vite)
    participant API as Laravel API (PHP 8.3)
    participant AI as AI FastAPI (Python)
    participant Queue as DB Queue (PostgreSQL)
    participant Worker as Queue Worker
    participant LLM as LLM Mapper (Gemini/Groq)
    participant DB as transactions table
    
    User->>FE: Input Tracker (Image/Audio/File atau Text)
    
    alt Input Image / Audio / File
        FE->>API: POST /api/documents/upload
        activate API
        API->>AI: POST /api/extract (Kirim Data/URL)
        activate AI
        Note over AI: Proses ekstraksi surya-ai / whisper
        AI-->>API: Return raw_text
        deactivate AI
        API->>Queue: Dispatch Job ProcessAIResult(raw_text)
        API-->>FE: 202 Accepted (Proses di Background)
        deactivate API
    else Input Text (Bypass AI)
        FE->>API: POST /api/documents/text
        activate API
        Note over API: Bypass AI, langsung proses teks
        API->>Queue: Dispatch Job ProcessAIResult(raw_text)
        API-->>FE: 202 Accepted (Proses di Background)
        deactivate API
    end
    
    Note over Queue,Worker: Asynchronous Background Process
    Queue->>Worker: Worker mengambil Job
    activate Worker
    Worker->>LLM: Kirim raw_text untuk di-mapping
    activate LLM
    Note over LLM: Generate prompt & Ekstrak Entitas
    LLM-->>Worker: Return structured JSON
    deactivate LLM
    Worker->>DB: Insert structured JSON ke transactions
    activate DB
    DB-->>Worker: Success Inserted
    deactivate DB
    deactivate Worker
```
