---
trigger: manual
---

# Tabler React Frontend Rules

> **Version:** 1.2.0 | **Architecture:** React 19 + Vite 7 + Tabler React (Bootstrap/Sass)

## Folder Structure (apps/vista & apps/mora)

src/
├── components/               # Shared Reusable UI components (Button, Card, Input)
├── context/                  # Global Context Providers (Auth, Theme)
├── features/                 # CLEAN FEATURE-BASED ARCHITECTURE (Modular)
│   ├── auth/                 # Example: Auth Module
│   │   ├── api/              # Module-specific API calls
│   │   ├── components/       # Module-specific components
│   │   ├── hooks/            # Module-specific hooks
│   │   ├── types/            # Module-specific types
│   │   └── index.ts          # Public API for the module
│   └── dashboard/            # Example: Dashboard Module
├── hooks/                    # Shared Custom React hooks
├── layouts/                  # Layout templates (BaseLayout, AuthLayout)
├── pages/                    # Routing entry points (combines features)
├── routes/                   # Route configurations
├── services/                 # Shared domain logic & API services
├── types/                    # Shared TypeScript definitions
├── utils/                    # Shared helper functions (api client, formatting)
├── App.tsx                   # Root component
└── main.tsx                  # Entry point
```

## Prinsip

| Rule | Keterangan |
|:-----|:-----------|
| **Framework** | Gunakan **React 19** dengan **Vite**. Default UI adalah **Tabler React**. |
| **Components** | Gunakan Functional Components dengan Hooks. Hindari Class Components. |
| **Styling** | Styling menggunakan SCSS/Sass bawaan Tabler React. **Jangan gunakan Tailwind** kecuali ada instruksi khusus. |
| **Architecture** | Gunakan **Clean Feature-Based Architecture**. Kelompokkan kode berdasarkan fitur/domain di folder `features/`. |
| **State** | Gunakan **TanStack Query** untuk server state (data API) dan **Zustand** atau **Context** untuk UI state sederhana. |
| **API** | Gunakan repositori di `features/*/api` atau `services/`. Semua lewat `src/utils/api.ts` (Axios instance). |
| **Types** | Wajib menggunakan TypeScript ketat. Definisikan DTOs untuk setiap endpoint API. |
| **Capacitor** | Vista & Mora bisa di-build ke native app via Capacitor. Jangan gunakan API browser-only tanpa fallback. |

## Naming Conventions

| Tipe File | Konvensi |
|:----------|:---------|
| **Components** | `PascalCase.tsx` (e.g. `WelcomeCard.tsx`, `Sidebar.tsx`) |
| **Pages** | `PascalCasePage.tsx` (e.g. `DashboardPage.tsx`, `LoginPage.tsx`) |
| **Hooks** | `useCamelCase.ts` (e.g. `useAuth.ts`, `useEmployees.ts`) |
| **Services** | `camelCase.service.ts` (e.g. `auth.service.ts`) |
| **Styles** | `name.module.scss` (untuk CSS Modules) atau `main.scss` (global) |

## Build Tool
**Vite**

