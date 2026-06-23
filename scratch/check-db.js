const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/flarelap_foundation?schema=public";
const pool = new Pool({ connectionString: dbUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const categories = [
  "SSC", "PG Entrance Exam", "Regulatory Body Exams", "Teaching Exams", 
  "Fitter", "Electrician", "AE/JE Exams", "Judiciary Exams", 
  "Paramedical Exams", "Electronic Mechanic", "Railways", 
  "Banking & Insurance", "State Exams", "Defence Exams", 
  "Civil Services", "Police Exams", "B.Ed Entrance Exams"
];

const getCategoryForCourse = (courseName) => {
  const name = courseName.toLowerCase();
  if (name.includes("police") || name.includes("constable")) return "Police Exams";
  if (name.includes("ssc") || name.includes("cgl") || name.includes("cpo")) return "SSC";
  if (name.includes("ae") || name.includes("je")) return "AE/JE Exams";
  if (name.includes("rrb") || name.includes("alp") || name.includes("ntpc") || name.includes("group d")) return "Railways";
  if (name.includes("bank") || name.includes("sbi") || name.includes("ibps") || name.includes("lic") || name.includes("rbi")) return "Banking & Insurance";
  if (name.includes("sebi") || name.includes("nabard") || name.includes("regulatory")) return "Regulatory Body Exams";
  if (name.includes("jrf") || name.includes("net") || name.includes("gate")) return "PG Entrance Exam";
  if (name.includes("teaching") || name.includes("ctet") || name.includes("uptet") || name.includes("kvs")) return "Teaching Exams";
  if (name.includes("fitter")) return "Fitter";
  if (name.includes("electrician")) return "Electrician";
  if (name.includes("judiciary")) return "Judiciary Exams";
  if (name.includes("paramedical")) return "Paramedical Exams";
  if (name.includes("electronic mechanic")) return "Electronic Mechanic";
  if (name.includes("civil") || name.includes("upsc") || name.includes("pcs")) return "Civil Services";
  if (name.includes("nda") || name.includes("cds") || name.includes("defence") || name.includes("afcat")) return "Defence Exams";
  if (name.includes("b.ed")) return "B.Ed Entrance Exams";
  return "State Exams";
};

async function check() {
  const courses = await prisma.course.findMany();
  console.log('Total courses in database:', courses.length);
  
  const counts = {};
  for (const cat of categories) {
    counts[cat] = 0;
  }
  counts["Other/Unmapped"] = 0;

  for (const c of courses) {
    const cat = getCategoryForCourse(c.name);
    if (counts[cat] !== undefined) {
      counts[cat]++;
    } else {
      counts["Other/Unmapped"]++;
    }
  }

  console.log('Course counts by category (Corrected Mapper):');
  console.table(counts);
}

check().catch(console.error).finally(() => prisma.$disconnect());
