/**
 * One-time snapshot: pulls the FakeStore catalog + all images into the repo,
 * then the app never talks to fakestoreapi.com again.
 * Run: npx tsx scripts/snapshot-catalog.ts
 */
import { mkdirSync, writeFileSync } from "fs";

const OUT_IMG = "public/products";
const OUT_DATA = "prisma/catalog.snapshot.json";

async function download(url: string, path: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(path, buf);
  return buf.length;
}

async function main() {
  mkdirSync(OUT_IMG, { recursive: true });
  const res = await fetch("https://fakestoreapi.com/products");
  if (!res.ok) throw new Error(`catalog fetch failed: ${res.status}`);
  const items = (await res.json()) as {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;
    rating: { rate: number; count: number };
  }[];

  const catalog = [];
  for (const item of items) {
    const ext = item.image.match(/\.(png|jpe?g|webp|gif)(\?|$)/i)?.[1]?.toLowerCase() ?? "jpg";
    const local = `${OUT_IMG}/${item.id}.${ext === "jpeg" ? "jpg" : ext}`;
    const bytes = await download(item.image, local);
    console.log(`saved ${local} (${bytes} bytes)`);
    catalog.push({
      id: item.id,
      title: item.title,
      price: item.price,
      description: item.description,
      category: item.category,
      image: `/${local.replace(/^public\//, "")}`,
      ratingRate: item.rating?.rate ?? 0,
      ratingCount: item.rating?.count ?? 0,
    });
  }
  writeFileSync(OUT_DATA, JSON.stringify(catalog, null, 2));
  console.log(`wrote ${OUT_DATA} with ${catalog.length} products`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
