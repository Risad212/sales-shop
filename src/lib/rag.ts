/**
 * RAG layer: retrieve catalog documents (vector-first, keyword fallback),
 * then generate answers grounded ONLY on retrieved docs.
 *
 * Pipeline: query → retrieve() → buildContext() → LLM → reply + sources.
 * Without DB/embeddings/LLM key, each stage degrades gracefully:
 * vector → keyword → snapshot → mock reply. Chat never 500s.
 */
import {
  queryProducts,
  semanticSearchWithScores,
  type ProductQuery,
  type ScoredProduct,
} from "./products";

export interface Source {
  id: number;
  title: string;
  price: number;
  score: number | null;
}

export interface Retrieval {
  docs: ScoredProduct[];
  /** "vector" | "keyword" — which retriever produced the docs. */
  via: "vector" | "keyword";
}

/** Retrieve candidate products for a query + filters. */
export async function retrieve(
  q: ProductQuery,
  limit: number
): Promise<Retrieval> {
  if (q.semantic !== false && q.search) {
    const ranked = await semanticSearchWithScores(q, limit);
    if (ranked && ranked.length > 0) {
      return { docs: ranked.slice(0, limit), via: "vector" };
    }
  }
  const products = await queryProducts({ ...q, semantic: false, limit });
  return {
    docs: products.map((product) => ({ product, score: null })),
    via: "keyword",
  };
}

/** Render retrieved docs as numbered context for the generating LLM. */
export function buildContext(docs: ScoredProduct[]): string {
  if (docs.length === 0) return "(no catalog items matched)";
  return docs
    .map(({ product: p, score }, i) => {
      const sim = score !== null ? ` [similarity ${score}]` : "";
      return `[${i + 1}] ${p.title} — $${p.price}, ${p.category}, age group: ${p.ageGroup}, rated ${p.rating.rate}/5${sim}\n${p.description}`;
    })
    .join("\n\n");
}

export function toSources(docs: ScoredProduct[]): Source[] {
  return docs.map(({ product: p, score }) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    score,
  }));
}

export function toProducts(docs: ScoredProduct[]) {
  return docs.map((d) => d.product);
}
