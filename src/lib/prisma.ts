import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = global as unknown as { prismaClientV5: PrismaClient };

let prismaInstance: PrismaClient;

const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/flarelap_foundation?schema=public";
const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);

if (process.env.NODE_ENV === "production") {
  prismaInstance = new PrismaClient({ adapter });
} else {
  if (!globalForPrisma.prismaClientV5) {
    globalForPrisma.prismaClientV5 = new PrismaClient({ adapter });
  }
  prismaInstance = globalForPrisma.prismaClientV5;
}

export const prisma = prismaInstance;
export default prisma;
