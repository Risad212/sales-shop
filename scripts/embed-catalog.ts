/**
 * Backfill pgvector embeddings for products missing them.
 * Run after seeding:  npm run db:embed
 * Requires DATABASE_URL + a configured embedding provider (see .env.example).
 */
import { PrismaClient } from "@prisma/client";
import { embedTexts, productEmbeddingText, EMBEDDING_DIMS } from "../src/lib/embeddings";

const prisma = new PrismaClient();
const BATCH = 20;

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env first.");
  }
  const missing = await prisma.$queryRaw<{ id: number }[]>`
    SELECT id FROM "Product" WHERE embedding IS NULL ORDER BY id ASC
  `;
  if (missing.length === 0) {
    console.log("All products already have embeddings.");
    return;
  }
  console.log(`Embedding ${missing.length} products...`);

  for (let i = 0; i < missing.length; i += BATCH) {
    const batch = missing.slice(i, i + BATCH);
    const products = await prisma.product.findMany({
      where: { id: { in: batch.map((m) => m.id) } },
    });
    const vectors = await embedTexts(products.map(productEmbeddingText));
    if (!vectors) throw new Error("Embedding provider returned nothing. Check EMBEDDING_* env vars.");
    for (let j = 0; j < products.length; j++) {
      const product = products[j];
      const vector = vectors[j];
      if (!product || !vector) throw new Error(`Missing product/vector at batch index ${j}`);
      if (vector.length !== EMBEDDING_DIMS) {
        throw new Error(`Dims mismatch: got ${vector.length}, need ${EMBEDDING_DIMS}`);
      }
      const vec = `[${vector.join(",")}]`;
      await prisma.$executeRaw`
        UPDATE "Product" SET embedding = CAST(${vec} AS vector) WHERE id = ${product.id}
      `;
    }
    console.log(`  ${Math.min(i + BATCH, missing.length)}/${missing.length}`);
  }
  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
