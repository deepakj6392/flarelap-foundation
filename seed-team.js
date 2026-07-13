import { prisma } from './src/lib/prisma.ts';

async function main() {
  const members = [
    {
      id: 1,
      name: 'Dr. Raj Simha',
      role: 'Founder',
      description: 'Founder and visionary leader.',
      facebook: null,
      twitter: null,
      github: null,
      behance: null,
      order: 1,
      imageUrl: '/uploads/team/raj_simha.webp',
    },
    {
      id: 2,
      name: 'Bharat Bhushan',
      role: 'M.D.',
      description: 'Managing Director, overseeing health initiatives.',
      facebook: null,
      twitter: null,
      github: null,
      behance: null,
      order: 2,
      imageUrl: '/uploads/team/bharat_bhushan.webp',
    },
    {
      id: 3,
      name: 'Deepak Jaiswal',
      role: 'Executive Director',
      description: 'Executive Director, driving strategic initiatives.',
      facebook: null,
      twitter: null,
      github: null,
      behance: null,
      order: 3,
      imageUrl: '/uploads/team/deepak_jaiswal.webp',
    },
    {
      id: 4,
      name: 'Amit Tripathi',
      role: 'Operational Director',
      description: 'Responsible for day‑to‑day operations and execution.',
      facebook: null,
      twitter: null,
      github: null,
      behance: null,
      order: 4,
      imageUrl: '/uploads/team/amit_tripathi.webp',
    },
  ];


  for (const m of members) {
    await prisma.teamMember.upsert({
      where: { id: m.id },
      update: m,
      create: m,
    });
  }


  console.log('Team members seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
