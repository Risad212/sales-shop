/**
 * Append 20 more realistic products with real Wikimedia photos.
 * Run: npx tsx scripts/add-more-products.ts
 */
import { readFileSync, writeFileSync } from "fs";

const SNAPSHOT = "src/data/catalog.json";

interface NewProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  ageGroup: string;
  ratingRate: number;
  ratingCount: number;
  queries: string[];
}

const NEW: NewProduct[] = [
  { id: 39, title: "Men's Slim-Fit Denim Jeans", price: 49.99, description: "Classic slim-fit stretch denim jeans with modern wash. Everyday adult essential.", category: "men's clothing", ageGroup: "adults", ratingRate: 4.4, ratingCount: 187, queries: ["blue jeans", "denim jeans", "jeans"] },
  { id: 40, title: "Men's Leather Belt", price: 24.99, description: "Full-grain leather belt with brushed buckle. Fits waist 30-40 inches.", category: "men's clothing", ageGroup: "adults", ratingRate: 4.5, ratingCount: 96, queries: ["leather belt", "belt"] },
  { id: 41, title: "Men's Cotton Polo Shirt", price: 29.99, description: "Breathable pique polo shirt with ribbed collar. Smart casual staple.", category: "men's clothing", ageGroup: "adults", ratingRate: 4.3, ratingCount: 142, queries: ["polo shirt"] },
  { id: 42, title: "Men's Running Shoes", price: 69.99, description: "Lightweight running shoes with cushioned sole and breathable mesh upper.", category: "men's clothing", ageGroup: "adults", ratingRate: 4.6, ratingCount: 318, queries: ["running", "jogging", "athletic shoes"] },
  { id: 43, title: "Women's Summer Floral Dress", price: 42.99, description: "Breezy floral midi dress with elastic waist. Perfect for sunny days.", category: "women's clothing", ageGroup: "adults", ratingRate: 4.5, ratingCount: 203, queries: ["summer dress", "floral dress"] },
  { id: 44, title: "Women's Aviator Sunglasses", price: 34.99, description: "Classic aviator sunglasses with UV400 lenses and gold-tone frame.", category: "women's clothing", ageGroup: "adults", ratingRate: 4.4, ratingCount: 178, queries: ["sunglasses", "aviator"] },
  { id: 45, title: "Women's Knit Sweater", price: 38.99, description: "Cozy cable-knit sweater in soft acrylic wool blend. Winter favorite.", category: "women's clothing", ageGroup: "adults", ratingRate: 4.6, ratingCount: 129, queries: ["sweater", "wool sweater", "knitwear"] },
  { id: 46, title: "Women's Canvas Tote Bag", price: 22.99, description: "Sturdy everyday canvas tote with inner pocket. Carries laptop and more.", category: "women's clothing", ageGroup: "teens", ratingRate: 4.3, ratingCount: 87, queries: ["shopping bag", "grocery bag", "canvas bag"] },
  { id: 47, title: "Gold-Plated Pendant Necklace", price: 59.99, description: "Elegant 18k gold-plated pendant necklace with 45cm chain. Gift box included.", category: "jewelery", ageGroup: "adults", ratingRate: 4.7, ratingCount: 214, queries: ["gold chain necklace", "locket necklace", "chain necklace"] },
  { id: 48, title: "Silver Charm Bracelet", price: 39.99, description: "Sterling silver charm bracelet with lobster clasp. Timeless gift.", category: "jewelery", ageGroup: "teens", ratingRate: 4.5, ratingCount: 133, queries: ["bangle", "silver bangle", "charm bracelet"] },
  { id: 49, title: "Classic Analog Wrist Watch", price: 79.99, description: "Minimalist analog watch with leather strap and quartz movement.", category: "jewelery", ageGroup: "adults", ratingRate: 4.6, ratingCount: 276, queries: ["wrist watch", "analog watch"] },
  { id: 50, title: "Over-Ear Studio Headphones", price: 89.99, description: "Studio over-ear headphones with deep bass and foldable design.", category: "electronics", ageGroup: "teens", ratingRate: 4.5, ratingCount: 341, queries: ["headphones"] },
  { id: 51, title: "10-inch Android Tablet", price: 149.99, description: "10-inch HD tablet with 64GB storage and 10-hour battery. Great for study and play.", category: "electronics", ageGroup: "teens", ratingRate: 4.3, ratingCount: 198, queries: ["ipad", "tablet computer"] },
  { id: 52, title: "Instant Digital Camera", price: 99.99, description: "Point-and-shoot digital camera with 4K video and selfie screen.", category: "electronics", ageGroup: "adults", ratingRate: 4.4, ratingCount: 167, queries: ["digital camera", "camera"] },
  { id: 53, title: "Wireless Mechanical Keyboard", price: 64.99, description: "Low-profile wireless keyboard with quiet keys and long battery life.", category: "electronics", ageGroup: "adults", ratingRate: 4.5, ratingCount: 224, queries: ["keyboard", "computer keyboard"] },
  { id: 54, title: "Kids Dinosaur T-Shirt", price: 14.99, description: "Fun glow-in-the-dark dinosaur tee in soft cotton. Kids love it.", category: "kids", ageGroup: "kids", ratingRate: 4.6, ratingCount: 158, queries: ["kids t-shirt", "child shirt"] },
  { id: 55, title: "Kids Story Book Collection", price: 19.99, description: "Set of 5 illustrated bedtime story books for ages 3-8.", category: "kids", ageGroup: "kids", ratingRate: 4.8, ratingCount: 302, queries: ["children book", "kids reading book", "picture book"] },
  { id: 56, title: "Kids Rain Boots", price: 26.99, description: "Waterproof kids rain boots with easy pull handles. Puddle-approved.", category: "kids", ageGroup: "kids", ratingRate: 4.5, ratingCount: 74, queries: ["rubber boots", "wellington boots", "rain"] },
  { id: 57, title: "3D Wooden Puzzle Set", price: 21.99, description: "Laser-cut 3D wooden puzzles, 4 models. Great teen desk challenge.", category: "toys", ageGroup: "teens", ratingRate: 4.4, ratingCount: 119, queries: ["jigsaw puzzle", "puzzle"] },
  { id: 58, title: "Kids Soccer Ball", price: 17.99, description: "Size 4 durable soccer ball for kids training and backyard games.", category: "toys", ageGroup: "kids", ratingRate: 4.6, ratingCount: 186, queries: ["soccer", "football ball", "soccer ball"] },
];

