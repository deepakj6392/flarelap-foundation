const { Pool } = require('pg');

const liveDbUrl = "postgresql://neondb_owner:npg_p3ERDLQ1JwNn@ep-crimson-salad-aopb5kye-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
const localDbUrl = "postgresql://postgres:postgres@localhost:5432/flarelap_foundation";

const livePool = new Pool({ connectionString: liveDbUrl });
const localPool = new Pool({ connectionString: localDbUrl });

const tables = [
  'categories',
  'courses',
  'users',
  'contacts',
  'newsletter',
  'donations',
  'gallery_images',
  'site_settings',
  'team_members',
  'blog_posts',
  'volunteers',
  'designations',
  'volunteer_mail_logs',
  'student_logs',
  'mcq_questions',
  'test_series',
  'purchases',
  'test_attempts',
  'user_logs'
];

async function syncTable(table) {
  console.log(`\n[+] Truncating local table '${table}'...`);
  await localPool.query(`TRUNCATE TABLE "${table}" CASCADE;`);

  console.log(`[+] Fetching rows from Live DB for table '${table}'...`);
  const liveRowsRes = await livePool.query(`SELECT * FROM "${table}" ORDER BY id ASC;`);
  const rows = liveRowsRes.rows;
  console.log(`[+] Total rows to copy for '${table}': ${rows.length}`);

  if (rows.length === 0) return;

  const columns = Object.keys(rows[0]);
  const colNames = columns.map(c => `"${c}"`).join(', ');

  const BATCH_SIZE = 500;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const valuePlaceholders = [];
    const values = [];

    let paramIdx = 1;
    for (const row of batch) {
      const rowPlaceholders = [];
      for (const col of columns) {
        rowPlaceholders.push(`$${paramIdx++}`);
        values.push(row[col]);
      }
      valuePlaceholders.push(`(${rowPlaceholders.join(', ')})`);
    }

    const query = `INSERT INTO "${table}" (${colNames}) VALUES ${valuePlaceholders.join(', ')};`;
    await localPool.query(query, values);
    console.log(`   Processed ${Math.min(i + BATCH_SIZE, rows.length)} / ${rows.length} rows for '${table}'`);
  }

  // Reset auto-increment sequence
  try {
    await localPool.query(`
      SELECT setval(pg_get_serial_sequence('"${table}"', 'id'), COALESCE((SELECT MAX(id) FROM "${table}"), 1));
    `);
  } catch (err) {
    // Some tables might not have standard serial id, ignore
  }

  console.log(`[✓] Table '${table}' sync completed.`);
}

async function main() {
  console.log("=== STARTING LIVE DB TO LOCAL DB DATA COPY ===");
  const startTime = Date.now();

  try {
    for (const table of tables) {
      await syncTable(table);
    }
    console.log(`\n🎉 SUCCESS! All tables copied from Live DB to Local DB in ${((Date.now() - startTime) / 1000).toFixed(2)}s.`);
  } catch (error) {
    console.error("\n❌ ERROR during migration:", error);
  } finally {
    await livePool.end();
    await localPool.end();
  }
}

main();
