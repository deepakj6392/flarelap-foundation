const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const dbUrl = "postgresql://neondb_owner:npg_p3ERDLQ1JwNn@ep-crimson-salad-aopb5kye-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding gallery...');
  await prisma.galleryImage.createMany({
    data: [
      { imageUrl: '/uploads/home_hero.png', caption: 'Community Support', pageName: 'donate', sequence: 1 },
      { imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070', caption: 'Education for All', pageName: 'donate', sequence: 2 },
      { imageUrl: 'https://images.unsplash.com/photo-1593113589914-07553f1f77d5?q=80&w=2070', caption: 'Relief Distribution', pageName: 'donate', sequence: 3 },
      { imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070', caption: 'Empowering People', pageName: 'donate', sequence: 4 },
      { imageUrl: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=2070', caption: 'Brighter Future', pageName: 'donate', sequence: 5 },
    ]
  });

  console.log('Seeding team members...');
  const members = [
    { id: 1, name: 'Dr. Raj Simha', role: 'Founder', description: 'Founder and visionary leader.', order: 1, imageUrl: '/uploads/team/raj_simha.webp' },
    { id: 2, name: 'Bharat Bhushan', role: 'M.D.', description: 'Medical Director, overseeing health initiatives.', order: 4, imageUrl: '/uploads/team/bharat_bhushan.webp' },
    { id: 3, name: 'Deepak Jaiswal', role: 'Executive Director', description: 'Executive Director, driving strategic initiatives.', order: 2, imageUrl: '/uploads/team/deepak_jaiswal.webp' },
    { id: 4, name: 'Amit Tripathi', role: 'Operational Director', description: 'Responsible for day‑to‑day operations and execution.', order: 3, imageUrl: '/uploads/team/amit_tripathi.webp' },
  ];

  for (const m of members) {
    await prisma.teamMember.upsert({
      where: { id: m.id },
      update: m,
      create: m,
    });
  }

  console.log('Successfully seeded live database!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
