const { Pool } = require("pg");
require("dotenv").config({ path: ".env" });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function addUserDobAndAddress() {
  const client = await pool.connect();
  try {
    console.log("🔌 Connected to database...");

    await client.query("BEGIN");

    // Add dob column (VARCHAR) if it doesn't exist
    const dobCheck = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'dob'
    `);

    if (dobCheck.rows.length === 0) {
      await client.query(`ALTER TABLE users ADD COLUMN dob VARCHAR(255)`);
      console.log("✅ Column 'dob' added to users table.");
    } else {
      console.log("⚠️  Column 'dob' already exists — skipping.");
    }

    // Add address column (TEXT) if it doesn't exist
    const addressCheck = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'address'
    `);

    if (addressCheck.rows.length === 0) {
      await client.query(`ALTER TABLE users ADD COLUMN address TEXT`);
      console.log("✅ Column 'address' added to users table.");
    } else {
      console.log("⚠️  Column 'address' already exists — skipping.");
    }

    await client.query("COMMIT");
    console.log("\n🎉 Migration completed successfully.");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Migration failed — rolled back:", err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

addUserDobAndAddress();
