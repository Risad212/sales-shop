---
name: code-review-qa
description: Review code and run QA checks on this sales-shop Next.js app. Use when asked to review code, check quality, audit changes, QA a feature, or verify before commit.
---

# Code Review + QA for sales-shop

Stack: Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui + Prisma 6 + Postgres (pgvector-ready). Path alias `@` → `src` (see `tsconfig.json` + webpack alias in `next.config.mjs`).

## QA gate (run in order)

1. `npx tsc --noEmit` — must be clean.
2. `npm run build` — must compile; watch for "Dynamic server usage" (fix with `export const dynamic = "force-dynamic"` on request-reading routes).
3. Runtime sweep on dev server (`npx next dev -p 3100`):
   - Pages: `/ /shop /cart /wishlist /contact /product/1 /category/electronics` → expect 200.
   - APIs: `GET /api/products?limit=2`, `GET /api/products/1`, `POST /api/chat {"message":"hi"}` → expect 200.
   - `GET /api/products/99999` → expect 404 (correct, not a bug).
4. Chat regression queries (POST /api/chat): `hi`, `jacket under $50`, `Men's clothing`, `Top rated`, `Jewelery gifts`, `toys for kids`, `something for seniors` — every one must return `products.length > 0`.
5. Visual check: `node scripts/shot.js` screenshots `http://localhost:3000/` to `/tmp/shot-home-*.png` — read them to confirm layout, images, no console errors.

## Review checklist

- **No external runtime deps**: no `fakestoreapi.com`, no hotlinked images. Product/blog/category media must live in `public/`. Exception: one-time scripts in `scripts/` (snapshot/fetch tools) may call external APIs.
- **Data layer**: all catalog reads go through `src/lib/products.ts` (`queryProducts`, `getProductById`, `getCategories`). Never fetch external APIs from components; components call `/api/*` routes.
- **Chat contract**: `POST /api/chat` returns `{ reply, products, engine: "mock"|"llm" }`. Keep the mock parser (`src/lib/chat.ts`) working when `LLM_API_KEY` is unset; LLM failures must fall back to mock, never 500.
- **Client boundaries**: any component with event handlers needs `"use client"` (Footer precedent). No event-handler props passed from server components.
- **Styling**: Tailwind + shadcn primitives in `src/components/ui/`; brand green `#6BB42F`; `cn()` from `@/lib/utils` for class merging.
- **Types**: new product fields must flow through `src/types/index.ts` → `toAppProduct` → snapshot reader → Prisma seed → chat parser + LLM tool schema + embedding text.
- **Secrets**: never commit `.env` (gitignored). Only `.env.example` documents vars.
- **No dead code**: unused deps (axios precedent) get uninstalled; empty legacy dirs get removed.
