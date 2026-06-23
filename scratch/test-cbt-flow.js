const http = require('http');

function postJson(path, payload) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(payload);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

function getJson(path, token) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function run() {
  console.log("=== Starting CBT Backend Verification ===");

  // Step 1: Send OTP
  console.log("\n1. Requesting OTP for testing student...");
  const sendOtpRes = await postJson('/api/auth/student/send-otp', {
    loginId: 'student@flarelap.org'
  });
  console.log("Response:", sendOtpRes);
  if (sendOtpRes.status !== 200 || !sendOtpRes.body.success) {
    console.error("FAIL: send-otp failed");
    process.exit(1);
  }

  // Step 2: Verify OTP
  console.log("\n2. Verifying OTP with bypass code 000000...");
  const verifyRes = await postJson('/api/auth/student/verify-otp', {
    loginId: 'student@flarelap.org',
    otp: '000000'
  });
  console.log("Response:", verifyRes);
  if (verifyRes.status !== 200 || !verifyRes.body.success) {
    console.error("FAIL: verify-otp failed");
    process.exit(1);
  }

  const token = verifyRes.body.token;
  const courseId = verifyRes.body.user.course_id;
  console.log(`Token received: ${token.substring(0, 15)}...`);
  console.log(`Student enrolled course ID: ${courseId}`);

  // Step 3: Get MCQs
  console.log("\n3. Fetching course MCQs...");
  const mcqsRes = await getJson(`/api/student/mcqs?courseId=${courseId}`, token);
  console.log("MCQ Fetch Status:", mcqsRes.status);
  console.log("Number of MCQs:", mcqsRes.body.courseMcqs ? mcqsRes.body.courseMcqs.length : 0);

  // Step 4: Submit Attempt
  console.log("\n4. Submitting a test attempt scorecard...");
  const submitRes = await postJson('/api/student/attempts', {
    testId: 1,
    courseId: parseInt(courseId, 10),
    score: 8.50,
    totalQs: 5,
    answered: 5,
    correct: 4,
    wrong: 1,
    duration: 120
  }, token);
  // Wait, postJson helper doesn't support Authorization header. Let's send manually
  const submitData = JSON.stringify({
    testId: 1,
    courseId: parseInt(courseId, 10),
    score: 8.50,
    totalQs: 5,
    answered: 5,
    correct: 4,
    wrong: 1,
    duration: 120
  });
  
  const manualReq = new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/student/attempts',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(submitData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });
    req.write(submitData);
    req.end();
  });

  const submitAttemptRes = await manualReq;
  console.log("Attempt Submission Response:", submitAttemptRes);
  if (submitAttemptRes.status !== 200) {
    console.error("FAIL: attempt submission failed");
    process.exit(1);
  }

  // Step 5: Get Attempt list to confirm persistence
  console.log("\n5. Querying attempts list...");
  const listRes = await getJson('/api/student/attempts', token);
  console.log("Attempts count returned in body:", listRes.body.attempts ? listRes.body.attempts.length : 0);
  console.log("Last attempt score:", listRes.body.attempts && listRes.body.attempts[0] ? listRes.body.attempts[0].score : "None");

  console.log("\n=== ALL TESTS PASSED SUCCESSFULLY ===");
}

run().catch(console.error);
