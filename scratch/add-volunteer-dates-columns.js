require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const dbUrl = process.env.DATABASE_URL;
const adapter = new PrismaNeon({ connectionString: dbUrl });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Adding member_since and expiry_date columns to volunteers table...");
  await prisma.$executeRawUnsafe(`ALTER TABLE "volunteers" ADD COLUMN IF NOT EXISTS "member_since" TEXT;`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "volunteers" ADD COLUMN IF NOT EXISTS "expiry_date" TEXT;`);
  console.log("Columns added successfully!");
}

main()
  .catch((e) => {
    console.error("Migration error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
