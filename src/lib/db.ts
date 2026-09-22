import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function hasDatabase(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/** Returns null when DATABASE_URL is not set. */
export function getDb(): PrismaClient | null {
  if (!hasDatabase()) return null;
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}
