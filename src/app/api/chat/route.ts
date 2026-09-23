import { NextResponse } from "next/server";
import { z } from "zod";
import { parseMessage, describeFilters } from "@/lib/chat";
import { runLangChainAgent } from "@/lib/agent";
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
  "Hello sir, how may I help you? Tell me who you're shopping for — e.g. \"I need a jacket for my dad\", \"a gift for my daughter\", or \"cheap electronics\".";
const HELP =
  "Just tell me in your own words, sir — who it's for and what you need. I know our categories (men, women, jewelery, electronics, kids, toys), ages (kids, teens, adults, seniors) and prices (“under $50”). Try “suggest top rated” for picks.";

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
      reply: `Sorry sir, we don't have anything ${where || "like that"} in the shop right now, neither exact nor close. If you tell me a different keyword, a wider price range, or another category, I'll gladly look again.`,
      products: [],
      sources: [],
      interpreted: parsed,
      engine: "mock",
      retrieval: via,
    });
  }

  const lead =
    parsed.intent === "recommend"
      ? `Certainly sir — here are my top picks ${where || "for you"}:`
      : `Yes sir, I found ${docs.length} product${docs.length > 1 ? "s" : ""} ${where}:`;

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

    // Agentic RAG path: LangChain (ChatGroq + search_products tool).
    if (process.env.LLM_API_KEY) {
      try {
        const result = await runLangChainAgent(body.message, body.history ?? []);
        return NextResponse.json({ ...result, engine: "llm-langchain" });
      } catch (llmError) {
        console.error("LangChain agent failed, falling back to mock parser:", llmError);
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
