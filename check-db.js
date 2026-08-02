const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
require("dotenv").config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function listAllCoursesAndCategories() {
  try {
    const allCourses = await prisma.course.findMany({
      orderBy: { id: "asc" },
      select: { id: true, name: true, categoryId: true }
    });
    console.log(`Total Courses in DB: ${allCourses.length}`);
    console.log("First 20 Courses:");
    allCourses.slice(0, 20).forEach(c => console.log(`ID: ${c.id} | Name: ${c.name} | CategoryId: ${c.categoryId}`));

    const allCategories = await prisma.category.findMany({
      orderBy: { id: "asc" },
      select: { id: true, name: true }
    });
    console.log(`\nTotal Categories in DB: ${allCategories.length}`);
    allCategories.forEach(cat => console.log(`ID: ${cat.id} | Name: ${cat.name}`));

  } catch (err) {
    console.error("Error listing courses:", err);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

listAllCoursesAndCategories();
