require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const dbUrl = process.env.DATABASE_URL;
const adapter = new PrismaNeon({ connectionString: dbUrl });
const prisma = new PrismaClient({ adapter });

const sampleLogs = [
  {
    userId: 1,
    userDisplayId: "ADM-1",
    userName: "Super Admin",
    email: "admin@flarelap.org",
    role: "ADMIN",
    action: "LOGIN"
  },
  {
    userId: 1,
    userDisplayId: "STU-91928374",
    userName: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    role: "STUDENT",
    action: "LOGIN"
  },
  {
    userId: 2,
    userDisplayId: "STU-87654321",
    userName: "Priya Verma",
    email: "priya.verma@example.com",
    role: "STUDENT",
    action: "LOGIN"
  },
  {
    userId: 3,
    userDisplayId: "STU-76543210",
    userName: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    role: "STUDENT",
    action: "LOGOUT"
  }
];

async function main() {
  console.log("Seeding sample user activity logs...");
  for (const item of sampleLogs) {
    await prisma.userLog.create({
      data: item
    });
  }
  console.log("User logs seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding logs:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
