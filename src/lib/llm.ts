/**
 * Shared LLM config + chat types.
 * The agent itself lives in ./agent.ts (LangChain: ChatGroq + RAG tools).
 * Works with any OpenAI-compatible cloud provider serving open models:
 *   - Groq (free tier):  base https://api.groq.com/openai/v1, model openai/gpt-oss-20b
 *   - OpenRouter:        base https://openrouter.ai/api/v1, model e.g. meta-llama/llama-3.1-8b-instruct
 */
import type { Source } from "./rag";
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
