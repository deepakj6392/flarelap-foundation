require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const dbUrl = process.env.DATABASE_URL;
const adapter = new PrismaNeon({ connectionString: dbUrl });
const prisma = new PrismaClient({ adapter });

function generateMemberId(phone, createdAt) {
  const digitsOnly = (phone || "").replace(/\D/g, "");
  const phoneLast2 = digitsOnly.length >= 2 ? digitsOnly.slice(-2) : "00";
  const year = createdAt ? new Date(createdAt).getFullYear() : new Date().getFullYear();
  const yearLast2 = year.toString().slice(-2);
  return `FGF-00${phoneLast2}${yearLast2}`;
}

async function main() {
  console.log("Adding member_id column to volunteers table...");
  await prisma.$executeRawUnsafe(`ALTER TABLE "volunteers" ADD COLUMN IF NOT EXISTS "member_id" TEXT;`);
  
  console.log("Backfilling member_id for existing volunteers...");
  const volunteers = await prisma.volunteer.findMany();
  for (const v of volunteers) {
    if (!v.memberId) {
      let memberId = generateMemberId(v.phone, v.createdAt);
      // Ensure uniqueness if needed
      const exists = await prisma.volunteer.findFirst({ where: { memberId } });
      if (exists && exists.id !== v.id) {
        memberId = `${memberId}-${v.id}`;
      }
      await prisma.volunteer.update({
        where: { id: v.id },
        data: { memberId }
      });
      console.log(`Updated volunteer ${v.fullName} (ID: ${v.id}) with Member ID: ${memberId}`);
    }
  }

  // Create unique index
  try {
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "volunteers_member_id_key" ON "volunteers"("member_id");`);
  } catch (err) {
    console.log("Unique index note:", err.message);
  }

  console.log("Migration finished successfully!");
}

main()
  .catch((e) => {
    console.error("Migration error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
