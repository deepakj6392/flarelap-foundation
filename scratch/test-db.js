const { Pool } = require('pg');

const dbUrl = "postgresql://neondb_owner:npg_p3ERDLQ1JwNn@ep-crimson-salad-aopb5kye-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";
console.log('Testing raw pg connection to:', dbUrl);

const pool = new Pool({
  connectionString: dbUrl,
  connectionTimeoutMillis: 60000 // 60s
});

async function main() {
  try {
    console.log('Connecting and querying...');
    const client = await pool.connect();
    console.log('Connected! Executing query...');
    const res = await client.query('SELECT 1 as result');
    console.log('Success! Result:', res.rows);
    client.release();
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    await pool.end();
  }
}

main();
