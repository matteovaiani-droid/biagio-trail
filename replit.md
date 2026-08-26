# BIAGIO TRAIL

A mobile-first hiking companion for discovering, saving, and planning Italian trekking routes.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/biagio-trail/src/App.tsx` — route shell and app entry
- `artifacts/biagio-trail/src/data/trails.ts` — local trail catalog and app settings types
- `artifacts/biagio-trail/src/components/` — responsive shell and reusable trail UI
- `artifacts/biagio-trail/src/pages/` — welcome, trail list, detail, favorites, and settings screens
- `artifacts/biagio-trail/src/index.css` — shared outdoor theme tokens and responsive styles

## Architecture decisions

- The first release is frontend-only so trail discovery and saved-route interactions are immediately usable without account setup.
- Favorites and settings persist in local storage to keep the mobile experience useful across reloads.
- The responsive shell uses bottom navigation on phones and a navigation rail on wider screens.

## Product

BIAGIO TRAIL helps people explore scenic trails across Italy, compare routes by difficulty and distance, read route notes, save favorites, and configure practical preferences such as units, notifications, and offline route notes.

## User preferences

- Mobile-first responsive design
- Modern green and blue outdoor theme

## Gotchas

- The Vite workflow supplies `PORT` and `BASE_PATH`; run the artifact workflow rather than starting Vite from the workspace root.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
