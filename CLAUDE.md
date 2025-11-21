<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# Riverbank

Message-in-a-bottle web app on Cloudflare Workers.

## Critical: CLI Tools First

**Always prioritize CLI tools over manual code generation:**
- `npx shadcn@latest add <component>` - Add UI components
- `pnpm run db:generate` - Generate Drizzle migrations from schema changes
- `pnpm run db:migrate` / `db:migrate:uat` / `db:migrate:pro` - Apply migrations
- `wrangler d1 execute` - Direct D1 queries
- `wrangler deploy` - Deploy to Cloudflare

This reduces code generation errors and ensures consistency.

## Project Structure

```
src/
├── web/           # React 19 frontend (Vite 6)
│   ├── routes/    # TanStack Router (file-based)
│   ├── components/ui/  # shadcn/ui components
│   ├── hooks/     # Custom hooks (theme)
│   └── lib/       # Utilities (cn())
└── worker/        # Hono.js API
    └── db/        # Drizzle schema
migrations/        # Drizzle D1 migrations
```

## Key Conventions

**Path alias:** `@/` → `src/web/` (non-standard)
```typescript
import { Button } from "@/components/ui/button"
```

**Vite plugins order:** TanStack Router → React → Cloudflare → TailwindCSS

**Database:** Cloudflare D1 + Drizzle ORM
- Schema: `src/worker/db/schema.ts`
- Single table: `bottles` (id, message, nickname, country, ip, status, like_count, report_count, created_at)
- IDs: nanoid

**API:** Hono.js in `src/worker/index.ts`
- `POST /api/bottles/throw` - Submit message, receive random bottles
- `POST /api/bottles/:id/like` - Like a bottle
- `POST /api/bottles/:id/report` - Report a bottle

## Commands

```bash
pnpm dev              # Dev server (local D1)
pnpm build            # Build
pnpm deploy           # Deploy to Cloudflare
pnpm db:generate      # Generate migration from schema
pnpm db:migrate       # Apply migrations (local)
pnpm db:studio:local  # Drizzle Studio
```

## Tech Stack

- React 19, Vite 6, TypeScript 5.8
- Hono.js 4.8 (Cloudflare Workers)
- TailwindCSS 4, shadcn/ui (new-york style)
- TanStack Router v1
- Drizzle ORM + Cloudflare D1

## Notes

- TailwindCSS v4: Uses `@import "tailwindcss"` (no config file needed)
- Generated files: `routeTree.gen.ts` (gitignored, readonly)
- Environments: default (local), uat, pro
