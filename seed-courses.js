const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const dbUrl = "postgresql://neondb_owner:npg_p3ERDLQ1JwNn@ep-crimson-salad-aopb5kye-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log('Seeding courses...');
  const courses = [
    'RRB Group D Mock Test Series 2025-26 (New)',
    'RRB ALP (CBT 1 + CBT 2 + CBAT) Mock Test Series...',
    'Current Affairs (CA) 2026 Mega Pack for...',
    'RRB NTPC Under Graduate 2025-26 (CBT 1 &...',
    'Mission JRF: The Elite 100 Test Series',
    'SSC Maths PYP Mock Test Series (20k+...'
  ];
  
  for (const name of courses) {
    const existing = await prisma.course.findFirst({ where: { name } });
    if (!existing) {
      await prisma.course.create({ data: { name } });
      console.log('Created: ' + name);
    } else {
      console.log('Exists: ' + name);
    }
  }
  console.log('Done!');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
