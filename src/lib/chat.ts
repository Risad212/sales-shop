/**
 * Mock shopping-assistant brain (rule-based parser).
 * Phase 2: replace `parseMessage` internals with an LLM tool-call
 * (same input/output contract) — API route and UI stay unchanged.
 */

export type ChatIntent = "greet" | "search" | "recommend" | "help";

export interface ChatFilters {
  search?: string;
  category?: string;
  ageGroup?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}

export interface ParsedQuery {
  intent: ChatIntent;
  filters: ChatFilters;
}

const CATEGORIES = ["men's clothing", "women's clothing", "jewelery", "electronics", "kids", "toys"] as const;

const AGE_ALIASES: Record<string, string> = {
  kids: "kids",
  kid: "kids",
  children: "kids",
  child: "kids",
  baby: "kids",
  babies: "kids",
  toddler: "kids",
  toddlers: "kids",
  teens: "teens",
  teen: "teens",
  teenager: "teens",
  teenagers: "teens",
  youth: "teens",
  adults: "adults",
  adult: "adults",
  grown: "adults",
  "grown-up": "adults",
  seniors: "seniors",
  senior: "seniors",
  elderly: "seniors",
};

const CATEGORY_ALIASES: Record<string, string> = {
  men: "men's clothing",
  mens: "men's clothing",
  man: "men's clothing",
  "men's": "men's clothing",
  women: "women's clothing",
  womens: "women's clothing",
  woman: "women's clothing",
  "women's": "women's clothing",
  jewelery: "jewelery",
  jewellery: "jewelery",
  jewelry: "jewelery",
  electronics: "electronics",
  electronic: "electronics",
  tech: "electronics",
  gadget: "electronics",
  gadgets: "electronics",
  kids: "kids",
  toys: "toys",
  toy: "toys",
  games: "toys",
};

const STOPWORDS = new Set([
  "i", "me", "my", "we", "you", "your", "a", "an", "the", "and", "or", "for",
  "to", "of", "in", "on", "with", "show", "find", "search", "looking", "look",
  "want", "need", "get", "give", "buy", "please", "is", "are", "there", "any",
  "some", "something", "products", "product", "items", "item", "things", "stuff",
  "like", "just", "really", "very", "much", "many", "do", "does", "can", "could",
  // generic apparel words left over after category detection ("men's clothing")
  "clothing", "clothes", "apparel", "wear", "outfit", "outfits",
]);

function extractPrice(text: string, filters: ChatFilters): string {
  let rest = text;
  const money = (s: string) => Number(s.replace(/[$,]/g, ""));

  const between = rest.match(/between\s*\$?([\d,]+)\s*(?:and|to|-)\s*\$?([\d,]+)/);
  if (between) {
    filters.minPrice = money(between[1]);
    filters.maxPrice = money(between[2]);
    rest = rest.replace(between[0], " ");
  }
  const range = rest.match(/\$?([\d,]+)\s*-\s*\$?([\d,]+)/);
  if (range && filters.minPrice === undefined) {
    filters.minPrice = money(range[1]);
    filters.maxPrice = money(range[2]);
    rest = rest.replace(range[0], " ");
  }
  const under = rest.match(/(?:under|below|less than|max|up to|cheaper than)\s*\$?([\d,]+)/);
  if (under) {
    filters.maxPrice = money(under[1]);
    rest = rest.replace(under[0], " ");
  }
  const over = rest.match(/(?:over|above|more than|min|at least|starting at)\s*\$?([\d,]+)/);
  if (over) {
    filters.minPrice = money(over[1]);
    rest = rest.replace(over[0], " ");
  }
  if (/\bcheap\b|\bbudget\b|\baffordable\b/.test(rest)) {
    filters.maxPrice = Math.min(filters.maxPrice ?? Infinity, 70);
    rest = rest.replace(/\bcheap\b|\bbudget\b|\baffordable\b/g, " ");
  }
  if (/\bexpensive\b|\bpremium\b|\bluxury\b/.test(rest)) {
    filters.minPrice = Math.max(filters.minPrice ?? 0, 150);
    rest = rest.replace(/\bexpensive\b|\bpremium\b|\bluxury\b/g, " ");
  }
  return rest;
}

function extractCategory(text: string, filters: ChatFilters): string {
  let rest = text;
  const lower = ` ${text.toLowerCase()} `;
  for (const [alias, category] of Object.entries(CATEGORY_ALIASES)) {
    if (lower.includes(` ${alias} `) || lower.includes(` ${alias}'s `)) {
      filters.category = category;
      rest = rest.replace(new RegExp(`\\b${alias}('s)?\\b`, "gi"), " ");
      break;
    }
  }
  // direct full-name match ("men's clothing")
  for (const category of CATEGORIES) {
    if (rest.toLowerCase().includes(category)) {
      filters.category = category;
      rest = rest.replace(new RegExp(category.replace("'", "'?"), "gi"), " ");
      break;
    }
  }
  return rest;
}

export function parseMessage(message: string): ParsedQuery {
  const text = message.trim();
  const lower = text.toLowerCase();

  if (/^(hi|hii+|hello|hey|yo|good (morning|afternoon|evening)|salam)\b/.test(lower)) {
    return { intent: "greet", filters: {} };
  }
  if (/\bhelp\b|\bhow (do|can) (i|you)\b|\bwhat can you do\b/.test(lower)) {
    return { intent: "help", filters: {} };
  }

  const filters: ChatFilters = {};
  let rest = extractPrice(lower, filters);
  rest = extractCategory(rest, filters);
  rest = extractAge(rest, filters);

  const recommend = /\b(recommend|recommendation|suggest|suggestion|suggests|gift|gifts|best|top|popular|rated|rating|favourite|favorite|trending|ideas?)\b/.test(rest);
  rest = rest.replace(/\b(recommend|recommendation|suggest|suggestion|suggests|gift|gifts|best|top|popular|rated|rating|favourite|favorite|trending|ideas?)\b/gi, " ");

  const terms = rest
    .replace(/[$.,!?;:()"]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
  if (terms.length > 0) filters.search = terms.join(" ");

  if (recommend) {
    return { intent: "recommend", filters: { ...filters, limit: 4 } };
  }
  return {
    intent: "search",
    filters: { ...filters, limit: filters.limit ?? 6 },
  };
}

function extractAge(text: string, filters: ChatFilters): string {
  let rest = text;
  const lower = ` ${text.toLowerCase()} `;
  for (const [alias, age] of Object.entries(AGE_ALIASES)) {
    if (lower.includes(` ${alias} `)) {
      filters.ageGroup = age;
      rest = rest.replace(new RegExp(`\\b${alias}\\b`, "gi"), " ");
      break;
    }
  }
  return rest;
}

export function describeFilters(filters: ChatFilters): string {
  const parts: string[] = [];
  if (filters.category) parts.push(`in ${filters.category}`);
  if (filters.ageGroup) parts.push(`for ${filters.ageGroup}`);
  if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
    parts.push(`between $${filters.minPrice} and $${filters.maxPrice}`);
  } else if (filters.maxPrice !== undefined) {
    parts.push(`under $${filters.maxPrice}`);
  } else if (filters.minPrice !== undefined) {
    parts.push(`over $${filters.minPrice}`);
  }
  if (filters.search) parts.push(`matching "${filters.search}"`);
  return parts.join(" ");
}
