const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const { Pool } = require("pg");

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("DATABASE_URL not found!");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log("Updating profile_photo for all volunteers in Neon database...");
    const res = await pool.query(
      `UPDATE "volunteers" SET "profile_photo" = '/default-volunteer-photo.jpg' WHERE "profile_photo" IS NULL OR "profile_photo" = '' OR "profile_photo" LIKE '/%'`
    );
    console.log(`Successfully updated ${res.rowCount} volunteers with default profile photo '/default-volunteer-photo.jpg'!`);
  } catch (err) {
    console.error("Database update error:", err);
  } finally {
    await pool.end();
  }
}

main();
