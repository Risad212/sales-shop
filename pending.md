# Pending Tasks

Scope is now: UI + local catalog + LangChain chat. No DB, no auth.

- [ ] **Deploy to Vercel** (optional) — import repo, set `LLM_API_KEY` if wanted,
      done. Nothing else needed.
- [ ] **More products** — append entries to `src/data/catalog.json` + photos in
      `public/products/`; chat + filters pick them up with no code changes.
- [ ] **Only if scope grows again** — Postgres/pgvector, accounts, orders, admin.
      (All removed deliberately; see git history to restore.)
