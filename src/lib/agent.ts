/**
 * LangChain agent for the shop assistant.
 * - Model: ChatGroq (open-source models, same LLM_* env as before).
 * - Tools: search_products → RAG retrieve() (vector-first, keyword fallback).
 * - Contract matches the old hand-rolled loop: { reply, products, sources, retrieval }.
 */
import { z } from "zod";
import { ChatGroq } from "@langchain/groq";
import { createAgent, tool } from "langchain";
import { AIMessage, HumanMessage, isToolMessage } from "@langchain/core/messages";
import { retrieve, toProducts, toSources, type Source } from "./rag";
import { ProductSchema } from "./schemas";
import { getLlmConfig, type HistoryTurn } from "./llm";
import type { Product } from "@/types";

const SearchInputSchema = z.object({
  search: z.string().optional().describe("Keyword search over titles/descriptions"),
  category: z
    .enum(["men's clothing", "women's clothing", "jewelery", "electronics", "kids", "toys"])
    .optional()
    .describe("Filter by category"),
  ageGroup: z
    .enum(["kids", "teens", "adults", "seniors"])
    .optional()
    .describe("Filter by age group"),
  minPrice: z.number().optional().describe("Minimum price in USD"),
  maxPrice: z.number().optional().describe("Maximum price in USD"),
  limit: z.number().optional().describe("Max results (default 6, max 10)"),
});

const SYSTEM_PROMPT = `You are a warm, polite human shopkeeper at "Sales Shop" (men's clothing, women's clothing, jewelery, electronics, kids products and toys for kids, teens, adults and seniors). Address the shopper as "sir". Think like a shopkeeper: when they say "jacket for my dad", understand dad means an adult man and look for men's jackets.
Categories are product types; ageGroup is who it's for. When a query names an age ("kids", "teens", "seniors"), set ageGroup — use category "kids" only for kids' clothing, and "toys" for playthings. Prefer broader filters first; narrow down only if too many results.
Rules:
- For ANY product question, call search_products (you may call it multiple times). This is RAG: your ONLY source of truth is tool output. Never invent products, prices or availability.
- If the tools return nothing, apologize warmly like a shopkeeper ("Sorry sir, ...") and suggest an alternative — a different keyword, wider price, or another category. Never show or mention unrelated items as if they matched.
- Keep replies short and warm: 1-2 sentences plus the key facts (name, price, category). The product cards are shown separately, so don't dump long lists.
- Greetings/capability questions: answer directly, no tool call.`;

const searchProductsTool = tool(
  async (input: z.infer<typeof SearchInputSchema>): Promise<string> => {
    const limit = Math.min(input.limit ?? 6, 10);
    const { docs } = await retrieve(
      {
        search: input.search,
        category: input.category,
        ageGroup: input.ageGroup,
        minPrice: input.minPrice,
        maxPrice: input.maxPrice,
        limit,
      },
      limit
    );
    return JSON.stringify(
      docs.map(({ product: p, score }) => ({
        id: p.id,
        title: p.title,
        price: p.price,
        description: p.description,
        category: p.category,
        ageGroup: p.ageGroup,
        image: p.image,
        rating: { rate: p.rating.rate, count: p.rating.count },
        ...(score !== null ? { similarity: score } : {}),
      }))
    );
  },
  {
    name: "search_products",
    description:
      "Search the shop product catalog. Use for any product request: search, browse, recommendations, gifts, price or category questions.",
    schema: SearchInputSchema,
  }
);

// Tool outputs are validated back into products (never trust raw JSON).
const ToolOutputSchema = z.array(
  ProductSchema.extend({ similarity: z.number().optional() })
);

export interface LangChainAgentResult {
  reply: string;
  products: Product[];
  sources: Source[];
  retrieval: "vector" | "keyword" | null;
}

export async function runLangChainAgent(
  message: string,
  history: HistoryTurn[] = []
): Promise<LangChainAgentResult> {
  const cfg = getLlmConfig();
  if (!cfg) throw new Error("LLM is not configured");

  const llm = new ChatGroq({
    apiKey: cfg.apiKey,
    model: cfg.model,
    temperature: 0.3,
    maxTokens: 500,
  });

  const agent = createAgent({
    model: llm,
    tools: [searchProductsTool],
    systemPrompt: SYSTEM_PROMPT,
  });

  const chatHistory = history
    .slice(-8)
    .map((t) =>
      t.role === "user" ? new HumanMessage(t.content) : new AIMessage(t.content)
    );

  const result = await agent.invoke(
    { messages: [...chatHistory, new HumanMessage(message)] },
    { recursionLimit: 10 }
  );

  // Rebuild grounded products/sources from validated tool observations.
  const seen = new Map<number, { product: Product; score: number | null }>();
  let retrieval: "vector" | "keyword" | null = null;
  const toolText = (content: unknown): string => {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
      return content
        .map((b) =>
          typeof b === "string"
            ? b
            : typeof b === "object" && b !== null && "text" in b && typeof b.text === "string"
              ? b.text
              : ""
        )
        .join(" ");
    }
    return "";
  };
  for (const m of result.messages ?? []) {
    if (!isToolMessage(m)) continue;
    const obs = toolText(m.content);
    let raw: unknown = [];
    try {
      raw = JSON.parse(obs || "[]") as unknown;
    } catch {
      continue;
    }
    const parsed = ToolOutputSchema.safeParse(raw);
    if (!parsed.success) continue;
    if (retrieval === null && parsed.data.length > 0) {
      retrieval = parsed.data[0]?.similarity !== undefined ? "vector" : "keyword";
    }
    for (const item of parsed.data) {
      if (!seen.has(item.id)) {
        const { similarity: _sim, ...product } = item;
        seen.set(item.id, {
          product,
          score: item.similarity ?? null,
        });
      }
    }
  }

  const docs = [...seen.values()].slice(0, 6);
  const last = [...(result.messages ?? [])].reverse().find((m) => m._getType() === "ai");
  const text =
    last && typeof last.content === "string" ? last.content.trim() : "";
  const reply =
    text.length > 0 ? text : "I couldn't come up with an answer — try rephrasing.";

  return {
    reply,
    products: toProducts(docs),
    sources: toSources(docs),
    retrieval,
  };
}
