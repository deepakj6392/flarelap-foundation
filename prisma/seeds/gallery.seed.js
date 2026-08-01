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

const data = require("../data/gallery.json");

async function main() {
  console.log("🌱 Seeding gallery images...");

  // Clear existing records
  await prisma.galleryImage.deleteMany();
  console.log("  ✓ Cleared existing gallery images");

  const result = await prisma.galleryImage.createMany({ data });
  console.log(`  ✓ Inserted ${result.count} gallery images`);

  console.log("✅ Gallery seeding complete!");
}

main()
  .catch((err) => {
    console.error("❌ Gallery seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
