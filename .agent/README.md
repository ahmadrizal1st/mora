# 📑 Agent Workspace — Vista & Mora MVP

Direktori ini berisi konfigurasi untuk AI Agent. Baca **`AGENT.md`** sebagai entry point utama.

### Quick Reference

| File | Isi |
|:-----|:----|
| [AGENT.md](./AGENT.md) | Entry point, arsitektur, constraints |
| [config.yml](./config.yml) | Konfigurasi utama agent |

### Context

| File | Isi |
|:-----|:----|
| [context/product-vision.md](./context/product-vision.md) | Visi produk, target user, roadmap |
| [context/architecture.md](./context/architecture.md) | Tech stack & API standards |
| [context/domain-glossary.md](./context/domain-glossary.md) | Istilah bisnis & roles |

### Rules

| File | Isi |
|:-----|:----|
| [rules/backend.md](./rules/backend.md) | MVC + Service + Repository pattern |
| [rules/frontend.md](./rules/frontend.md) | Arsitektur folder apps/ & naming |
| [rules/database-conventions.md](./rules/database-conventions.md) | ULID, migration, data types |
| [rules/api-design.md](./rules/api-design.md) | REST API, response format, rate limit |

### Prompts, Tools, Memory, Schemas, Evals

| Folder | Isi |
|:-------|:----|
| [prompts/](./prompts/) | System prompt, task template, format output |
| [tools/](./tools/) | Definisi tools (web search, code exec, file ops) |
| [memory/](./memory/) | Context state, history log, facts |
| [schemas/](./schemas/) | JSON Schema input & output |
| [evals/](./evals/) | Test cases & results |
