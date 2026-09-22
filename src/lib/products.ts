import { Prisma, type Product as PrismaProduct } from "@prisma/client";
import { readFileSync } from "fs";
import { join } from "path";
import { getDb } from "./db";
import { embedTexts } from "./embeddings";
import type { Product } from "@/types";

export function toAppProduct(p: PrismaProduct & { ageGroup: string }): Product {
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    image: p.image,
    ageGroup: (p.ageGroup ?? "all") as Product["ageGroup"],
    rating: { rate: p.ratingRate, count: p.ratingCount },
  };
}

interface SnapshotItem {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  ageGroup?: string;
  ratingRate: number;
  ratingCount: number;
}

let snapshotCache: Product[] | null = null;

/** Local snapshot fallback — used when DATABASE_URL is not set. No network. */
function readSnapshot(): Product[] {
  if (!snapshotCache) {
    const file = join(process.cwd(), "prisma", "catalog.snapshot.json");
    const items = JSON.parse(readFileSync(file, "utf-8")) as SnapshotItem[];
    snapshotCache = items.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      description: p.description,
      category: p.category,
      image: p.image,
      ageGroup: (p.ageGroup ?? "all") as Product["ageGroup"],
      rating: { rate: p.ratingRate, count: p.ratingCount },
    }));
  }
  return snapshotCache;
}

function matches(p: Product, q: ProductQuery): boolean {
  if (q.category && p.category !== q.category) return false;
  if (q.ageGroup && p.ageGroup !== q.ageGroup && p.ageGroup !== "all") return false;
  if (q.minPrice !== undefined && p.price < q.minPrice) return false;
  if (q.maxPrice !== undefined && p.price > q.maxPrice) return false;
  if (q.search) {
    const s = q.search.toLowerCase();
    if (
      !p.title.toLowerCase().includes(s) &&
      !p.description.toLowerCase().includes(s)
    )
      return false;
  }
  return true;
}

export interface ProductQuery {
  search?: string;
  category?: string;
  ageGroup?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  /** Use vector search when available (default true). Falls back to keywords. */
  semantic?: boolean;
}

interface SemanticRow {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image: string;
  ageGroup: string | null;
  ratingRate: number;
  ratingCount: number;
  distance: number;
}

/**
 * Vector similarity search (pgvector cosine distance) combined with
 * category/price filters. Returns null when unavailable so callers
 * fall back to keyword search.
 */
export interface ScoredProduct {
  product: Product;
  /** Cosine similarity 0–1 (1 = identical). Null when not vector-ranked. */
  score: number | null;
}

export async function semanticSearchWithScores(
  q: ProductQuery,
  limit: number
): Promise<ScoredProduct[] | null> {
  const db = getDb();
  if (!db || !q.search) return null;
  const vectors = await embedTexts([q.search]);
  if (!vectors) return null;
  const vec = `[${vectors[0].join(",")}]`;
  try {
    const conditions: Prisma.Sql[] = [Prisma.sql`embedding IS NOT NULL`];
    if (q.category) conditions.push(Prisma.sql`category = ${q.category}`);
    if (q.ageGroup) conditions.push(Prisma.sql`"ageGroup" = ${q.ageGroup}`);
    if (q.minPrice !== undefined) conditions.push(Prisma.sql`price >= ${q.minPrice}`);
    if (q.maxPrice !== undefined) conditions.push(Prisma.sql`price <= ${q.maxPrice}`);
    const rows = await db.$queryRaw<SemanticRow[]>`
      SELECT id, title, description, price, category, image,
             "ageGroup", "ratingRate", "ratingCount",
             embedding <=> CAST(${vec} AS vector) AS distance
      FROM "Product"
      WHERE ${Prisma.join(conditions, " AND ")}
      ORDER BY distance ASC
      LIMIT ${limit}
    `;
    return rows.map((r) => ({
      product: {
        id: r.id,
        title: r.title,
        price: r.price,
        description: r.description,
        category: r.category,
        image: r.image,
        ageGroup: (r.ageGroup ?? "all") as Product["ageGroup"],
        rating: { rate: r.ratingRate, count: r.ratingCount },
      },
      score: Math.round((1 / (1 + r.distance)) * 1000) / 1000,
    }));
  } catch (error) {
    console.error("Vector search failed, falling back to keywords:", error);
    return null;
  }
}

export async function semanticSearch(
  q: ProductQuery,
  limit: number
): Promise<Product[] | null> {
  const ranked = await semanticSearchWithScores(q, limit);
  return ranked ? ranked.map((r) => r.product) : null;
}

/**
 * Catalog source: Postgres when DATABASE_URL is set,
 * otherwise the local snapshot file (prisma/catalog.snapshot.json).
 * Never calls any external API.
 */
export async function queryProducts(q: ProductQuery = {}): Promise<Product[]> {
  // Semantic first (meaning-aware), keywords as fallback.
  if (q.semantic !== false && q.search) {
    const ranked = await semanticSearch(q, q.limit ?? 50);
    if (ranked) return ranked;
  }
  const db = getDb();
  if (!db) {
    return readSnapshot()
      .filter((p) => matches(p, q))
      .sort((a, b) => b.rating.rate - a.rating.rate)
      .slice(0, q.limit ?? 50);
  }
  const products = await db.product.findMany({
    where: {
      ...(q.category ? { category: q.category } : {}),
      ...(q.ageGroup ? { ageGroup: q.ageGroup } : {}),
      ...(q.minPrice !== undefined || q.maxPrice !== undefined
        ? { price: { gte: q.minPrice, lte: q.maxPrice } }
        : {}),
      ...(q.search
        ? {
            OR: [
              { title: { contains: q.search, mode: "insensitive" } },
              { description: { contains: q.search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { ratingRate: "desc" },
    take: q.limit ?? 50,
  });
  return products.map(toAppProduct);
}

export async function getProductById(id: number): Promise<Product | null> {
  const db = getDb();
  if (!db) return readSnapshot().find((p) => p.id === id) ?? null;
  const p = await db.product.findUnique({ where: { id } });
  return p ? toAppProduct(p) : null;
}

export async function getCategories(): Promise<string[]> {
  const db = getDb();
  if (!db) return [...new Set(readSnapshot().map((p) => p.category))];
  const rows = await db.product.findMany({
    select: { category: true },
    distinct: ["category"],
  });
  return rows.map((r) => r.category);
}

export function activeSource(): "db" | "snapshot" {
  return getDb() ? "db" : "snapshot";
}
