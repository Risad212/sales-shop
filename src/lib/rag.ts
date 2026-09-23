/**
 * RAG layer: retrieve catalog documents, then generate answers grounded
 * ONLY on retrieved docs.
 *
 * Pipeline: query → retrieve() → LLM → reply + sources.
 * Local keyword retrieval; swap in a vector index later without
 * changing callers (ScoredProduct already carries scores).
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

/** Retrieve candidate products for a query + filters.
 * Relaxation chain: full query → drop search text → drop age group.
 * Relaxation only applies while filters anchor relevance (category, age or
 * price) — a pure nonsense query returns [] so the assistant can apologize
 * instead of dumping random products. */
export async function retrieve(
  q: ProductQuery,
  limit: number
): Promise<Retrieval> {
  if (q.search) {
    const ranked = await semanticSearchWithScores(q, limit);
    if (ranked && ranked.length > 0) return { docs: ranked.slice(0, limit), via: "keyword" };
  }
  const anchored = q.category !== undefined || q.ageGroup !== undefined ||
    q.minPrice !== undefined || q.maxPrice !== undefined;
  const attempts: ProductQuery[] = [{ ...q }];
  if (anchored) {
    attempts.push({ ...q, search: undefined });
    if (q.category) {
      attempts.push({
        category: q.category,
        ageGroup: undefined,
        minPrice: q.minPrice,
        maxPrice: q.maxPrice,
      });
    }
  }
  for (const attempt of attempts) {
    const products = await queryProducts({ ...attempt, limit });
    if (products.length > 0) {
      return {
        docs: products.map((product) => ({ product, score: null })),
        via: "keyword",
      };
    }
  }
  return { docs: [], via: "keyword" };
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
