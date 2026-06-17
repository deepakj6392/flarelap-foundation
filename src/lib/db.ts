import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  host: process.env.PGHOST || process.env.DB_HOST || "localhost",
  port: parseInt(process.env.PGPORT || process.env.DB_PORT || "5432"),
  database: process.env.PGDATABASE || process.env.DB_NAME || "flarelap_foundation",
  user: process.env.PGUSER || process.env.DB_USER || "flarelap_foundation",
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD || "Admin#Foundation@123",
  ssl: process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : undefined,
});

let initialized = false;

export async function initDb() {
  if (initialized) return;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure name column exists (in case table was created previously without name)
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255);
    `);

    // Ensure OTP columns exist for forgot password flow
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_code VARCHAR(10);
    `);
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS otp_expires_at TIMESTAMP;
    `);

    // Ensure TFA columns exist for two-factor authentication flow
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS tfa_enabled BOOLEAN DEFAULT FALSE;
    `);
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS tfa_code VARCHAR(10);
    `);
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS tfa_expires_at TIMESTAMP;
    `);

    // Ensure Student ID column exists for student role
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS student_id VARCHAR(50) UNIQUE;
    `);

    // Ensure phone column exists for student details
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50);
    `);

    // Ensure temp_password column exists for student administration
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS temp_password VARCHAR(255);
    `);

    // Create contacts table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        post VARCHAR(255) DEFAULT 'Foundation Inquiry',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create newsletter table
    await client.query(`
      CREATE TABLE IF NOT EXISTS newsletter (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create donations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS donations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        amount DECIMAL(12, 2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        transaction_id VARCHAR(100),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Delete old default admin user if present
    await client.query("DELETE FROM users WHERE email = $1", ["admin@flarelap.com"]);

    // Seed default admin user
    const defaultEmail = "flarelap.org@gmail.com";
    const checkUser = await client.query("SELECT * FROM users WHERE email = $1", [defaultEmail]);
    if (checkUser.rowCount === 0) {
      const defaultPassword = "Admin#Foundation@123";
      const hashedPassword = bcrypt.hashSync(defaultPassword, 10);
      await client.query(
        "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)",
        ["Super Admin", defaultEmail, hashedPassword, "super_admin"]
      );
      console.log("Seeded super_admin account successfully with email flarelap.org@gmail.com.");
    } else {
      await client.query(
        "UPDATE users SET name = $1, role = $2 WHERE email = $3",
        ["Super Admin", "super_admin", defaultEmail]
      );
    }

    await client.query("COMMIT");
    initialized = true;
    console.log("Database schema checked/initialized successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to initialize database schema:", error);
    throw error;
  } finally {
    client.release();
  }
}

export async function query(text: string, params?: any[]) {
  if (!initialized) {
    await initDb();
  }
  return pool.query(text, params);
}
