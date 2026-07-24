const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const { neonConfig, Pool } = require("@neondatabase/serverless");
const ws = require("ws");

neonConfig.webSocketConstructor = ws;

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL not found!");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl });

  try {
    console.log("Adding 'designation' column to 'volunteers' table in Neon database...");
    await pool.query(
      `ALTER TABLE "volunteers" ADD COLUMN IF NOT EXISTS "designation" TEXT DEFAULT 'Volunteer';`
    );
    console.log("Successfully added 'designation' column to live Neon DB!");
  } catch (err) {
    console.error("Database DDL error:", err);
  } finally {
    await pool.end();
  }
}

main();
