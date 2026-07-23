const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const { PrismaClient } = require('@prisma/client');
const { PrismaNeon } = require('@prisma/adapter-neon');
const { neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const dbUrl = process.env.DATABASE_URL;
const adapter = new PrismaNeon({ connectionString: dbUrl });
const prisma = new PrismaClient({ adapter });

const expectedCategories = {
  "Civil Services": { minCount: 10, checkPrice: true },
  "Accounting and Commerce": { minCount: 10, checkPrice: true },
  "Campus Placements": { minCount: 12, checkPrice: true },
  "NEET": { count: 20, checkPrice: true },
  "JEE": { count: 20, checkPrice: true },
  "MBA Entrance Exam": { count: 10, checkPrice: true }
};

const courseToCategory = {
  "upsc civil services prelims gs mock test": "Civil Services",
  "upsc civil services csat mock test": "Civil Services",
  "uppsc civil services prelims mock test": "Civil Services",
  "bpsc civil services prelims mock test": "Civil Services",
  "mppsc civil services prelims mock test": "Civil Services",
  "ras rajasthan civil services mock test": "Civil Services",
  "mpsc maharashtra civil services mock test": "Civil Services",
  "hppsc civil services prelims mock test": "Civil Services",
  "ukpsc civil services prelims mock test": "Civil Services",
  "gpsc civil services prelims mock test": "Civil Services",
  "ugc net commerce paper 2 mock test": "NET/SET",
  "tcs nqt cognitive skills mock test": "Campus Placements",
  "infosys specialist programmer mock test": "Campus Placements",
  "wipro elite talent hunt mock test": "Campus Placements",
  "cognizant genc quantitative mock test": "Campus Placements",
  "accenture green channel mock test": "Campus Placements",
  "capgemini excelerator mock test": "Campus Placements",
  "hcl tech bee mock test": "Campus Placements",
  "lti mindtree aptitude mock test": "Campus Placements",
  "deloitte nla aptitude mock test": "Campus Placements",
  "dxc technology placement mock test": "Campus Placements",
  "tech mahindra technical & aptitude mock test": "Campus Placements",
  "campus placement general aptitude mock test": "Campus Placements",
  "ca foundation principles of accounting": "Accounting and Commerce",
  "cma foundation financial accounting": "Accounting and Commerce",
  "ca intermediate group 1 accounting mock test": "Accounting and Commerce",
  "ca intermediate group 2 advanced accounting mock test": "Accounting and Commerce",
  "cma intermediate financial accounting mock test": "Accounting and Commerce",
  "cs executive corporate and management accounting mock test": "Accounting and Commerce",
  "uppcl assistant accountant accounts mock test": "Accounting and Commerce",
  "state accountant and auditor exam mock test": "Accounting and Commerce",
  "tally erp 9 & gst professional practice mock test": "Accounting and Commerce",
  "ca foundation business laws mock test": "Accounting and Commerce",
  "cat (mba) mock test": "MBA Entrance Exam",
  "cmat (mba) mock test": "MBA Entrance Exam",
  "xat (mba) mock test": "MBA Entrance Exam",
  "mat (mba) mock test": "MBA Entrance Exam",
  "snap (mba) mock test": "MBA Entrance Exam",
  "nmat (mba) mock test": "MBA Entrance Exam",
  "mah cet (mba) mock test": "MBA Entrance Exam",
  "ibsat (mba) mock test": "MBA Entrance Exam",
  "tancet (mba) mock test": "MBA Entrance Exam",
  "general mba entrance mock test": "MBA Entrance Exam"
};

const getCategoryForCourse = (courseName) => {
  const name = courseName.toLowerCase();
  if (courseToCategory[name]) {
    return courseToCategory[name];
  }
  if (name.includes("state gk") || name.includes("gk")) {
    return "State GK";
  }
  if (name.includes("indian history") || name.includes("indian geography") || name.includes("indian polity") || name.includes("indian economy") || name.includes("indian environment") || name.includes("indian admin") || name.includes("indian sports") || name.includes("indian socialism") || name.includes("indian freedom")) {
    return "Indian Studies";
  }
  if (name.includes("aiims paramedical") || name.includes("pgimer paramedical") || name.includes("jipmer paramedical") || name.includes("cpet") || name.includes("jenpas") || name.includes("smfwbee") || name.includes("dcece") || name.includes("paramedical")) {
    return "Paramedical Exams";
  }
  if (name.includes("teaching") || name.includes("ctet") || name.includes("pedagogy") || name.includes("tet") || name.includes("prt") || name.includes("pgt") || name.includes("tgt") || name.includes("b.ed") || name.includes("m.ed")) {
    return "Teaching Exam";
  }
  if (name.includes("rbi") || name.includes("sebi") || name.includes("nabard") || name.includes("irdai") || name.includes("pfrda") || name.includes("sidbi") || name.includes("ifsca") || name.includes("ibbi")) {
    return "Regulatory Body Exams";
  }
  if (name.includes("mba") || name.includes("cat (mba)") || name.includes("cmat (mba)") || name.includes("xat (mba)") || name.includes("mat (mba)") || name.includes("snap") || name.includes("nmat") || name.includes("ibsat") || name.includes("tancet mba")) {
    return "MBA Entrance Exam";
  }
  if (name.includes("cuet pg") || name.includes("iit jam") || name.includes("gate") || name.includes("cat") || name.includes("cmat") || name.includes("xat") || name.includes("mat") || name.includes("neet pg") || name.includes("gpat") || name.includes("clat pg") || name.includes("nimcet")) {
    return "PG Entrance Exam";
  }
  if (name.includes("fitter") || name.includes("electrician") || name.includes("electronic mechanic") || name.includes("iti")) {
    return "ITI Exam";
  }
  if (name.includes("mechanical") || name.includes("civil engineering") || name.includes("electrical engineering") || name.includes("electronics &") || name.includes("computer science &") || name.includes("instrumentation")) {
    return "Engineering Test";
  }
  if (name.includes("neet")) {
    return "NEET";
  }
  if (name.includes("jee")) {
    return "JEE";
  }
  if (name.includes("net") || name.includes("set")) {
    return "NET/SET";
  }
  return "State Exam";
};

async function main() {
  const courses = await prisma.course.findMany({
    include: {
      testSeries: true
    }
  });
  console.log(`Fetched ${courses.length} courses from database.\n`);

  const categoryGroups = {};
  for (const course of courses) {
    const cat = getCategoryForCourse(course.name);
    if (!categoryGroups[cat]) {
      categoryGroups[cat] = [];
    }
    categoryGroups[cat].push(course);
  }

  let failed = false;

  for (const [catName, rule] of Object.entries(expectedCategories)) {
    const list = categoryGroups[catName] || [];
    console.log(`Category: "${catName}" -> Found ${list.length} courses.`);

    if (rule.count !== undefined && list.length !== rule.count) {
      console.error(`  [FAIL] Expected exactly ${rule.count} courses, but found ${list.length}.`);
      failed = true;
    } else if (rule.minCount !== undefined && list.length < rule.minCount) {
      console.error(`  [FAIL] Expected at least ${rule.minCount} courses, but found ${list.length}.`);
      failed = true;
    } else {
      console.log(`  [PASS] Course count matches requirements.`);
    }

    // Verify prices and sub-tests count
    let incorrectPriceCount = 0;
    let incorrectSubTestsCount = 0;
    for (const course of list) {
      const price = parseFloat(course.price.toString());
      if (rule.checkPrice && price !== 59.00) {
        incorrectPriceCount++;
        console.error(`  [FAIL] Course "${course.name}" has price ₹${price} instead of ₹59.`);
      }
      
      const subtestCount = course.testSeries.length;
      const nameLower = course.name.toLowerCase();
      const isSpecial20 = nameLower.includes("neet") || nameLower.includes("jee") || nameLower.includes("ugc net paper 1") || nameLower.includes("ugc net paper-1") || nameLower.includes("civil services") || nameLower.includes("upsc");
      if (isSpecial20 && subtestCount !== 20) {
        incorrectSubTestsCount++;
        console.error(`  [FAIL] Special course "${course.name}" has ${subtestCount} tests instead of 20.`);
      }
    }

    if (incorrectPriceCount > 0) {
      failed = true;
    }
    if (incorrectSubTestsCount > 0) {
      failed = true;
    }
  }

  // Also check if UGC NET Commerce is correctly mapped to NET/SET
  const ugcNetCommerce = courses.find(c => c.name.toLowerCase() === "ugc net commerce paper 2 mock test");
  if (ugcNetCommerce) {
    const cat = getCategoryForCourse(ugcNetCommerce.name);
    if (cat === "NET/SET") {
      console.log(`\n[PASS] UGC NET Commerce Paper 2 is correctly mapped to NET/SET category.`);
    } else {
      console.error(`\n[FAIL] UGC NET Commerce Paper 2 mapped to "${cat}" instead of "NET/SET".`);
      failed = true;
    }
  } else {
    console.error(`\n[FAIL] UGC NET Commerce Paper 2 Mock Test course not found in database.`);
    failed = true;
  }

  if (failed) {
    console.log("\nStatus: SOME VERIFICATIONS FAILED!");
    process.exit(1);
  } else {
    console.log("\nStatus: ALL VERIFICATIONS PASSED!");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
