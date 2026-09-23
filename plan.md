# Sales Shop — Plan (simplified)

## Vision
**Product discovery first**: open the app, search or chat, find products.
Next.js + TypeScript + Tailwind UI, small API layer, LangChain chat. No
accounts, no database — the catalog is a local JSON file, all media is local.

## Stack
| Layer | Choice |
|---|---|
| Frontend | Next.js 14 App Router, React 18, TypeScript (strict), Tailwind CSS, shadcn/ui |
| API | Two small routes: `GET /api/products`, `POST /api/chat` |
| Data | `src/data/catalog.json` (38 products, kids→seniors) + `public/` photos |
| Chat | LangChain (`createAgent` + `ChatGroq` + `search_products` tool) with mock fallback |

## Architecture
```
Browser: pages + ChatWidget ──► /api/products (local JSON)
                              └─► /api/chat {message, history}
                                   ├─ LLM_API_KEY? runLangChainAgent() → engine "llm-langchain"
                                   └─ else mock parser → engine "mock"
                                  Both retrieve via src/lib/rag.ts → { reply, products, sources }
```

## What's done
- TS strict + zod-validated boundaries, production build green
- Storefront (home/shop/category/product/cart/wishlist/contact) + related items
- Age-grouped catalog + shop age filter + chat understands ages/prices
- LangChain RAG chat with sources, mock fallback, eval 11/11 (`npm run eval`)
- Skills: `.opencode/skills/{code-review-qa,shop-chat,ui-verify,catalog-db}`

## Run it
```
npm install
cp .env.example .env   # optional: set LLM_API_KEY for real AI chat
npm run dev            # http://localhost:3000
```

## Possible next steps (only if wanted)
- Postgres + pgvector for semantic search (schema was removed; re-add on demand)
- Accounts/orders/admin (removed as out of scope)
- Deploy to Vercel (no env needed except optional LLM_API_KEY)
