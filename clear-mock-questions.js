const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
require("dotenv").config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set inside .env!");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function clearMockQuestionsAndSeries() {
  console.log("Starting deletion of mock test questions, test series, and test attempts...");
  try {
    const deletedAttempts = await prisma.testAttempt.deleteMany({});
    console.log(`Deleted ${deletedAttempts.count} records from TestAttempt.`);

    const deletedMcqs = await prisma.mCQQuestion.deleteMany({});
    console.log(`Deleted ${deletedMcqs.count} records from MCQQuestion.`);

    const deletedSeries = await prisma.testSeries.deleteMany({});
    console.log(`Deleted ${deletedSeries.count} records from TestSeries.`);

    console.log("\nDatabase cleaned successfully!");
  } catch (err) {
    console.error("Error during deletion:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

clearMockQuestionsAndSeries();
