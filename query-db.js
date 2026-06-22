const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const dbUrl = "postgresql://neondb_owner:npg_p3ERDLQ1JwNn@ep-crimson-salad-aopb5kye-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function query() {
  const courses = await prisma.course.findMany();
  console.log(`Found ${courses.length} courses total.`);
  courses.forEach(c => {
    console.log(`- [ID: ${c.id}] Name: "${c.name}", Active: ${c.active}`);
  });
}

query().catch(console.error).finally(() => prisma.$disconnect());
