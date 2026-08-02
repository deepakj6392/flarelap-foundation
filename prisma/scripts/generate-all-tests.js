const fs = require("fs");
const path = require("path");

const courses = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../data/courses.json"), "utf8")
);

const mcqsDataDir = path.resolve(__dirname, "../data/mcqs-data");
if (!fs.existsSync(mcqsDataDir)) {
  fs.mkdirSync(mcqsDataDir, { recursive: true });
}

function getExamStats(courseName) {
  const name = courseName.toLowerCase();
  if (name.includes("neet") && !name.includes("allied")) {
    return { questions: 180, marks: 720, duration: 200, categoryKey: "neet_biology" };
  }
  if (name.includes("jee")) {
    return { questions: 90, marks: 300, duration: 180, categoryKey: "jee_math" };
  }
  if (name.includes("gate")) {
    return { questions: 65, marks: 100, duration: 180, categoryKey: "cs" };
  }
  if (name.includes("ssc cgl")) {
    return { questions: 100, marks: 200, duration: 60, categoryKey: "generic" };
  }
  if (name.includes("ctet")) {
    return { questions: 150, marks: 150, duration: 150, categoryKey: "ctet_paper_1_child_pedagogy" };
  }
  if (name.includes("web") || name.includes("html") || name.includes("css") || name.includes("javascript")) {
    return { questions: 50, marks: 50, duration: 60, categoryKey: "webdev" };
  }
  if (name.includes("computer") || name.includes("dsa") || name.includes("operating")) {
    return { questions: 50, marks: 50, duration: 60, categoryKey: "cs" };
  }
  if (name.includes("math") || name.includes("algebra") || name.includes("geometry")) {
    return { questions: 50, marks: 50, duration: 60, categoryKey: "math" };
  }
  if (name.includes("english")) {
    return { questions: 50, marks: 50, duration: 60, categoryKey: "english" };
  }
  return { questions: 100, marks: 100, duration: 90, categoryKey: "generic" };
}

function sanitizeFilename(name) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") + ".json"
  );
}

const allTestSeries = [];
let totalMCQFilesCreated = 0;

courses.forEach((course) => {
  const stats = getExamStats(course.name);
  const courseSanitized = course.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  // 1. 50 Full Mock Tests
  for (let i = 1; i <= 50; i++) {
    const testName = `${course.name} - Full Length Mock Test ${i}`;
    const tsObj = {
      name: testName,
      type: "Full Mock",
      qs: stats.questions,
      marks: stats.marks,
      duration: stats.duration,
      isFree: i <= 5,
      courseName: course.name,
    };
    allTestSeries.push(tsObj);

    const fileName = sanitizeFilename(testName);
    const filePath = path.join(mcqsDataDir, fileName);

    if (!fs.existsSync(filePath)) {
      const fileData = {
        name: testName,
        type: "Full Mock",
        courseName: course.name,
        qs: stats.questions,
        marks: stats.marks,
        duration: stats.duration,
        isFree: i <= 5,
        categoryKey: stats.categoryKey,
        questions: [],
      };
      fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), "utf8");
      totalMCQFilesCreated++;
    }
  }

  // 2. 30 Subject Tests
  for (let i = 1; i <= 30; i++) {
    const testName = `${course.name} - Subject Test ${i}`;
    const tsObj = {
      name: testName,
      type: "Subject Test",
      qs: Math.round(stats.questions * 0.4),
      marks: Math.round(stats.marks * 0.4),
      duration: Math.round(stats.duration * 0.4),
      isFree: i <= 3,
      courseName: course.name,
    };
    allTestSeries.push(tsObj);

    const fileName = sanitizeFilename(testName);
    const filePath = path.join(mcqsDataDir, fileName);

    if (!fs.existsSync(filePath)) {
      const fileData = {
        name: testName,
        type: "Subject Test",
        courseName: course.name,
        qs: tsObj.qs,
        marks: tsObj.marks,
        duration: tsObj.duration,
        isFree: i <= 3,
        categoryKey: stats.categoryKey,
        questions: [],
      };
      fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), "utf8");
      totalMCQFilesCreated++;
    }
  }

  // 3. 30 Chapter Tests
  for (let i = 1; i <= 30; i++) {
    const testName = `${course.name} - Chapter Test ${i}`;
    const tsObj = {
      name: testName,
      type: "Chapter Test",
      qs: Math.round(stats.questions * 0.25),
      marks: Math.round(stats.marks * 0.25),
      duration: Math.round(stats.duration * 0.25),
      isFree: i <= 3,
      courseName: course.name,
    };
    allTestSeries.push(tsObj);

    const fileName = sanitizeFilename(testName);
    const filePath = path.join(mcqsDataDir, fileName);

    if (!fs.existsSync(filePath)) {
      const fileData = {
        name: testName,
        type: "Chapter Test",
        courseName: course.name,
        qs: tsObj.qs,
        marks: tsObj.marks,
        duration: tsObj.duration,
        isFree: i <= 3,
        categoryKey: stats.categoryKey,
        questions: [],
      };
      fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), "utf8");
      totalMCQFilesCreated++;
    }
  }

  // 4. 10 Previous Year Papers (PYPs 2016-2025)
  for (let i = 0; i < 10; i++) {
    const year = 2016 + i;
    const testName = `${course.name} - Previous Year Paper (${year} Exam)`;
    const tsObj = {
      name: testName,
      type: "PYP",
      qs: stats.questions,
      marks: stats.marks,
      duration: stats.duration,
      isFree: i === 9, // 2025 paper free
      courseName: course.name,
    };
    allTestSeries.push(tsObj);

    const fileName = sanitizeFilename(testName);
    const filePath = path.join(mcqsDataDir, fileName);

    if (!fs.existsSync(filePath)) {
      const fileData = {
        name: testName,
        type: "PYP",
        courseName: course.name,
        qs: stats.questions,
        marks: stats.marks,
        duration: stats.duration,
        isFree: i === 9,
        categoryKey: stats.categoryKey,
        questions: [],
      };
      fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), "utf8");
      totalMCQFilesCreated++;
    }
  }
});

// Write updated test-series.json
const testSeriesPath = path.resolve(__dirname, "../data/test-series.json");
fs.writeFileSync(testSeriesPath, JSON.stringify(allTestSeries, null, 2), "utf8");

console.log(`✅ Generated ${allTestSeries.length} test series across ${courses.length} courses!`);
console.log(`📁 Total new MCQ JSON files created: ${totalMCQFilesCreated}`);
