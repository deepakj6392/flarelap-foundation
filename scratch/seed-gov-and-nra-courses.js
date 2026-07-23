const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const dbUrl = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_p3ERDLQ1JwNn@ep-crimson-salad-aopb5kye-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function seed() {
  console.log('Seeding Government Organizations & NRA CET courses...');
  const newCourses = [
    // NRA CET (2 courses shown in Image 1)
    'NRA CET 12th Level Mock Test',
    'NRA CET Graduates Mock Test',

    // Government Organizations (24 courses shown in Images 2, 3, 4, 5)
    'AIIMS CRE LDC/UDC/Steno/DEO/JAA/SA Mock Test',
    'NBE Junior Assistant 2024 Mock Tests Series',
    'ISRO Assistant Mock Test 2022',
    'ISRO Junior Personal Assistant Mock Test 2022',
    'CCRAS UDC/LDC/Steno/Assistant Mock Test',
    'NBE Junior Assistant Mock Test',
    'CWC (Central Warehousing Corporation) Superintendent Mock Test',
    'FCI Manager Phase I & II Mock Test 2022',
    'FCI Stenographer Mock Test 2022',
    'CSIR Junior Secretariat Assistant (JSA) 2025 Mock Test',
    'CSIR ASO/SO Mock Test 2023',
    'UPSC EPFO Personal Assistant Mock Test',
    'CSIR Junior Stenographer 2025 Mock Test',
    'AAI Junior Executive (Common Cadre) Mock Test',
    'Supreme Court Junior Court Assistant Mock Test',
    'CCRAS MTS 2025 Mock Test Series',
    'CBSE Junior Assistant Mock Test 2025 (Old)',
    'JCI Junior Assistant Mock Test Series',
    'CBSE Assistant/Superintendent & All Other Post(Tier I) Mock Test',
    'NPCIL Stipendiary Trainee (Category II) Prelims 2026 Mock Test',
    'India Post Postman & Mail Guard Mock Test',
    'EPFO Stenographer (Group C) Mock Test 2023',
    'SGPGI Stenographer Mock Test Series 2025',
    'NPCIL Scientific Assistant Physics Mock Test'
  ];

  for (const name of newCourses) {
    const existing = await prisma.course.findFirst({ where: { name } });
    if (!existing) {
      const created = await prisma.course.create({ data: { name, active: true } });
      console.log('Created: ' + created.name + ' (ID: ' + created.id + ')');
    } else {
      console.log('Exists: ' + existing.name + ' (ID: ' + existing.id + ')');
    }
  }

  // Also clean up old "NRA CET 10th level" if we only want 12th Level and Graduates
  const oldNra10th = await prisma.course.findFirst({ where: { name: 'NRA CET Matriculation 10th Level Mock Test' } });
  if (oldNra10th) {
    await prisma.course.update({ where: { id: oldNra10th.id }, data: { active: false } });
    console.log('Deactivated old NRA CET 10th level to match user request (2 courses for NRA CET)');
  }

  console.log('Seeding finished successfully!');
}

seed().catch(console.error).finally(() => prisma.$disconnect());
