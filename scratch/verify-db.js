const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/flarelap_foundation?schema=public";
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function verify() {
  console.log('--- VERIFYING COURSES ---');
  const courses = await prisma.course.findMany({
    orderBy: { id: 'asc' },
    include: {
      _count: {
        select: { mcqs: true }
      }
    }
  });

  console.log(`Total Courses in database: ${courses.length}`);
  courses.forEach(c => {
    console.log(`ID: ${c.id} | Name: ${c.name} | MCQ Count: ${c._count.mcqs}`);
  });

  console.log('--- VERIFYING SEQUENTIAL ID INTEGRITY ---');
  let sequential = true;
  for (let i = 0; i < courses.length; i++) {
    if (courses[i].id !== i + 1) {
      sequential = false;
      console.log(`Mismatch! Expected ID ${i + 1}, found ${courses[i].id}`);
    }
  }
  if (sequential && courses.length === 17) {
    console.log('Success: All 17 courses have perfectly sequential IDs 1 to 17!');
  } else {
    console.log(`Failed sequential check. Total courses: ${courses.length}`);
  }
}

verify().catch(console.error).finally(() => prisma.$disconnect());
