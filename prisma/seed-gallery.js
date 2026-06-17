const { Pool } = require("pg");
require("dotenv").config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("DATABASE_URL is not set inside .env.local!");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

const images = [
  {
    image_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80",
    caption: "Vidya Digital Literacy Drive - Learning computer basics"
  },
  {
    image_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
    caption: "Our newly established computer lab inside tier-3 sectors"
  },
  {
    image_url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80",
    caption: "Swasthya preventive health camp check-ups"
  },
  {
    image_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
    caption: "Self-employment training and skill mentoring summit"
  },
  {
    image_url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
    caption: "Community relief kit supplies distribution drive"
  },
  {
    image_url: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80",
    caption: "Shiksha scholarship kit distributions"
  },
  {
    image_url: "https://images.unsplash.com/photo-1559027615-cd44874e96e4?auto=format&fit=crop&w=800&q=80",
    caption: "Our dedicated group of social impact volunteers"
  }
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log("Seeding gallery images to database...");
    
    // Clear existing images to avoid duplicates
    await client.query("DELETE FROM gallery_images");
    
    for (const img of images) {
      await client.query(
        "INSERT INTO gallery_images (image_url, caption, created_at) VALUES ($1, $2, NOW())",
        [img.image_url, img.caption]
      );
      console.log(`Inserted: ${img.caption}`);
    }
    console.log("Database seeded successfully with 7 foundation images!");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
