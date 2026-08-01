const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("❌ DATABASE_URL is not set in .env");
  process.exit(1);
}

const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const data = require("../data/site.json");

async function main() {
  console.log("🌱 Seeding site settings...");

  let setting = await prisma.siteSetting.findFirst();

  if (setting) {
    setting = await prisma.siteSetting.update({
      where: { id: setting.id },
      data,
    });
    console.log("  ✓ Updated site settings (id:", setting.id + ")");
  } else {
    setting = await prisma.siteSetting.create({ data });
    console.log("  ✓ Created site settings (id:", setting.id + ")");
  }

  console.log("✅ Site settings seeding complete!");
}

main()
  .catch((err) => {
    console.error("❌ Settings seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
