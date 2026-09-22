# Pending Tasks (detailed)

## P0 — Finish current scope
- [ ] **Fix 3 product photos** (Wikimedia pass was partial)
  - `public/products/35.jpg` — currently a Dantan painting, needs reading glasses.
    Retry `scripts/fetch-real-photos.ts` with queries like `reading glasses product`,
    `spectacles on table`; visually read the result before keeping.
  - `public/products/32.jpg` — duplicate of 23 (Black Converse). Re-fetch with
    `white sneakers` / `running shoes`; must differ from 23.
  - `public/products/34.jpg` — currently a drawing (`Handbag (drawing)`). Re-fetch
    with `tote bag` / `clutch bag`; reject drawings/paintings.
  - After: re-run `node scripts/shot.js`, read `/tmp/shot-home-full.png`, confirm
    all 8 featured cards match their titles. Snapshot JSON already points at these
    paths, no code change needed.
- [ ] **Connect real Postgres** (blocked on owner — no Docker/local PG on this machine)
  1. Create free DB (Neon/Supabase), set `DATABASE_URL` in `.env`.
  2. `psql "$DATABASE_URL" -f prisma/extensions.sql`
  3. `npx prisma db push && npm run db:seed` → expect "Seeded 38 products".
  4. `curl /api/products?limit=50` must report `"source":"db"` (38 items).
- [ ] **Populate embeddings + verify vector RAG**
  1. `ollama pull bge-m3` (or cloud `EMBEDDING_*`), then `npm run db:embed`.
  2. `POST /api/chat {"message":"gift for dad who likes tech"}` must return
     `"retrieval":"vector"` with non-null `score` values in `sources`.

## P1 — Ecommerce essentials
- [ ] **Auth** — NextAuth (credentials + Google): `User` model, login/signup UI,
      protect checkout + admin routes, link cart to user.
- [ ] **Persistent cart** — `CartItem` model (userId, productId, qty); migrate
      `StoreContext` to sync with `/api/cart`; guest cart merges on login.
- [ ] **Checkout + orders** — `Order`/`OrderItem` models, checkout page (address,
      mock payment first), order confirmation + history page, stock decrement.
- [ ] **Admin product manager** — `/admin` (auth-gated): product table, add/edit
      form with image upload to `public/products/`, re-embed on save, delete
      with confirm. Reuse shadcn `ui/` primitives.

## P2 — Agentic upgrades
- [ ] **Chat checkout** — `add_to_cart`, `get_order_status` tools for the LLM;
      order answers grounded on `Order` rows (user-scoped).
- [ ] **Recommendations** — "frequently bought together" from `OrderItem`
      co-occurrence + "you may also like" (same category, high rating).
- [ ] **RAG eval** — `scripts/eval-rag.ts`: fixed query set, asserts recall of
      expected product ids via vector path; run before prompt/model changes.
- [ ] **AI product copy** — admin "generate description/tags" button via LLM.
- [ ] **Visual search** — upload photo → CLIP-style embedding → similarity search
      (needs image embedding column + provider).

## P3 — Ship it
- [ ] **Deploy** — Vercel (env: `DATABASE_URL`, `LLM_*`, `EMBEDDING_*`), Neon
      branch DB, `postinstall: prisma generate`, seed production once.
- [ ] **Cleanup** — remove `scripts/shot.js` dev dep `playwright-core` from
      production install (move to `devDependencies` — already there: verify),
      rotate the Groq key that was pasted in chat (console.groq.com → new key).
