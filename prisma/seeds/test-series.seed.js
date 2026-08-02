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

const pool = new Pool({
  connectionString,
  ssl: connectionString.includes("neon") ? { rejectUnauthorized: false } : false,
});
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

  const records = [];
  for (const series of data) {
    const courseId = courseMap.get(series.courseName);
    if (!courseId) continue;

    records.push({
      name: series.name,
      type: series.type,
      qs: series.qs,
      marks: series.marks,
      duration: series.duration,
      isFree: series.isFree ?? false,
      courseId,
    });
  }

  // Clear existing test series for clean seed
  const deleted = await prisma.testSeries.deleteMany();
  console.log(`  ✓ Cleared ${deleted.count} existing test series entries`);

  // Batch insert 500 records at a time
  const batchSize = 500;
  let inserted = 0;
  for (let i = 0; i < records.length; i += batchSize) {
    const batch = records.slice(i, i + batchSize);
    await prisma.testSeries.createMany({
      data: batch,
      skipDuplicates: true,
    });
    inserted += batch.length;
  }

  console.log(`✅ Test series seeding complete! (${inserted} test series seeded across ${courses.length} courses)`);
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
