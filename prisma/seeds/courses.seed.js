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

const data = require("../data/courses.json");

async function main() {
  console.log("🌱 Seeding courses...");

  for (const course of data) {
    const existing = await prisma.course.findFirst({ where: { name: course.name } });
    if (!existing) {
      await prisma.course.create({
        data: {
          name: course.name,
          active: course.active ?? true,
          premium: course.premium ?? false,
        },
      });
      console.log(`  ✓ Created: "${course.name}"`);
    } else {
      console.log(`  → Exists:  "${course.name}" (skipped)`);
    }
  }

  console.log(`✅ Courses seeding complete! (${data.length} courses processed)`);
}

main()
  .catch((err) => {
    console.error("❌ Courses seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
