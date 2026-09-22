/**
 * Open-source LLM agent layer (OpenAI-compatible chat API).
 * Works with any OpenAI-compatible cloud provider serving open models:
 *   - Groq (free tier):  base https://api.groq.com/openai/v1, model e.g. llama-3.1-8b-instant
 *   - OpenRouter:        base https://openrouter.ai/api/v1, model e.g. meta-llama/llama-3.1-8b-instruct
 *   - Together, HF Inference, vLLM self-hosted, Ollama, ...
 * No extra SDK needed — plain fetch.
 */
import { retrieve, toProducts, toSources, type Source } from "./rag";
import type { Product } from "@/types";

export interface LlmConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

export function getLlmConfig(): LlmConfig | null {
  const apiKey = process.env.LLM_API_KEY;
  if (!apiKey) return null;
  return {
    apiKey,
    baseUrl: (process.env.LLM_BASE_URL ?? "https://api.groq.com/openai/v1").replace(/\/$/, ""),
    model: process.env.LLM_MODEL ?? "openai/gpt-oss-20b",
  };
}

const SEARCH_TOOL = {
  type: "function",
  function: {
    name: "search_products",
    description:
      "Search the shop product catalog. Use it for any product request: search, browse, recommendations, gifts, price or category questions.",
    parameters: {
      type: "object",
      properties: {
        search: {
          type: "string",
          description: "Keyword search over product titles and descriptions, e.g. 'jacket', 'watch', 'backpack'.",
        },
        category: {
          type: "string",
          enum: ["men's clothing", "women's clothing", "jewelery", "electronics", "kids", "toys"],
          description: "Filter by category.",
        },
        ageGroup: {
          type: "string",
          enum: ["kids", "teens", "adults", "seniors"],
          description: "Filter by age group.",
        },
        minPrice: { type: "number", description: "Minimum price in USD." },
        maxPrice: { type: "number", description: "Maximum price in USD." },
        limit: { type: "integer", description: "Max results (default 6, max 10)." },
      },
    },
  },
};

const SYSTEM_PROMPT = `You are the shopping assistant for "Sales Shop", a small online store selling men's clothing, women's clothing, jewelery, electronics, kids products and toys for all ages (kids, teens, adults, seniors).
Rules:
- For ANY product question, call search_products (you may call it multiple times to refine). This is RAG: your ONLY source of truth is the tool output. Never invent products, prices or availability — only mention returned items, and if the tool returns nothing, say we don't carry that and suggest an alternative.
- Keep replies short and helpful: 1-2 sentences plus the key facts (name, price, category). The product cards are shown separately, so don't dump long lists.
- If no products match, say so briefly and suggest an alternative (wider price range, different category or keyword).
- For greetings or capability questions, answer directly without calling the tool.`;

interface LlmMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string | null;
  tool_calls?: {
    id: string;
    type: "function";
    function: { name: string; arguments: string };
  }[];
  tool_call_id?: string;
}

interface ToolArgs {
  search?: string;
  category?: string;
  ageGroup?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}

async function chatCompletion(cfg: LlmConfig, messages: LlmMessage[]): Promise<LlmMessage> {
  const res = await fetch(`${cfg.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.apiKey}`,
      ...(process.env.LLM_SITE_URL ? { "HTTP-Referer": process.env.LLM_SITE_URL } : {}),
    },
    body: JSON.stringify({
      model: cfg.model,
      messages,
      tools: [SEARCH_TOOL],
      tool_choice: "auto",
      temperature: 0.3,
      max_tokens: 500,
    }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`LLM request failed (${res.status}): ${text.slice(0, 200)}`);
  }
  const data = await res.json();
  const msg = data?.choices?.[0]?.message as LlmMessage | undefined;
  if (!msg) throw new Error("LLM returned no message");
  return msg;
}

export interface HistoryTurn {
  role: "user" | "assistant";
  content: string;
}

export interface AgentResult {
  reply: string;
  products: Product[];
  sources: Source[];
  /** "vector" | "keyword" | null (null = answered without retrieval). */
  retrieval: "vector" | "keyword" | null;
}

/** Agentic loop: model may call search_products up to maxRounds, then answers. */
export async function agenticChat(
  message: string,
  history: HistoryTurn[] = [],
  maxRounds = 2
): Promise<AgentResult> {
  const cfg = getLlmConfig();
  if (!cfg) throw new Error("LLM is not configured");

  const messages: LlmMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.slice(-8).map((t): LlmMessage => ({ role: t.role, content: t.content })),
    { role: "user", content: message },
  ];

  const found: { product: Product; score: number | null }[] = [];
  let retrieval: "vector" | "keyword" | null = null;

  const finish = (reply: string): AgentResult => {
    const docs = found.slice(0, 6);
    return {
      reply,
      products: toProducts(docs),
      sources: toSources(docs),
      retrieval,
    };
  };

  for (let round = 0; round < maxRounds; round++) {
    const msg = await chatCompletion(cfg, messages);
    messages.push({
      role: "assistant",
      content: msg.content,
      ...(msg.tool_calls ? { tool_calls: msg.tool_calls } : {}),
    });

    const calls = msg.tool_calls?.filter((c) => c.function?.name === "search_products") ?? [];
    if (calls.length === 0) {
      return finish(
        msg.content?.trim() || "I couldn't come up with an answer — try rephrasing."
      );
    }

    for (const call of calls) {
      let args: ToolArgs = {};
      try {
        args = JSON.parse(call.function.arguments || "{}") as ToolArgs;
      } catch {
        args = {};
      }
      // RAG retrieval: vector-first, keyword fallback — with similarity scores.
      const { docs, via } = await retrieve(
        {
          search: args.search,
          category: args.category,
          ageGroup: args.ageGroup,
          minPrice: args.minPrice,
          maxPrice: args.maxPrice,
          limit: Math.min(args.limit ?? 6, 10),
        },
        Math.min(args.limit ?? 6, 10)
      );
      retrieval = retrieval ?? via;
      for (const d of docs) {
        if (!found.some((f) => f.product.id === d.product.id)) found.push(d);
      }
      messages.push({
        role: "tool",
        tool_call_id: call.id,
        content: JSON.stringify(
          docs.map(({ product: p, score }) => ({
            id: p.id,
            title: p.title,
            price: p.price,
            category: p.category,
            ageGroup: p.ageGroup,
            rating: p.rating.rate,
            ...(score !== null ? { similarity: score } : {}),
          }))
        ),
      });
    }
  }

  // Max rounds reached: answer from gathered evidence.
  const closing = await chatCompletion(cfg, [
    ...messages,
    {
      role: "user",
      content:
        "Summarize the tool results for the shopper in 1-2 sentences. Only mention returned products.",
    },
  ]);
  return finish(
    closing.content?.trim() || `I found ${found.length} product(s) for you.`
  );
}
