// lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL!;
const pool = new pg.Pool({
  connectionString,
  idleTimeoutMillis: 10000, // recommended
  connectionTimeoutMillis: 10000, // recommended
});
const adapter = new PrismaPg(pool);

// Next.js singleton pattern
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, // ✅ required in Prisma 7 for classic client
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
