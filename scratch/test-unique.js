const { Pool } = require('pg');

const localPool = new Pool({ connectionString: 'postgresql://postgres:postgres@localhost:5432/flarelap_foundation' });
const livePool = new Pool({ connectionString: 'postgresql://neondb_owner:npg_p3ERDLQ1JwNn@ep-crimson-salad-aopb5kye-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require' });

async function verify(name, pool) {
  const sample = await pool.query('SELECT course_id, question FROM mcq_questions LIMIT 1');
  const { course_id, question } = sample.rows[0];
  try {
    await pool.query(
      'INSERT INTO mcq_questions (course_id, question, options, answer) VALUES ($1, $2, $3, $4)',
      [course_id, question, ['Opt A', 'Opt B'], 0]
    );
    console.log(`[!] ${name}: Insert unexpectedly succeeded.`);
  } catch (err) {
    console.log(`[✓] ${name}: Successfully blocked duplicate! Postgres Code: ${err.code} | Message: ${err.message}`);
  }
}

async function main() {
  await verify('Local DB', localPool);
  await verify('Live Neon DB', livePool);
  await localPool.end();
  await livePool.end();
}

main();