const API = "https://commons.wikimedia.org/w/api.php";
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function searchPhoto(query: string): Promise<{ title: string; url: string } | null> {
  const params = new URLSearchParams({
    action: "query", format: "json", generator: "search",
    gsrsearch: query, gsrnamespace: "6", gsrlimit: "6",
    prop: "imageinfo", iiprop: "url|size", iiurlwidth: "800", origin: "*",
  });
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`${API}?${params}`, {
      headers: { "User-Agent": "sales-shop/1.0 (catalog script)" },
    });
    if (res.ok) {
      const data = (await res.json()) as {
        query?: { pages?: Record<string, { title?: string; imageinfo?: { thumburl?: string; url?: string }[] }> };
      };
      for (const p of Object.values(data.query?.pages ?? {})) {
        const info = p.imageinfo?.[0];
        const url = info?.thumburl ?? info?.url;
        if (url && /\.(jpe?g|png|webp)(\?|$)/i.test(url)) return { title: p.title ?? query, url };
      }
      return null;
    }
    await sleep(1500 * (attempt + 1));
  }
  return null;
}

async function main(): Promise<void> {
  const items = JSON.parse(readFileSync(SNAPSHOT, "utf-8")) as Record<string, unknown>[];
  const existing = new Set(items.map((i) => i.id));
  for (const p of NEW) {
    if (existing.has(p.id)) {
      console.log(`skip ${p.id}`);
      continue;
    }
    let found = null as { title: string; url: string } | null;
    for (const q of p.queries) {
      found = await searchPhoto(q);
      await sleep(800);
      if (found) break;
    }
    if (!found) {
      console.log(`MISS id=${p.id}`);
      continue;
    }
    const ext = found.url.match(/\.(jpe?g|png|webp)(\?|$)/i)?.[1]?.toLowerCase() ?? "jpg";
    const target = `public/products/${p.id}.${ext === "jpeg" ? "jpg" : ext}`;
    const res = await fetch(found.url);
    if (!res.ok) {
      console.log(`DOWNLOAD FAIL id=${p.id}`);
      continue;
    }
    writeFileSync(target, Buffer.from(await res.arrayBuffer()));
    const { queries: _q, ...rest } = p;
    items.push({ ...rest, image: `/${target.replace(/^public\//, "")}` });
    console.log(`ok id=${p.id} <- ${found.title}`);
  }
  writeFileSync(SNAPSHOT, JSON.stringify(items, null, 2));
  console.log(`catalog now has ${items.length} products`);
}

main().catch((e: unknown) => {
  console.error(e instanceof Error ? e.message : String(e));
  process.exit(1);
});
