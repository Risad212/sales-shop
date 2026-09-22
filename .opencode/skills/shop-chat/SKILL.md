---
name: shop-chat
description: Work on the AI shopping assistant (chat widget, search parser, LLM agent, semantic search). Use when asked about chat, assistant, product search, recommendations, search_products tool, embeddings search, Groq/OpenRouter, or agentic commerce.
---

# Shop Chat skill (sales-shop)

## Architecture

```
RAG: ChatWidget.tsx → POST /api/chat {message, history}
     → {reply, products, sources[{id,title,price,score}], retrieval, engine}
  ├─ LLM_API_KEY set → agenticChat() (src/lib/llm.ts): OpenAI-compatible
  │  chat-completions + search_products tool loop (max 2 rounds) → engine "llm"
  │  └─ on any LLM error → falls back to mock (never 500s)
  └─ no key → parseMessage() (src/lib/chat.ts) rule parser → engine "mock"
Both paths retrieve via src/lib/rag.ts (retrieve → vector-first with
similarity scores, keyword fallback) → Postgres, else local snapshot.
```

## Key files

- `src/components/chat/ChatWidget.tsx` — floating button + panel, suggestion chips, product cards wired to cart store. Sends last ~7 text turns as `history`.
- `src/app/api/chat/route.ts` — zod-validated `{message (1–500 chars), history?}`.
- `src/lib/llm.ts` — `getLlmConfig()` (Groq default `openai/gpt-oss-20b`; OpenRouter alt in `.env.example`), `SEARCH_TOOL` (search, category, **ageGroup**, min/maxPrice, limit), system prompt, tool loop.
- `src/lib/chat.ts` — mock intents (greet/search/recommend/help); category + age aliases; price patterns (`under $X`, `between $A and $B`, cheap→≤$70, premium→≥$150); apparel stopwords so "men's clothing" doesn't search "clothing".
- `src/lib/embeddings.ts` + `semanticSearch()` in products — vector search auto-tried when `search` text + embeddings exist, else keyword fallback.

## Test battery (all must return products)

`hi` · `jacket under $50` · `Men's clothing` · `Top rated` · `Jewelery gifts` · `toys for kids` · `something for seniors` · `gifts for teenagers` · `cheap electronics`

Check `engine` field to confirm which brain answered. Live LLM needs `.env` `LLM_API_KEY` + server restart. Groq model IDs retire — if `model_not_found`, list live models via `GET /openai/v1/models` and update `LLM_MODEL` (+ default in `llm.ts` + `.env.example`).
