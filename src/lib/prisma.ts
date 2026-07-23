import dotenv from "dotenv";
dotenv.config({ path: ".env" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const globalForPrisma = global as unknown as { prismaClientV5: PrismaClient };

function createPrismaClient(): PrismaClient {
  const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/flarelap_foundation?schema=public";
  const isLocal = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");

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

  return new PrismaClient({ adapter });
}

function getPrismaInstance(): PrismaClient {
  if (process.env.NODE_ENV === "production") {
    return createPrismaClient();
  }

  if (
    !globalForPrisma.prismaClientV5 ||
    !(globalForPrisma.prismaClientV5 as any).volunteer ||
    !(globalForPrisma.prismaClientV5 as any).userLog
  ) {
    globalForPrisma.prismaClientV5 = createPrismaClient();
  }

  return globalForPrisma.prismaClientV5;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    let instance = getPrismaInstance();

    // Check if property is a string model delegate that is undefined on cached instance
    if (
      typeof prop === "string" &&
      !prop.startsWith("$") &&
      !prop.startsWith("_") &&
      (instance as any)[prop] === undefined
    ) {
      globalForPrisma.prismaClientV5 = createPrismaClient();
      instance = globalForPrisma.prismaClientV5;
    }

    const value = (instance as any)[prop];
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  }
});

export default prisma;
