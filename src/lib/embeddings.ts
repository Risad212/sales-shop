/**
 * Embedding provider — OpenAI-compatible `/embeddings` endpoint.
 * Works with open-source embedding models served by:
 *   - Ollama (local):      base http://localhost:11434/v1, model bge-m3 (1024-dim)
 *   - OpenRouter (cloud):  base https://openrouter.ai/api/v1, model e.g. qwen/qwen3-embedding-8b
 *   - vLLM / TEI / HF Inference serving BAAI/bge-m3 (1024-dim)
 *
 * The schema's vector(1024) column must match the model's dimensions.
 * Returns null when not configured — callers fall back to keyword search.
 */
import { EmbeddingsResponseSchema } from "./schemas";

export const EMBEDDING_DIMS = 1024;

export interface EmbeddingConfig {
  baseUrl: string;
  model: string;
  apiKey?: string;
}

export function getEmbeddingConfig(): EmbeddingConfig | null {
  if (process.env.EMBEDDING_DISABLED === "1") return null;
  const baseUrl = (
    process.env.EMBEDDING_BASE_URL ?? "http://localhost:11434/v1"
  ).replace(/\/$/, "");
  const model = process.env.EMBEDDING_MODEL ?? "bge-m3";
  // Local Ollama needs no key; cloud providers do.
  const apiKey = process.env.EMBEDDING_API_KEY || undefined;
  const isLocalhost =
    baseUrl.includes("localhost") || baseUrl.includes("127.0.0.1");
  if (!apiKey && !isLocalhost) return null;
  return { baseUrl, model, apiKey };
}

/** Text that represents a product in vector space. */
export function productEmbeddingText(p: {
  title: string;
  description: string;
  category: string;
  price: number;
  ageGroup?: string;
}): string {
  const age = p.ageGroup && p.ageGroup !== "all" ? ` Age group: ${p.ageGroup}.` : "";
  return `${p.title}. ${p.description} Category: ${p.category}.${age} Price: $${p.price}.`;
}

/** Embed one or more texts. Returns null when unconfigured or on error. */
export async function embedTexts(texts: string[]): Promise<number[][] | null> {
  const cfg = getEmbeddingConfig();
  if (!cfg || texts.length === 0) return null;
  try {
    const res = await fetch(`${cfg.baseUrl}/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}),
      },
      body: JSON.stringify({ model: cfg.model, input: texts }),
    });
    if (!res.ok) {
      console.error(`Embeddings request failed (${res.status})`);
      return null;
    }
    const data: unknown = await res.json();
    const parsed = EmbeddingsResponseSchema.safeParse(data);
    if (!parsed.success) {
      console.error("Embeddings response failed validation");
      return null;
    }
    const vectors = parsed.data.data.map((d) => d.embedding);
    const first = vectors[0];
    if (vectors.length !== texts.length || !first || first.length !== EMBEDDING_DIMS) {
      console.error(
        `Embedding dims mismatch: got ${first?.length}, schema expects ${EMBEDDING_DIMS}`
      );
      return null;
    }
    return vectors;
  } catch (error) {
    console.error("Embeddings request errored:", error);
    return null;
  }
}
