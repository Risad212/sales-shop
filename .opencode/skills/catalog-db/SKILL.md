---
name: catalog-db
description: Manage the Postgres product catalog with Prisma (schema, seed, embeddings). Use when working with the database, DATABASE_URL, prisma push/seed/studio, catalog.snapshot.json, product images, pgvector, or adding product fields.
---

# Catalog DB skill (sales-shop)

## Source layout

- `prisma/schema.prisma` — `Product` model (Postgres). Fields: id, title, description, price, category, image (local `/products/...` path), `ageGroup` (kids|teens|adults|seniors|all), `ratingRate`, `ratingCount`, `embedding vector(1024)?`.
- `prisma/catalog.snapshot.json` — 38 products, the offline source of truth. New/changed products go here first.
- `prisma/seed.ts` — upserts snapshot into DB (offline, no network). Run via `npm run db:seed`.
- `prisma/extensions.sql` — `CREATE EXTENSION IF NOT EXISTS vector;` (Neon + Supabase support pgvector).
- Product photos: `public/products/` (38). Category/blog art: `public/seed/`.
- One-time network scripts (already run, keep for provenance): `scripts/snapshot-catalog.ts`, `scripts/add-age-products.ts`, `scripts/fetch-real-photos.ts` (Wikimedia Commons; accepts `IDS=30,31` env filter).

## Go-live order (needs a Neon/Supabase URL in `.env` as `DATABASE_URL`)

1. `psql "$DATABASE_URL" -f prisma/extensions.sql`
2. `npx prisma db push && npm run db:seed`
3. Embeddings (optional): configure `EMBEDDING_*` (Ollama `bge-m3` local, or OpenRouter cloud), then `npm run db:embed`
4. Verify: `curl localhost:3000/api/products?limit=50` should report `"source":"db"`

## Data-access rules

- App code reads via `src/lib/products.ts` only. With `DATABASE_URL` → Postgres; without → local snapshot file. Never reintroduce external API fallbacks.
- Adding a product field: schema → `src/types/index.ts` → `toAppProduct` + snapshot reader → `prisma/seed.ts` → chat parser (`src/lib/chat.ts`) + LLM tool (`src/lib/llm.ts`) + embedding text (`src/lib/embeddings.ts`) → `npx prisma generate`.
- `npx prisma generate` is required after schema edits (Prisma 6 classic CLI; do NOT upgrade to Prisma v8 RC — different CLI).
- Known npm quirk: `prisma` package installs need `--legacy-peer-deps` (npm 10 arborist crash otherwise).
