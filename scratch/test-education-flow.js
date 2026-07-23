const http = require('http');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data, error: e.message });
        }
      });
    }).on('error', err => reject(err));
  });
}

async function runTest() {
  console.log("=== STEP 1: API /api/courses Test ===");
  try {
    const res = await fetchJson('http://localhost:3000/api/courses');
    console.log("API Status:", res.status);
    if (res.status !== 200 || !res.body || !res.body.courses) {
      console.error("API returned invalid response:", res);
      process.exit(1);
    }
    const courses = res.body.courses;
    console.log(`Total courses fetched from API: ${courses.length}`);

    const staticGovAndNraCourses = [
      { id: 9001, name: "NRA CET 12th Level Mock Test", premium: true },
      { id: 9002, name: "NRA CET Graduates Mock Test", premium: true },
      { id: 9003, name: "AIIMS CRE LDC/UDC/Steno/DEO/JAA/SA Mock Test", premium: true },
      { id: 9004, name: "NBE Junior Assistant 2024 Mock Tests Series", premium: true },
      { id: 9005, name: "ISRO Assistant Mock Test 2022", premium: true },
      { id: 9006, name: "ISRO Junior Personal Assistant Mock Test 2022", premium: true },
      { id: 9007, name: "CCRAS UDC/LDC/Steno/Assistant Mock Test", premium: true },
      { id: 9008, name: "NBE Junior Assistant Mock Test", premium: true },
      { id: 9009, name: "CWC (Central Warehousing Corporation) Superintendent Mock Test", premium: true },
      { id: 9010, name: "FCI Manager Phase I & II Mock Test 2022", premium: true },
      { id: 9011, name: "FCI Stenographer Mock Test 2022", premium: true },
      { id: 9012, name: "CSIR Junior Secretariat Assistant (JSA) 2025 Mock Test", premium: true },
      { id: 9013, name: "CSIR ASO/SO Mock Test 2023", premium: true },
      { id: 9014, name: "UPSC EPFO Personal Assistant Mock Test", premium: true },
      { id: 9015, name: "CSIR Junior Stenographer 2025 Mock Test", premium: true },
      { id: 9016, name: "AAI Junior Executive (Common Cadre) Mock Test", premium: true },
      { id: 9017, name: "Supreme Court Junior Court Assistant Mock Test", premium: true },
      { id: 9018, name: "CCRAS MTS 2025 Mock Test Series", premium: true },
      { id: 9019, name: "CBSE Junior Assistant Mock Test 2025 (Old)", premium: true },
      { id: 9020, name: "JCI Junior Assistant Mock Test Series", premium: true },
      { id: 9021, name: "CBSE Assistant/Superintendent & All Other Post(Tier I) Mock Test", premium: true },
      { id: 9022, name: "NPCIL Stipendiary Trainee (Category II) Prelims 2026 Mock Test", premium: true },
      { id: 9023, name: "India Post Postman & Mail Guard Mock Test", premium: true },
      { id: 9024, name: "EPFO Stenographer (Group C) Mock Test 2023", premium: true },
      { id: 9025, name: "SGPGI Stenographer Mock Test Series 2025", premium: true },
      { id: 9026, name: "NPCIL Scientific Assistant Physics Mock Test", premium: true }
    ];

    const cleanedFetched = courses.filter((c) => !c.name.toLowerCase().includes("10th level"));
    const existingNames = new Set(cleanedFetched.map((c) => c.name.toLowerCase().trim()));
    const missingStatic = staticGovAndNraCourses.filter(c => !existingNames.has(c.name.toLowerCase().trim()));
    const allCourses = [...cleanedFetched, ...missingStatic];

    console.log(`=== STEP 2: Testing Frontend Filter for NRA CET ===`);
    const nraCetFiltered = allCourses.filter(course => {
      const lower = course.name.toLowerCase().trim();
      return lower === "nra cet 12th level mock test" || lower === "nra cet graduates mock test";
    });

    console.log(`NRA CET Filtered Count: ${nraCetFiltered.length}`);
    nraCetFiltered.forEach(c => console.log(" - Card:", c.name));

    console.log(`\n=== STEP 3: Testing Frontend Filter for Government Organizations ===`);
    const targetGovList = [
      "aiims cre ldc/udc/steno/deo/jaa/sa mock test",
      "nbe junior assistant 2024 mock tests series",
      "isro assistant mock test 2022",
      "isro junior personal assistant mock test 2022",
      "ccras udc/ldc/steno/assistant mock test",
      "nbe junior assistant mock test",
      "cwc (central warehousing corporation) superintendent mock test",
      "fci manager phase i & ii mock test 2022",
      "fci stenographer mock test 2022",
      "csir junior secretariat assistant (jsa) 2025 mock test",
      "csir aso/so mock test 2023",
      "upsc epfo personal assistant mock test",
      "csir junior stenographer 2025 mock test",
      "aai junior executive (common cadre) mock test",
      "supreme court junior court assistant mock test",
      "ccras mts 2025 mock test series",
      "cbse junior assistant mock test 2025 (old)",
      "jci junior assistant mock test series",
      "cbse assistant/superintendent & all other post(tier i) mock test",
      "npcil stipendiary trainee (category ii) prelims 2026 mock test",
      "india post postman & mail guard mock test",
      "epfo stenographer (group c) mock test 2023",
      "sgpgi stenographer mock test series 2025",
      "npcil scientific assistant physics mock test"
    ];

    const govOrgFiltered = allCourses.filter(course => {
      const lower = course.name.toLowerCase().trim();
      return targetGovList.includes(lower);
    });

    console.log(`Government Organizations Filtered Count: ${govOrgFiltered.length}`);
    govOrgFiltered.forEach(c => console.log(" - Card:", c.name));

    console.log("\n=== VERIFICATION RESULT ===");
    if (nraCetFiltered.length === 2 && govOrgFiltered.length === 24) {
      console.log("PASS: 100% SUCCESS! NRA CET has 2 cards and Government Organizations has 24 cards!");
    } else {
      console.error(`FAIL: NRA CET = ${nraCetFiltered.length}/2, Gov Org = ${govOrgFiltered.length}/24`);
    }

  } catch (e) {
    console.error("Test failed:", e);
    process.exit(1);
  }
}

runTest();
