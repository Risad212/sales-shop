/**
 * Seed the Postgres catalog from the local snapshot (no network).
 * Snapshot created once via: npx tsx scripts/snapshot-catalog.ts
 * Run:  npx prisma db push && npm run db:seed
 * Requires DATABASE_URL in .env
 */
import { readFileSync } from "fs";
import { join } from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env first.");
  }
  const file = join(__dirname, "catalog.snapshot.json");
  const items = JSON.parse(readFileSync(file, "utf-8")) as SnapshotItem[];

  for (const item of items) {
    await prisma.product.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        ageGroup: item.ageGroup ?? "all",
        ratingRate: item.ratingRate,
        ratingCount: item.ratingCount,
      },
      create: {
        id: item.id,
        title: item.title,
        description: item.description,
        price: item.price,
        category: item.category,
        image: item.image,
        ageGroup: item.ageGroup ?? "all",
        ratingRate: item.ratingRate,
        ratingCount: item.ratingCount,
      },
    });
  }
  console.log(`Seeded ${items.length} products from local snapshot.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
