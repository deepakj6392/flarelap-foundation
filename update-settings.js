const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
require("dotenv").config({ path: ".env" });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set inside .env");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Updating site settings in the database...");
  let setting = await prisma.siteSetting.findFirst();
  const data = {
    email: "support@flarelap.org",
    phone: "+919729817600",
    address: "Sirsal (38), Kaithal,\nHaryana, India. PIN-136026",
    location: "India"
  };
  if (setting) {
    setting = await prisma.siteSetting.update({
      where: { id: setting.id },
      data
    });
    console.log("Updated site settings row:", setting);
  } else {
    setting = await prisma.siteSetting.create({
      data
    });
    console.log("Created site settings row:", setting);
  }
}

main()
  .catch((e) => {
    console.error("Error executing database update script:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
