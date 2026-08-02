const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env.local") });
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

function getAllJsonFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllJsonFiles(fullPath));
    } else if (file.endsWith(".json")) {
      results.push(fullPath);
    }
  });
  return results;
}

async function main() {
  console.log("🌱 Seeding MCQ questions from prisma/data/mcqs-data/ course folders...");

  const dbCourses = await prisma.course.findMany();
  if (dbCourses.length === 0) {
    console.error("❌ No courses found in database. Run courses.seed.js first.");
    process.exit(1);
  }

  // Create lookup maps for dbCourses
  const exactMap = new Map(dbCourses.map((c) => [c.name.trim(), c.id]));
  const normMap = new Map(dbCourses.map((c) => [c.name.toLowerCase().replace(/[^a-z0-9]/g, ""), c.id]));

  const mcqsDataDir = path.resolve(__dirname, "../data/mcqs-data");
  if (!fs.existsSync(mcqsDataDir)) {
    console.error("❌ mcqs-data directory not found at:", mcqsDataDir);
    process.exit(1);
  }

  const filePaths = getAllJsonFiles(mcqsDataDir);
  console.log(`📁 Found ${filePaths.length} MCQ JSON files across course folders to process.`);

  // Map of courseId -> Array of questions
  const courseQuestionsMap = new Map();
  dbCourses.forEach((c) => courseQuestionsMap.set(c.id, []));

  let matchedFiles = 0;

  filePaths.forEach((filePath) => {
    try {
      const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const questions = Array.isArray(content) ? content : content.questions || [];

      if (!questions || questions.length === 0) return;

      let targetCourseId = null;

      // 1. Check exact courseName
      if (content.courseName && exactMap.has(content.courseName.trim())) {
        targetCourseId = exactMap.get(content.courseName.trim());
      }
      // 2. Check normalized courseName
      if (!targetCourseId && content.courseName) {
        const norm = content.courseName.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (normMap.has(norm)) {
          targetCourseId = normMap.get(norm);
        }
      }
      // 3. Fallback: match by parent folder name
      if (!targetCourseId) {
        const parentFolderNorm = path.basename(path.dirname(filePath)).replace(/[^a-z0-9]/g, "");
        if (normMap.has(parentFolderNorm)) {
          targetCourseId = normMap.get(parentFolderNorm);
        }
      }

      if (targetCourseId) {
        courseQuestionsMap.get(targetCourseId).push(...questions);
        matchedFiles++;
      }
    } catch (e) {
      console.warn(`  ⚠ Failed to parse ${filePath}:`, e.message);
    }
  });

  console.log(`  ✓ Successfully mapped ${matchedFiles}/${filePaths.length} JSON files to database courses`);

  // Clear existing questions for clean seed
  const deleted = await prisma.mCQQuestion.deleteMany();
  console.log(`  ✓ Cleared ${deleted.count} existing MCQ questions from DB`);

  let totalSeeded = 0;
  let activeCourseCount = 0;

  for (const course of dbCourses) {
    const questions = courseQuestionsMap.get(course.id) || [];
    if (questions.length === 0) {
      continue;
    }

    // Deduplicate questions by question text within the same course
    const uniqueQuestionsMap = new Map();
    for (const q of questions) {
      if (q && q.question) {
        const qStr = String(q.question).trim();
        if (!uniqueQuestionsMap.has(qStr)) {
          const options = Array.isArray(q.options)
            ? q.options.map((opt) => String(opt))
            : [];
          const answer =
            typeof q.answer === "number"
              ? q.answer
              : parseInt(String(q.answer), 10) || 0;
          const hint = q.hint ? String(q.hint) : "";

          uniqueQuestionsMap.set(qStr, {
            courseId: course.id,
            question: qStr,
            options,
            answer,
            hint,
          });
        }
      }
    }

    const mcqRecords = Array.from(uniqueQuestionsMap.values());
    if (mcqRecords.length === 0) continue;

    activeCourseCount++;

    // Use createMany in batches of 200 for maximum performance
    const batchSize = 200;
    for (let i = 0; i < mcqRecords.length; i += batchSize) {
      const batch = mcqRecords.slice(i, i + batchSize);
      await prisma.mCQQuestion.createMany({
        data: batch,
        skipDuplicates: true,
      });
    }

    console.log(`  ✓ Seeded ${mcqRecords.length} questions for "${course.name}"`);
    totalSeeded += mcqRecords.length;
  }

  console.log(
    `\n✅ MCQ seeding complete! (${totalSeeded} questions seeded across ${activeCourseCount} courses)`
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
