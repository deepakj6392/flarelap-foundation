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
  console.log("Starting deletion of mock test questions, test series, test attempts, purchases, and courses...");
  try {
    // 1. Delete test attempts first (depends on TestSeries, Course, User)
    const deletedAttempts = await prisma.testAttempt.deleteMany({});
    console.log(`Deleted ${deletedAttempts.count} records from TestAttempt.`);

    // 2. Delete MCQ questions (depends on Course)
    const deletedMcqs = await prisma.mCQQuestion.deleteMany({});
    console.log(`Deleted ${deletedMcqs.count} records from MCQQuestion.`);

    // 3. Delete test series (depends on Course)
    const deletedSeries = await prisma.testSeries.deleteMany({});
    console.log(`Deleted ${deletedSeries.count} records from TestSeries.`);

    // 4. Delete courses (TestAttempt, MCQQuestion, TestSeries already removed above)
    const deletedCourses = await prisma.course.deleteMany({});
    console.log(`Deleted ${deletedCourses.count} records from Course.`);

    // 5. Delete categories (User.categoryId & Course.categoryId use onDelete: SetNull)
    const deletedCategories = await prisma.category.deleteMany({});
    console.log(`Deleted ${deletedCategories.count} records from Category.`);

    console.log("\nDatabase cleaned successfully!");
  } catch (err) {
    console.error("Error during deletion:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

clearMockQuestionsAndSeries();
