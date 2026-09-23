# Sales Shop — Full Plan

## Vision
**Product discovery first**: a RAG-based shop where customers find products by
chatting (keywords, meaning, age group, price), with open-source LLMs in the
cloud and Postgres + pgvector as the product brain. No accounts — guest cart
and wishlist live in the browser.

## Stack
| Layer | Choice |
|---|---|
| Frontend | Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, shadcn/ui, lucide-react |
| API | Next.js Route Handlers (`src/app/api/*`) |
| Data | Postgres (Neon/Supabase) via Prisma 6; local snapshot fallback (`prisma/catalog.snapshot.json`) |
| Vectors | pgvector `vector(1024)`, BGE-M3 embeddings (Ollama local / OpenRouter cloud) |
| Chat LLM | OpenAI-compatible cloud endpoint, default Groq `openai/gpt-oss-20b` (open-source) |
| Media | 100% local in `public/` — zero external image/API calls at runtime |

## Architecture
```
Browser: pages + ChatWidget ──► /api/products (DB → snapshot fallback)
                              └─► /api/chat {message, history}
                                   ├─ LLM_API_KEY? agenticChat(): tool loop over search_products
                                   │   (src/lib/llm.ts, max 2 rounds, mock fallback on error)
                                   └─ else parseMessage() (src/lib/chat.ts rule parser)
                                  Both retrieve via src/lib/rag.ts:
                                   retrieve() → pgvector similarity (scored) → keyword fallback
                                   → { reply, products, sources[{id,title,price,score}], retrieval }
```

## Completed phases
1. **TS + UI migration** — all JSX→TSX, shadcn primitives (`ui/`), typed store context, fixed Next.js Link/params bugs, `error.tsx` + `global-error.tsx` boundaries.
2. **Full-stack catalog** — Prisma schema, `db:push/seed/studio`, `/api/products`, `/api/products/[id]`, storefront reads through the API.
3. **Chat v1** — mock parser (categories, ages, prices, recommend) + floating widget wired to cart.
4. **FakeStore removal** — one-time snapshot (38 products, local photos in `public/products/`, `public/seed/`); runtime has zero external deps (axios uninstalled).
5. **Age-grouped catalog** — `ageGroup` (kids|teens|adults|seniors|all) across schema, API, chat parser, LLM tool, shop "Shop by Age" filter, product badges; 18 new products (38 total).
6. **Agentic LLM** — Groq key live, tool-calling verified (`engine: llm`), mock fallback intact.
7. **RAG layer** — `retrieve()` with similarity scores, grounded generation, `sources[]` + `retrieval` in every chat response.
8. **Project skills** — `.opencode/skills/{code-review-qa,catalog-db,shop-chat,ui-verify}/SKILL.md`.

## Go-live (needs DATABASE_URL)
```
cp .env.example .env   # set DATABASE_URL (+ LLM_API_KEY already set locally)
psql "$DATABASE_URL" -f prisma/extensions.sql
npx prisma db push && npm run db:seed
ollama pull bge-m3     # or set EMBEDDING_* for cloud
npm run db:embed
npm run build && npm start
```

## Next features (see pending.md)
Auth + persistent cart, checkout/orders, admin product manager, RAG eval,
recommendations ("bought together"), visual search, deploy (Vercel + Neon).
