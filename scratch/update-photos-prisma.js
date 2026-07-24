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
    console.log("Updating profile_photo for all volunteers in Neon database via serverless WebSocket pool...");
    const res = await pool.query(
      `UPDATE "volunteers" SET "profile_photo" = '/default-volunteer-photo.jpg'`
    );
    console.log(`Successfully updated ${res.rowCount} volunteers with default profile photo '/default-volunteer-photo.jpg'!`);
  } catch (err) {
    console.error("Database update error:", err);
  } finally {
    await pool.end();
  }
}

main();
