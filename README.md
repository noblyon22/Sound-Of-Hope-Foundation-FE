# Sound of Hope Foundation — Frontend

React + TypeScript + Vite management platform for the Sound of Hope Foundation.

## Stack

| Layer | Library |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| Language | TypeScript (strict) |
| Routing | React Router v6 |
| Server state | TanStack Query v5 |
| Client state | Zustand v5 |
| HTTP | Axios |
| Forms | React Hook Form + Zod |
| UI primitives | Radix UI + shadcn/ui pattern |
| Styling | Tailwind CSS v3 |
| E2E tests | Playwright |
| Unit tests | Vitest + Testing Library |

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

The dev server starts at **http://localhost:5173**.  
The backend API is expected at **http://localhost:8000** (proxied via Vite).

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8000` | Backend base URL |
| `VITE_API_VERSION` | `v1` | API version segment |

## Project structure

```
src/
├── app/           # Entry point, router, providers, global config
├── assets/        # Static assets
├── components/    # Shared UI (ui/, layout/, guards/)
├── features/      # Feature modules (auth/, dashboard/, …)
│   └── auth/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── schemas/
│       ├── services/
│       └── store/
├── hooks/         # App-wide custom hooks
├── lib/           # Utilities (cn, formatDate, …)
├── services/      # API clients and generated types
├── styles/        # Global CSS (Tailwind + CSS variables)
├── test/          # Test setup
├── types/         # Shared TypeScript types
└── utils/         # Pure utility functions
```

## Auth flow

- Access token kept **in-memory** (Zustand, never persisted).  
- Refresh token stored in `localStorage` via Zustand persist middleware.  
- `authenticatedClient` intercepts 401 responses and silently refreshes tokens before retrying.
