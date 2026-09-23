/**
 * Replace picsum placeholder photos with real topical photos from
 * Wikimedia Commons (API-friendly, hotlink-allowed, downloaded locally).
 * Updates prisma/catalog.snapshot.json image paths in place.
 * Run: npx tsx scripts/fetch-real-photos.ts
 */
import { readFileSync, writeFileSync } from "fs";

const SNAPSHOT = "prisma/catalog.snapshot.json";
const API = "https://commons.wikimedia.org/w/api.php";

// productId -> search queries (first hit wins)
const QUERIES: Record<number, string[]> = {
  21: ["denim jacket"],
  22: ["children t-shirt", "t-shirt"],
  23: ["sneakers", "children shoes"],
  24: ["school backpack", "backpack"],
  25: ["lego bricks", "building blocks"],
  26: ["remote control car", "rc car"],
  27: ["board game"],
  28: ["teddy bear"],
  29: ["hoodie"],
  30: ["leather purse", "shoulder bag photograph", "purse"],
  31: ["earbuds", "headphones", "earphones"],
  32: ["white sneakers", "running shoes", "sports shoes"],
  33: ["smartwatch", "apple watch"],
  34: ["satchel bag", "clutch bag", "leather purse"],
  35: ["reading glasses", "spectacles", "eyeglasses on table"],
  36: ["sphygmomanometer", "blood pressure"],
  37: ["scarf", "winter scarf"],
  38: ["wallet", "purse"],
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface CommonsPage {
  title?: string;
  imageinfo?: { thumburl?: string; url?: string }[];
}

async function searchPhoto(query: string): Promise<{ title: string; url: string } | null> {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: "8",
    prop: "imageinfo",
    iiprop: "url|size",
    iiurlwidth: "800",
    origin: "*",
  });
  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(`${API}?${params}`, {
      headers: { "User-Agent": "sales-shop/1.0 (catalog snapshot script)" },
    });
    if (res.ok) {
      const data = (await res.json()) as { query?: { pages?: Record<string, CommonsPage> } };
      const pages = Object.values(data.query?.pages ?? {});
      for (const p of pages) {
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

async function main() {
  const items = JSON.parse(readFileSync(SNAPSHOT, "utf-8")) as {
    id: number;
    image: string;
  }[];
  const only = new Set(
    (process.env.IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean)
  );
  let updated = 0;
  for (const [idStr, queries] of Object.entries(QUERIES)) {
    const id = Number(idStr);
    if (only.size > 0 && !only.has(idStr)) continue;
    const item = items.find((i) => i.id === id);
    if (!item) continue;
    let found = null as { title: string; url: string } | null;
    for (const q of queries) {
      found = await searchPhoto(q);
      await sleep(800);
      if (found) break;
    }
    if (!found) {
      console.log(`MISS id=${id} (${queries.join(" / ")})`);
      continue;
    }
    const ext = found.url.match(/\.(jpe?g|png|webp)(\?|$)/i)?.[1]?.toLowerCase() ?? "jpg";
    const target = `public/products/${id}.${ext === "jpeg" ? "jpg" : ext}`;
    const res = await fetch(found.url);
    if (!res.ok) {
      console.log(`DOWNLOAD FAIL id=${id}`);
      continue;
    }
    writeFileSync(target, Buffer.from(await res.arrayBuffer()));
    item.image = `/${target.replace(/^public\//, "")}`;
    updated++;
    console.log(`ok id=${id} <- ${found.title}`);
  }
  writeFileSync(SNAPSHOT, JSON.stringify(items, null, 2));
  console.log(`updated ${updated}/${Object.keys(QUERIES).length}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
