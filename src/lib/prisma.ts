import dotenv from "dotenv";
// Load environment variables from .env.local at the very top
dotenv.config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.PGUSER || process.env.DB_USER || "flarelap_foundation"}:${encodeURIComponent(process.env.PGPASSWORD || process.env.DB_PASSWORD || "Admin#Foundation@123")}@${process.env.PGHOST || process.env.DB_HOST || "localhost"}:${process.env.PGPORT || process.env.DB_PORT || "5432"}/${process.env.PGDATABASE || process.env.DB_NAME || "flarelap_foundation"}${process.env.PGSSLMODE === "require" ? "?sslmode=require" : ""}`;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient;

const pool = new Pool({
  connectionString,
  ssl: process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : undefined,
});
const adapter = new PrismaPg(pool);

if (process.env.NODE_ENV === "production") {
  prismaInstance = new PrismaClient({ adapter });
} else {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({ adapter });
  }
  prismaInstance = globalForPrisma.prisma;
}

export const prisma = prismaInstance;
export default prisma;
