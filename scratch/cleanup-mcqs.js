const { Pool } = require('pg');

const localDbUrl = "postgresql://postgres:postgres@localhost:5432/flarelap_foundation";
const liveDbUrl = "postgresql://neondb_owner:npg_p3ERDLQ1JwNn@ep-crimson-salad-aopb5kye-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

async function cleanupDb(dbName, connectionString) {
  console.log(`\n========================================`);
  console.log(` Starting MCQ Cleanup for: ${dbName}`);
  console.log(`========================================`);

  const pool = new Pool({ connectionString });

  try {
    const res = await pool.query('SELECT id, course_id, question FROM mcq_questions ORDER BY id ASC');
    const rows = res.rows;
    console.log(`[+] Current total MCQs in ${dbName}: ${rows.length}`);

    const seen = new Map();
    const deleteIds = [];

    for (const row of rows) {
      let cleanQ = row.question.replace(/^\[.*?\]\s*/, '').trim();
      const key = `${row.course_id}||${cleanQ}`;

      if (!seen.has(key)) {
        seen.set(key, row.id);
      } else {
        deleteIds.push(row.id);
      }
    }

    console.log(`[+] Duplicate MCQs remaining to delete: ${deleteIds.length}`);

    // 1. Delete duplicate rows in batches
    if (deleteIds.length > 0) {
      const BATCH_SIZE = 1000;
      for (let i = 0; i < deleteIds.length; i += BATCH_SIZE) {
        const batch = deleteIds.slice(i, i + BATCH_SIZE);
        await pool.query(`DELETE FROM mcq_questions WHERE id = ANY($1::int[])`, [batch]);
        console.log(`   Deleted batch ${i + batch.length} / ${deleteIds.length} duplicate MCQs`);
      }
    }

    // 2. Strip bracket tags from remaining question texts
    console.log(`[+] Updating question texts to strip bracket prefixes...`);
    const updateRes = await pool.query(`
      UPDATE mcq_questions
      SET question = REGEXP_REPLACE(question, '^\\[.*?\\]\\s*', '')
      WHERE question LIKE '[%';
    `);
    console.log(`[+] Strip prefix updated ${updateRes.rowCount} question texts.`);

    const finalCountRes = await pool.query('SELECT COUNT(*) FROM mcq_questions');
    console.log(`[✓] SUCCESS! Final unique & cleaned MCQ count in ${dbName}: ${finalCountRes.rows[0].count}`);

  } catch (error) {
    console.error(`❌ Error cleaning up ${dbName}:`, error);
  } finally {
    await pool.end();
  }
}

async function main() {
  await cleanupDb("Local Database (localhost:5432)", localDbUrl);
  await cleanupDb("Live Neon Database", liveDbUrl);
}

main();
