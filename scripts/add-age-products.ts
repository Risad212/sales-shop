/**
 * One-time expansion: appends 18 age-grouped products (kids/teens/adults/
 * seniors) to the local snapshot with locally-downloaded photos.
 * Run: npx tsx scripts/add-age-products.ts
 */
import { readFileSync, writeFileSync } from "fs";

const SNAPSHOT = "prisma/catalog.snapshot.json";

interface NewProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  ageGroup: string;
  ratingRate: number;
  ratingCount: number;
}

const NEW: NewProduct[] = [
  { id: 21, title: "Kids Denim Jacket", price: 34.99, description: "Durable kids denim jacket with snap buttons and roomy pockets. Perfect for school and play.", category: "kids", ageGroup: "kids", ratingRate: 4.6, ratingCount: 88 },
  { id: 22, title: "Kids Cotton T-Shirt 3-Pack", price: 19.99, description: "Three-pack of soft breathable cotton t-shirts for kids in fun colors. Machine washable.", category: "kids", ageGroup: "kids", ratingRate: 4.5, ratingCount: 132 },
  { id: 23, title: "Kids Light-Up Sneakers", price: 42.99, description: "Light-up sneakers with USB rechargeable LED soles. Velcro straps for easy wear.", category: "kids", ageGroup: "kids", ratingRate: 4.7, ratingCount: 210 },
  { id: 24, title: "Kids School Backpack", price: 27.99, description: "Ergonomic kids backpack with padded straps, lunch pocket and cartoon print.", category: "kids", ageGroup: "kids", ratingRate: 4.4, ratingCount: 76 },
  { id: 25, title: "Building Blocks 500pc Set", price: 39.99, description: "500-piece STEM building blocks compatible with major brands. Sparks creativity for ages 4+.", category: "toys", ageGroup: "kids", ratingRate: 4.8, ratingCount: 342 },
  { id: 26, title: "Remote Control Stunt Car", price: 49.99, description: "2.4GHz RC stunt car with 360 flips, LED lights and 60-minute play time.", category: "toys", ageGroup: "kids", ratingRate: 4.5, ratingCount: 187 },
  { id: 27, title: "Family Board Game Night Edition", price: 24.99, description: "Strategy board game for 2-6 players. A family game-night favorite for teens and parents.", category: "toys", ageGroup: "teens", ratingRate: 4.6, ratingCount: 154 },
  { id: 28, title: "Giant Plush Teddy Bear", price: 29.99, description: "100cm super-soft giant teddy bear. The perfect cuddly gift for kids.", category: "toys", ageGroup: "kids", ratingRate: 4.7, ratingCount: 265 },
  { id: 29, title: "Teen Graphic Hoodie", price: 36.99, description: "Trendy oversized graphic hoodie for teens in heavyweight fleece with kangaroo pocket.", category: "men's clothing", ageGroup: "teens", ratingRate: 4.5, ratingCount: 198 },
  { id: 30, title: "Teen Crossbody Mini Bag", price: 28.99, description: "Compact crossbody bag with adjustable strap. Fits phone, wallet and essentials.", category: "women's clothing", ageGroup: "teens", ratingRate: 4.3, ratingCount: 91 },
  { id: 31, title: "Wireless Bluetooth Earbuds", price: 45.99, description: "True wireless earbuds with noise isolation and 30-hour charging case. A teen essential.", category: "electronics", ageGroup: "teens", ratingRate: 4.4, ratingCount: 423 },
  { id: 32, title: "Teen Canvas High-Top Sneakers", price: 39.99, description: "Classic high-top canvas sneakers with cushioned sole. Street-ready teen style.", category: "men's clothing", ageGroup: "teens", ratingRate: 4.2, ratingCount: 117 },
  { id: 33, title: "Smartwatch Pro Series 5", price: 199.99, description: "Advanced smartwatch with heart-rate, GPS and 10-day battery. For busy adults.", category: "electronics", ageGroup: "adults", ratingRate: 4.6, ratingCount: 512 },
  { id: 34, title: "Genuine Leather Handbag", price: 89.99, description: "Premium full-grain leather handbag with magnetic closure and inner zip pocket.", category: "jewelery", ageGroup: "adults", ratingRate: 4.5, ratingCount: 143 },
  { id: 35, title: "Reading Glasses 3-Pack", price: 16.99, description: "Three-pack of lightweight reading glasses (+1.0 to +3.0) with protective cases. Senior friendly.", category: "jewelery", ageGroup: "seniors", ratingRate: 4.4, ratingCount: 289 },
  { id: 36, title: "Digital Blood Pressure Monitor", price: 54.99, description: "Automatic upper-arm blood pressure monitor with large display and memory for 2 users.", category: "electronics", ageGroup: "seniors", ratingRate: 4.6, ratingCount: 376 },
  { id: 37, title: "Wool Knit Winter Scarf", price: 22.99, description: "Extra-soft merino wool scarf. Warm, lightweight comfort for seniors.", category: "women's clothing", ageGroup: "seniors", ratingRate: 4.5, ratingCount: 84 },
  { id: 38, title: "Classic Bifold Leather Wallet", price: 34.99, description: "Timeless bifold wallet in genuine leather with RFID protection. A great senior gift.", category: "jewelery", ageGroup: "seniors", ratingRate: 4.7, ratingCount: 231 },
];

async function download(url: string, path: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed ${res.status}: ${url}`);
  writeFileSync(path, Buffer.from(await res.arrayBuffer()));
}

async function main() {
  const items = JSON.parse(readFileSync(SNAPSHOT, "utf-8")) as Record<string, unknown>[];
  const existing = new Set(items.map((i) => i.id));

  // Existing catalog items are adult-oriented.
  for (const item of items) {
    if (!item.ageGroup) item.ageGroup = "adults";
  }

  for (const p of NEW) {
    if (existing.has(p.id)) {
      console.log(`skip ${p.id} (already in snapshot)`);
      continue;
    }
    const local = `public/products/${p.id}.jpg`;
    await download(`https://picsum.photos/seed/shop${p.id}/600/600`, local);
    console.log(`saved ${local}`);
    items.push({ ...p, image: `/products/${p.id}.jpg` });
  }

  writeFileSync(SNAPSHOT, JSON.stringify(items, null, 2));
  console.log(`snapshot now has ${items.length} products`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
