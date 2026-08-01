const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const fs = require("fs");
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

// Load MCQs dynamically from individual files in prisma/data/mcqs-data/ directory
const mcqsDataDir = path.resolve(__dirname, "../data/mcqs-data");
const mcqMap = {};

if (fs.existsSync(mcqsDataDir)) {
  const files = fs.readdirSync(mcqsDataDir).filter((f) => f.endsWith(".json"));
  files.forEach((file) => {
    try {
      const filePath = path.join(mcqsDataDir, file);
      const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
      
      const fileKey = file.replace(".json", "");
      
      if (Array.isArray(content)) {
        mcqMap[fileKey] = content;
      } else if (content && Array.isArray(content.questions)) {
        mcqMap[fileKey] = content.questions;
        if (content.categoryKey) {
          mcqMap[content.categoryKey] = content.questions;
        }
        if (content.courseName) {
          const courseKey = content.courseName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "");
          if (!mcqMap[courseKey]) {
            mcqMap[courseKey] = content.questions;
          }
        }
      }
    } catch (e) {
      console.warn(`  ⚠ Failed to parse ${file}:`, e.message);
    }
  });
}

// Fallback to master mcqs.json if available
const masterMcqPath = path.resolve(__dirname, "../data/mcqs.json");
if (fs.existsSync(masterMcqPath)) {
  try {
    const masterMap = JSON.parse(fs.readFileSync(masterMcqPath, "utf8"));
    Object.assign(mcqMap, masterMap);
  } catch (e) {
    // ignore if master not present
  }
}

/**
 * Maps a course name to its MCQ category key
 */
function getCategoryKey(courseName) {
  const sanitizedKey = courseName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  if (mcqMap[sanitizedKey]) return sanitizedKey;

  const name = courseName.toLowerCase();
  if (name.includes("jee")) {
    if (name.includes("physics")) return "jee_physics";
    if (name.includes("chemistry")) return "jee_chemistry";
    if (name.includes("math") || name.includes("mathematics")) return "jee_math";
  }
  if (name.includes("neet")) {
    if (name.includes("biology")) return "neet_biology";
    if (name.includes("physics")) return "neet_physics";
    if (name.includes("chemistry")) return "neet_chemistry";
    return "neet_biology";
  }
  if (
    name.includes("web") || name.includes("html") ||
    name.includes("css") || name.includes("javascript") ||
    name.includes("development")
  ) {
    return "webdev";
  }
  if (
    name.includes("computer") || name.includes("gate") ||
    name.includes("database") || name.includes("sql")
  ) {
    return "cs";
  }
  if (name.includes("english") || name.includes("grammar") || name.includes("ctet")) {
    return "english";
  }
  if (
    name.includes("math") || name.includes("algebra") ||
    name.includes("nda") || name.includes("geometry")
  ) {
    return "math";
  }
  return "generic";
}

async function main() {
  console.log("🌱 Seeding MCQ questions from prisma/data/mcqs-data/ files...");

  // Load all courses once
  const courses = await prisma.course.findMany();
  if (courses.length === 0) {
    console.error("❌ No courses found. Run courses.seed.js first.");
    process.exit(1);
  }

  // Clear all existing MCQs for a clean seed
  const deleted = await prisma.mCQQuestion.deleteMany();
  console.log(`  ✓ Cleared ${deleted.count} existing MCQ questions`);

  let totalSeeded = 0;

  for (const course of courses) {
    const categoryKey = getCategoryKey(course.name);
    const questions = mcqMap[categoryKey] || mcqMap["generic"];

    if (!questions || questions.length === 0) {
      console.warn(`  ⚠ No questions for category "${categoryKey}" (course: "${course.name}") — skipping`);
      continue;
    }

    console.log(
      `  → Seeding ${questions.length} questions for "${course.name}" [${categoryKey}]...`
    );

    // Insert in batches of 20
    const batchSize = 20;
    for (let i = 0; i < questions.length; i += batchSize) {
      const batch = questions.slice(i, i + batchSize);
      await Promise.all(
        batch.map((q) =>
          prisma.mCQQuestion.create({
            data: {
              courseId: course.id,
              question: q.question,
              options: q.options,
              answer: q.answer,
              hint: q.hint || "",
            },
          })
        )
      );
    }

    console.log(`  ✓ Done: "${course.name}" (${questions.length} questions)`);
    totalSeeded += questions.length;
  }

  console.log(
    `✅ MCQ seeding complete! (${totalSeeded} questions seeded across ${courses.length} courses)`
  );
}

main()
  .catch((err) => {
    console.error("❌ MCQ seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
