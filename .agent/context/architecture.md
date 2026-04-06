# Architecture — Vista & Mora MVP

> **Version:** 1.2.0

## Tech Stack

| Layer | Teknologi |
|:------|:----------|
| **Backend** | Laravel 13 Monolithic API (`/api`) |
| **Frontend** | Tabler React (React 19 + Vite 7) (`/apps/vista`, `/apps/mora`) |
| **State Management** | TanStack Query (v5) & Zustand (v4) |
| **Cross-Platform** | Capacitor (web → Android, iOS, Desktop) |
| **Database** | PostgreSQL 16 |
| **Queue** | Redis 7 (Supervisor / Laravel Horizon) |
| **Cloud** | Hetzner Cloud CX22 |
| **Storage** | Cloudflare R2 |

## API Standards

| Property | Value |
|:---------|:------|
| **Base URL** | `http://vistamora.test` |
| **Auth** | Bearer Token (Sanctum) |
| **Versioning** | Tanpa prefix `/v1`. Langsung (e.g. `/auth`, `/payroll`) |
| **Response** | Standard Laravel Schema: `{ success: boolean, data: any, message: string }` |

