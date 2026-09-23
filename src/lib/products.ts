import { readFileSync } from "fs";
import { join } from "path";
import { SnapshotSchema, parseAgeGroup } from "./schemas";
import type { Product } from "@/types";

let catalogCache: Product[] | null = null;

/** Local catalog (src/data/catalog.json) — the only data source. No network, no DB. */
function readCatalog(): Product[] {
  if (!catalogCache) {
    const file = join(process.cwd(), "src", "data", "catalog.json");
    const raw: unknown = JSON.parse(readFileSync(file, "utf-8"));
    const items = SnapshotSchema.parse(raw);
    catalogCache = items.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      description: p.description,
      category: p.category,
      image: p.image,
      ageGroup: parseAgeGroup(p.ageGroup),
      rating: { rate: p.ratingRate, count: p.ratingCount },
    }));
  }
  return catalogCache;
}

/** Naive singularizer so "jackets"/"games" match "jacket"/"game". */
function singular(word: string): string {
  return word.length > 3 && word.endsWith("s") && !word.endsWith("ss")
    ? word.slice(0, -1)
    : word;
}

export function searchTokens(search: string): string[] {
  return search
    .toLowerCase()
    .split(/\s+/)
    .map((w) => singular(w.trim()))
    .filter((w) => w.length > 1);
}

export interface ProductQuery {
  search?: string;
  category?: string;
  ageGroup?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}

export interface ScoredProduct {
  product: Product;
  /** Always null locally (no vector index) — kept for the RAG contract. */
  score: number | null;
}

function matches(p: Product, q: ProductQuery): boolean {
  if (q.category && p.category !== q.category) return false;
  if (q.ageGroup && p.ageGroup !== q.ageGroup && p.ageGroup !== "all") return false;
  if (q.minPrice !== undefined && p.price < q.minPrice) return false;
  if (q.maxPrice !== undefined && p.price > q.maxPrice) return false;
  if (q.search) {
    const hay = `${p.title} ${p.description} ${p.category} ${p.ageGroup}`.toLowerCase();
    if (!searchTokens(q.search).every((t) => hay.includes(t))) return false;
  }
  return true;
}

const byRating = (a: Product, b: Product) => b.rating.rate - a.rating.rate;

/** Keyword search over the local catalog, top-rated first. */
export async function queryProducts(q: ProductQuery = {}): Promise<Product[]> {
  return readCatalog()
    .filter((p) => matches(p, q))
    .sort(byRating)
    .slice(0, q.limit ?? 50);
}

/** Local stand-in for vector search: same keyword matching, unscored. */
export async function semanticSearchWithScores(
  q: ProductQuery,
  limit: number
): Promise<ScoredProduct[] | null> {
  if (!q.search) return null;
  const products = await queryProducts({ ...q, limit });
  return products.map((product) => ({ product, score: null }));
}

export async function semanticSearch(
  q: ProductQuery,
  limit: number
): Promise<Product[] | null> {
  const ranked = await semanticSearchWithScores(q, limit);
  return ranked ? ranked.map((r) => r.product) : null;
}

/**
 * "You may also like": same category first (excluding self), topped up
 * with top-rated items from other categories when short.
 */
export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const sameCategory = (
    await queryProducts({ category: product.category, limit: limit + 1 })
  ).filter((p) => p.id !== product.id);
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const topRated = (await queryProducts({ limit: 20 })).filter(
    (p) => p.id !== product.id && p.category !== product.category
  );
  return [...sameCategory, ...topRated].slice(0, limit);
}

export async function getProductById(id: number): Promise<Product | null> {
  return readCatalog().find((p) => p.id === id) ?? null;
}

export async function getCategories(): Promise<string[]> {
  return [...new Set(readCatalog().map((p) => p.category))];
}

export function activeSource(): "local" {
  return "local";
}
