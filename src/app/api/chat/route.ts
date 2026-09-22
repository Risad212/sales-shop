import { NextResponse } from "next/server";
import { z } from "zod";
import { parseMessage, describeFilters } from "@/lib/chat";
import { agenticChat } from "@/lib/llm";
import { retrieve, toProducts, toSources } from "@/lib/rag";

const HistoryTurn = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(2000),
});

const ChatRequest = z.object({
  message: z.string().min(1).max(500),
  history: z.array(HistoryTurn).max(20).optional(),
});

const GREETING =
  "Hi! I'm your shopping assistant. Tell me what you're looking for — e.g. \"men's jacket under $60\", \"cheap electronics\", or \"recommend a gift\".";
const HELP =
  "I can search the catalog by keyword, category (men, women, jewelery, electronics, kids, toys), age group (kids, teens, adults, seniors) and price (“under $50”, “between $20 and $100”). Try “suggest top rated” for picks.";

async function mockReply(message: string) {
  const parsed = parseMessage(message);

  if (parsed.intent === "greet") {
    return NextResponse.json({
      reply: GREETING,
      products: [],
      sources: [],
      interpreted: parsed,
      engine: "mock",
      retrieval: null,
    });
  }
  if (parsed.intent === "help") {
    return NextResponse.json({
      reply: HELP,
      products: [],
      sources: [],
      interpreted: parsed,
      engine: "mock",
      retrieval: null,
    });
  }

  // RAG retrieval (vector when available, keyword fallback) — same evidence
  // layer the LLM path uses.
  const { docs, via } = await retrieve(parsed.filters, parsed.filters.limit ?? 6);
  const where = describeFilters(parsed.filters);

  if (docs.length === 0) {
    return NextResponse.json({
      reply: `I couldn't find anything ${where || "matching that"}. Try a different keyword, a wider price range, or another category.`,
      products: [],
      sources: [],
      interpreted: parsed,
      engine: "mock",
      retrieval: via,
    });
  }

  const lead =
    parsed.intent === "recommend"
      ? `Here are my top picks ${where || "for you"}:`
      : `Found ${docs.length} product${docs.length > 1 ? "s" : ""} ${where}:`;

  return NextResponse.json({
    reply: lead,
    products: toProducts(docs),
    sources: toSources(docs),
    interpreted: parsed,
    engine: "mock",
    retrieval: via,
  });
}

export async function POST(req: Request) {
  try {
    const body = ChatRequest.parse(await req.json());

    // Agentic RAG path: cloud-hosted open-source LLM grounded on retrieval.
    if (process.env.LLM_API_KEY) {
      try {
        const result = await agenticChat(body.message, body.history ?? []);
        return NextResponse.json({ ...result, engine: "llm" });
      } catch (llmError) {
        console.error("LLM agent failed, falling back to mock parser:", llmError);
      }
    }

    return await mockReply(body.message);
  } catch (error) {
    console.error("POST /api/chat failed:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid message" }, { status: 400 });
    }
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
