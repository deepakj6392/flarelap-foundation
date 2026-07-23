require('dotenv').config({ path: '.env' });
const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const dbUrl = process.env.DATABASE_URL;
const adapter = new PrismaNeon({ connectionString: dbUrl });
const prisma = new PrismaClient({ adapter });

const sampleVolunteers = [
  {
    fullName: "Aarav Sharma",
    gender: "Male",
    dob: "1998-05-14",
    panNo: "ABCDE1234F",
    uidNo: "987654321012",
    email: "aarav.sharma@example.com",
    phone: "+91 9876543210",
    education: "Graduate",
    specializations: "Digital Literacy & Computer Instruction",
    street: "12, Civil Lines",
    villageCity: "Karnal",
    district: "Karnal",
    state: "Haryana",
    pincode: "132001",
    agreement: true,
    status: "APPROVED"
  },
  {
    fullName: "Priya Verma",
    gender: "Female",
    dob: "1995-11-20",
    panNo: "FGHIJ5678K",
    uidNo: "876543210987",
    email: "priya.verma@example.com",
    phone: "+91 9812345678",
    education: "Postgraduate",
    specializations: "Girl Child Mentorship & Healthcare Workshops",
    street: "45, Model Town",
    villageCity: "Kaithal",
    district: "Kaithal",
    state: "Haryana",
    pincode: "136027",
    agreement: true,
    status: "APPROVED"
  },
  {
    fullName: "Rajesh Kumar",
    gender: "Male",
    dob: "1988-03-25",
    panNo: "KLMNO9012P",
    uidNo: "765432109876",
    email: "rajesh.kumar@example.com",
    phone: "+91 9729817654",
    education: "Ph.D",
    specializations: "Curriculum Development & Mathematics Tutoring",
    street: "Sector 14, Urban Estate",
    villageCity: "Kurukshetra",
    district: "Kurukshetra",
    state: "Haryana",
    pincode: "136118",
    agreement: true,
    status: "APPROVED"
  },
  {
    fullName: "Ananya Gupta",
    gender: "Female",
    dob: "2001-08-10",
    panNo: "QRSTU3456V",
    uidNo: "654321098765",
    email: "ananya.gupta@example.com",
    phone: "+91 9988776655",
    education: "Higher Secondary",
    specializations: "Primary Student Homework Support & Event Coordination",
    street: "Sirsal Road",
    villageCity: "Sirsal",
    district: "Kaithal",
    state: "Haryana",
    pincode: "136026",
    agreement: true,
    status: "APPROVED"
  },
  {
    fullName: "Vikram Singh",
    gender: "Male",
    dob: "1992-02-18",
    panNo: "WXYZA7890B",
    uidNo: "543210987654",
    email: "vikram.singh@example.com",
    phone: "+91 9811223344",
    education: "Diploma",
    specializations: "IT Hardware Maintenance & Lab Setup",
    street: "GT Road",
    villageCity: "Ambala",
    district: "Ambala",
    state: "Haryana",
    pincode: "134003",
    agreement: true,
    status: "APPROVED"
  }
];

async function main() {
  console.log("Seeding 5 test volunteers into database...");

  for (const vol of sampleVolunteers) {
    const existing = await prisma.volunteer.findFirst({
      where: { email: vol.email }
    });

    if (!existing) {
      const created = await prisma.volunteer.create({
        data: vol
      });
      console.log(`Created volunteer: ${created.fullName} (ID: ${created.id})`);
    } else {
      console.log(`Volunteer ${vol.fullName} already exists (ID: ${existing.id})`);
    }
  }

  console.log("Volunteer seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding volunteers:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
