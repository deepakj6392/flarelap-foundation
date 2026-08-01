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

const data = require("../data/test-series.json");

async function main() {
  console.log("🌱 Seeding test series...");

  // Load all courses once for lookup
  const courses = await prisma.course.findMany();
  if (courses.length === 0) {
    console.error("❌ No courses found. Run courses.seed.js first.");
    process.exit(1);
  }

  const courseMap = new Map(courses.map((c) => [c.name, c.id]));
  let inserted = 0;
  let skipped = 0;

  for (const series of data) {
    const courseId = courseMap.get(series.courseName);

    if (!courseId) {
      console.warn(`  ⚠ Course not found: "${series.courseName}" — skipping "${series.name}"`);
      skipped++;
      continue;
    }

    // Check for duplicate (same name + courseId)
    const existing = await prisma.testSeries.findFirst({
      where: { name: series.name, courseId },
    });

    if (!existing) {
      await prisma.testSeries.create({
        data: {
          name: series.name,
          type: series.type,
          qs: series.qs,
          marks: series.marks,
          duration: series.duration,
          isFree: series.isFree ?? false,
          courseId,
        },
      });
      console.log(`  ✓ Created: "${series.name}" → ${series.courseName}`);
      inserted++;
    } else {
      console.log(`  → Exists:  "${series.name}" (skipped)`);
      skipped++;
    }
  }

  console.log(`✅ Test series seeding complete! (${inserted} created, ${skipped} skipped)`);
}

main()
  .catch((err) => {
    console.error("❌ Test series seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
