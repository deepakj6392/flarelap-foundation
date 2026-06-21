const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const dbUrl = "postgresql://postgres:postgres@localhost:5432/flarelap_foundation?schema=public";
const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.galleryImage.createMany({
    data: [
      { imageUrl: '/uploads/home_hero.png', caption: 'Community Support', pageName: 'donate', sequence: 1 },
      { imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070', caption: 'Education for All', pageName: 'donate', sequence: 2 },
      { imageUrl: 'https://images.unsplash.com/photo-1593113589914-07553f1f77d5?q=80&w=2070', caption: 'Relief Distribution', pageName: 'donate', sequence: 3 },
      { imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=2070', caption: 'Empowering People', pageName: 'donate', sequence: 4 },
      { imageUrl: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?q=80&w=2070', caption: 'Brighter Future', pageName: 'donate', sequence: 5 },
    ]
  });
  console.log('Seeded donate gallery images');
}

main().catch(console.error).finally(() => prisma.$disconnect());
