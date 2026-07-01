# Repository Audit — OpenHealth

> Internal engineering audit. Generated during fork preparation.

## Current Architecture

OpenHealth is a **single-package full-stack Next.js 15 application** combining React 19 frontend, API routes, and server actions in one repository.

```
Client (Browser)
    → Next.js App Router (pages, API routes, middleware)
        → PostgreSQL (Prisma ORM)
        → Docling Serve (Docker, document parsing)
        → LLM providers (OpenAI, Anthropic, Google, Ollama via LangChain)
        → Vercel Blob (cloud file storage)
        → Trigger.dev (cloud background jobs)
```

**Key characteristics:**
- Deployment modes: `local` vs `cloud` via `DEPLOYMENT_ENV`
- Auth: NextAuth v5 credentials provider with JWT sessions
- i18n: next-intl with 10 locales
- ~99 TypeScript source files, strict mode enabled
- Docker Compose stack: Postgres + Docling + app

## Major Weaknesses

| Area | Issue |
|------|-------|
| **Testing** | No test framework, zero test files |
| **API security** | Several routes lack auth/ownership checks (`health-data/[id]`, `chat-rooms/[id]`, `llm-providers/[id]`) |
| **Caching** | No persistence layer for session/cache data |
| **Configuration** | Environment variables scattered across modules |
| **Logging** | Ad-hoc `console.log` / `console.error` only |
| **Error handling** | Inconsistent patterns across API routes |
| **Dev tooling** | No typecheck script, no Prettier, duplicate Tailwind config |
| **Structure** | Duplicate `hook/` vs `hooks/` directories |
| **Dependencies** | `shadcn-ui` npm package unused (CLI tool only) |
| **Bug** | `OPENAI_API` typo in PDF parser (should be `OPENAI_API_KEY`) |
| **Docker** | Container uses `prisma db push --accept-data-loss` on startup |
| **Git hygiene** | `.idea/` committed, `package-lock.json` tracked |

## Recommended Improvements

1. **Add Redis** — connection manager with retry, graceful shutdown, env-based config
2. **Centralize configuration** — typed env module with validation
3. **Structured logging** — consistent logger with levels
4. **API auth helpers** — reusable session + ownership checks
5. **Vitest** — unit tests for infrastructure modules
6. **TypeScript hardening** — `noUnusedLocals`, `noUnusedParameters`, remove `allowJs`
7. **Repository cleanup** — gitignore updates, remove IDE artifacts
8. **README redesign** — professional documentation with Mermaid diagrams
9. **Fix security gaps** — protect unauthenticated API routes
10. **Consolidate hooks** — merge `hook/` into `hooks/`
