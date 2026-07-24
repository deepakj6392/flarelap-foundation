const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const { neonConfig, Pool } = require("@neondatabase/serverless");
const ws = require("ws");

neonConfig.webSocketConstructor = ws;

const DEFAULT_DESIGNATIONS = [
  "Volunteer",
  "Member",
  "Director",
  "Supervisor",
  "Secretary",
  "Founder",
  "Chairman",
  "President",
  "Vice-President",
  "Treasurer",
  "Executive Director",
  "CEO",
  "Program Coordinator",
  "General Secretary",
  "Field Worker",
  "Watchman",
  "Security Guard",
  "Executive Officer"
];

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL not found!");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl });

  try {
    console.log("Creating 'designations' table in Neon database...");
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "designations" (
        "id" SERIAL PRIMARY KEY,
        "title" VARCHAR(255) UNIQUE NOT NULL,
        "status" VARCHAR(50) DEFAULT 'ACTIVE',
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log("Table 'designations' created successfully!");

    console.log("Seeding default designations...");
    for (const title of DEFAULT_DESIGNATIONS) {
      await pool.query(
        `INSERT INTO "designations" ("title", "status") VALUES ($1, 'ACTIVE') ON CONFLICT ("title") DO NOTHING;`,
        [title]
      );
    }
    console.log("Default designations seeded successfully!");
  } catch (err) {
    console.error("Database DDL error:", err);
  } finally {
    await pool.end();
  }
}

main();
