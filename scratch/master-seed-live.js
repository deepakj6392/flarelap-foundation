require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const dbUrl = process.env.DATABASE_URL;
console.log("Connecting to Live Database:", dbUrl ? dbUrl.replace(/:[^:@]+@/, ":****@") : "Missing URL");

const adapter = new PrismaNeon({ connectionString: dbUrl });
const prisma = new PrismaClient({ adapter });

async function runSeed() {
  console.log("==========================================");
  console.log("STARTING MASTER LIVE DATABASE SEEDING");
  console.log("==========================================");

  // 1. Ensure Super Admin Account
  const adminEmail = "admin@flarelap.org";
  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync("admin123", 10);

  const existingAdmin = await prisma.user.findFirst({
    where: { email: adminEmail }
  });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        name: "Super Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "super_admin"
      }
    });
    console.log("✓ Super Admin user created (admin@flarelap.org)");
  } else {
    console.log("✓ Super Admin user verified");
  }

  // 2. Ensure Site Settings
  let siteSetting = await prisma.siteSetting.findFirst();
  if (!siteSetting) {
    siteSetting = await prisma.siteSetting.create({
      data: {
        email: "contact@flarelap.org",
        phone: "+919729817600",
        address: "Flarelap Global Foundation\nSirsal (38) Kaithal, Haryana, India. PIN- 136026.",
        location: "India",
        facebook: "https://www.facebook.com/flarelap.org",
        instagram: "https://www.instagram.com/flarelap_org",
        xLink: "https://x.com/Flarelap_Org",
        youtube: "https://www.youtube.com/@flarelap_org",
        logoUrl: "/logo.png"
      }
    });
    console.log("✓ Site Settings initialized with default logo and contact details");
  } else {
    if (!siteSetting.logoUrl) {
      await prisma.siteSetting.update({
        where: { id: siteSetting.id },
        data: { logoUrl: "/logo.png" }
      });
    }
    console.log("✓ Site Settings verified");
  }

  // 3. Count metrics
  const categoriesCount = await prisma.category.count();
  const coursesCount = await prisma.course.count();
  const testSeriesCount = await prisma.testSeries.count();
  const mcqsCount = await prisma.mCQQuestion.count();
  const volunteersCount = await prisma.volunteer.count();
  const userLogsCount = await prisma.userLog.count();
  const teamMembersCount = await prisma.teamMember.count();
  const blogPostsCount = await prisma.blogPost.count();

  console.log("==========================================");
  console.log("LIVE DATABASE SEEDING SUMMARY:");
  console.log(`- Categories: ${categoriesCount}`);
  console.log(`- Courses: ${coursesCount}`);
  console.log(`- Test Series: ${testSeriesCount}`);
  console.log(`- MCQs / Questions: ${mcqsCount}`);
  console.log(`- Volunteers: ${volunteersCount}`);
  console.log(`- User Logs: ${userLogsCount}`);
  console.log(`- Team Members: ${teamMembersCount}`);
  console.log(`- Blog Posts: ${blogPostsCount}`);
  console.log("==========================================");
}

runSeed()
  .catch((err) => {
    console.error("Master seed error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
