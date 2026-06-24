import dotenv from "dotenv";
// Load environment variables from .env.local at the very top
dotenv.config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const globalForPrisma = global as unknown as { prismaClientV5: PrismaClient };

let prismaInstance: PrismaClient;

const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/flarelap_foundation?schema=public";
const isLocal = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");
console.log("Prisma initializing with dbUrl:", dbUrl, "isLocal:", isLocal);

let adapter;

if (isLocal) {
  const pool = new Pool({ 
    connectionString: dbUrl,
    ssl: false
  });
  adapter = new PrismaPg(pool);
} else {
  adapter = new PrismaNeon({
    connectionString: dbUrl,
  });
}

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

