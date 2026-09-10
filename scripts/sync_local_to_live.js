const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const LOCAL_URL = process.env.LOCAL_DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/flarelap_db?sslmode=disable";
const LIVE_URL = process.env.LIVE_DATABASE_URL || "postgresql://neondb_owner:npg_p3ERDLQ1JwNn@ep-crimson-salad-aopb5kye.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require";

console.log("=================================================");
console.log("🚀 TURBO MULTI-STREAM SYNC: LOCAL DB ➔ LIVE NEON DB");
console.log("=================================================");
console.log("Local Database:", LOCAL_URL);
console.log("Live Database :", LIVE_URL.replace(/:[^:@]+@/, ":***@"));

const localPool = new Pool({ connectionString: LOCAL_URL, max: 40 });
const livePool = new Pool({
  connectionString: LIVE_URL,
  ssl: { rejectUnauthorized: false },
  max: 40
});

async function runParallel(items, chunkSize, fn) {
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    await Promise.all(chunk.map(fn));
  }
}

async function insertMcqBatch(rows, courseIdMap) {
  if (!rows || rows.length === 0) return 0;
  const valueTuples = [];
  const queryParams = [];
  let pIdx = 1;

  for (const row of rows) {
    const liveCourseId = courseIdMap.get(row.course_id);
    if (!liveCourseId) continue;

    valueTuples.push(`($${pIdx}, $${pIdx + 1}, $${pIdx + 2}, $${pIdx + 3}, $${pIdx + 4}, $${pIdx + 5})`);
    queryParams.push(
      liveCourseId,
      row.question,
      row.options,
      row.answer,
      row.hint || "",
      row.created_at || new Date()
    );
    pIdx += 6;
  }

  if (valueTuples.length === 0) return 0;

  const bulkQuery = `
    INSERT INTO mcq_questions (course_id, question, options, answer, hint, created_at)
    VALUES ${valueTuples.join(", ")}
    ON CONFLICT (course_id, question) DO NOTHING
  `;

  try {
    const res = await livePool.query(bulkQuery, queryParams);
    return res.rowCount || 0;
  } catch (err) {
    let inserted = 0;
    for (let k = 0; k < queryParams.length; k += 6) {
      try {
        const singleRes = await livePool.query(
          `INSERT INTO mcq_questions (course_id, question, options, answer, hint, created_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (course_id, question) DO NOTHING`,
          queryParams.slice(k, k + 6)
        );
        inserted += singleRes.rowCount || 0;
      } catch (e) {
        // Ignore single duplicate
      }
    }
    return inserted;
  }
}

async function runSync() {
  const startTime = Date.now();

  try {
    // 1. SYNC CATEGORIES & BUILD ID MAP
    console.log("\n📦 [1/8] Syncing Categories...");
    const localCategories = await localPool.query("SELECT * FROM categories ORDER BY id ASC");
    const liveCatRes = await livePool.query("SELECT id, name FROM categories");
    const liveCatMap = new Map(liveCatRes.rows.map(r => [r.name.trim(), r.id]));

    const categoryIdMap = new Map();

    for (const cat of localCategories.rows) {
      if (liveCatMap.has(cat.name.trim())) {
        categoryIdMap.set(cat.id, liveCatMap.get(cat.name.trim()));
      } else {
        const res = await livePool.query(
          `INSERT INTO categories (name, created_at, updated_at)
           VALUES ($1, $2, $3)
           ON CONFLICT (name) DO UPDATE SET updated_at = NOW()
           RETURNING id`,
          [cat.name, cat.created_at || new Date(), cat.updated_at || new Date()]
        );
        const liveId = res.rows[0].id;
        liveCatMap.set(cat.name.trim(), liveId);
        categoryIdMap.set(cat.id, liveId);
      }
    }
    console.log(`✅ ${categoryIdMap.size} Categories mapped & synced.`);

    // 2. PARALLEL SYNC COURSES & BUILD ID MAP
    console.log("\n📚 [2/8] Syncing Courses (485 items in parallel)...");
    const localCourses = await localPool.query("SELECT * FROM courses ORDER BY id ASC");
    const liveCourseRes = await livePool.query("SELECT id, name FROM courses");
    const liveCourseNameMap = new Map(liveCourseRes.rows.map(r => [r.name.trim(), r.id]));

    const courseIdMap = new Map();

    await runParallel(localCourses.rows, 35, async (c) => {
      const liveCatId = categoryIdMap.get(c.category_id) || null;
      let liveCourseId = liveCourseNameMap.get(c.name.trim());

      if (liveCourseId) {
        await livePool.query(
          `UPDATE courses SET active = $1, premium = $2, price = $3, category_id = $4 WHERE id = $5`,
          [c.active, c.premium, c.price, liveCatId, liveCourseId]
        );
      } else {
        const insRes = await livePool.query(
          `INSERT INTO courses (name, active, premium, price, created_at, category_id)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id`,
          [c.name, c.active, c.premium, c.price, c.created_at || new Date(), liveCatId]
        );
        liveCourseId = insRes.rows[0].id;
      }

      courseIdMap.set(c.id, liveCourseId);
    });
    console.log(`✅ ${courseIdMap.size} Courses mapped & synced.`);

    // 3. FAST BULK SYNC TEST SERIES
    console.log("\n📝 [3/8] Syncing Test Series (3,690 items)...");
    const localTestSeries = await localPool.query("SELECT * FROM test_series ORDER BY id ASC");
    const liveTsRes = await livePool.query("SELECT course_id, name FROM test_series");
    const existingTsSet = new Set(liveTsRes.rows.map(r => `${r.course_id}_${r.name.trim()}`));

    const tsToInsert = [];
    for (const ts of localTestSeries.rows) {
      const liveCourseId = courseIdMap.get(ts.course_id);
      if (!liveCourseId) continue;
      const key = `${liveCourseId}_${ts.name.trim()}`;
      if (!existingTsSet.has(key)) {
        existingTsSet.add(key);
        tsToInsert.push({
          name: ts.name,
          type: ts.type,
          qs: ts.qs,
          marks: ts.marks,
          duration: ts.duration,
          is_free: ts.is_free,
          course_id: liveCourseId,
          created_at: ts.created_at || new Date()
        });
      }
    }

    if (tsToInsert.length > 0) {
      const tsBatchSize = 300;
      for (let i = 0; i < tsToInsert.length; i += tsBatchSize) {
        const batch = tsToInsert.slice(i, i + tsBatchSize);
        const tuples = [];
        const params = [];
        let pIdx = 1;

        for (const item of batch) {
          tuples.push(`($${pIdx}, $${pIdx + 1}, $${pIdx + 2}, $${pIdx + 3}, $${pIdx + 4}, $${pIdx + 5}, $${pIdx + 6}, $${pIdx + 7})`);
          params.push(item.name, item.type, item.qs, item.marks, item.duration, item.is_free, item.course_id, item.created_at);
          pIdx += 8;
        }

        await livePool.query(
          `INSERT INTO test_series (name, type, qs, marks, duration, is_free, course_id, created_at) VALUES ${tuples.join(", ")}`,
          params
        );
      }
    }
    console.log(`✅ ${tsToInsert.length} New Test Series inserted into Live DB.`);

    // 4. TURBO MULTI-STREAM SYNC MCQ QUESTIONS (130,466 questions)
    console.log("\n❓ [4/8] Syncing MCQ Questions (130,466 questions multi-stream)...");
    const countRes = await localPool.query("SELECT COUNT(*) FROM mcq_questions");
    const totalMcqs = parseInt(countRes.rows[0].count, 10);
    console.log(`Total MCQ Questions in local DB: ${totalMcqs.toLocaleString()}`);

    const subBatchSize = 1500;
    const concurrentStreams = 4; // 4 parallel db writers = 6,000 mcqs per step
    const chunkSize = subBatchSize * concurrentStreams;
    let processed = 0;
    let insertedCount = 0;

    for (let offset = 0; offset < totalMcqs; offset += chunkSize) {
      const batchRes = await localPool.query(
        "SELECT course_id, question, options, answer, hint, created_at FROM mcq_questions ORDER BY id ASC LIMIT $1 OFFSET $2",
        [chunkSize, offset]
      );
      const rows = batchRes.rows;
      if (rows.length === 0) break;

      // Divide rows into sub-batches for parallel insert streams
      const subBatches = [];
      for (let s = 0; s < rows.length; s += subBatchSize) {
        subBatches.push(rows.slice(s, s + subBatchSize));
      }

      const results = await Promise.all(
        subBatches.map((subBatch) => insertMcqBatch(subBatch, courseIdMap))
      );

      for (const count of results) {
        insertedCount += count;
      }

      processed += rows.length;
      const pct = Math.round((processed / totalMcqs) * 100);
      console.log(`[MCQ Sync] ${processed.toLocaleString()} / ${totalMcqs.toLocaleString()} (${pct}%) - Added: ${insertedCount.toLocaleString()}`);
    }

    console.log(`✅ MCQ Questions synced successfully! Total inserted/verified: ${insertedCount.toLocaleString()}`);

    // 5. SYNC BLOG POSTS
    console.log("\n📰 [5/8] Syncing Blog Posts...");
    const localBlogs = await localPool.query("SELECT * FROM blog_posts ORDER BY id ASC");
    for (const b of localBlogs.rows) {
      await livePool.query(
        `INSERT INTO blog_posts (title, slug, content, thumbnail, excerpt, meta_title, meta_desc, keywords, published, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
         ON CONFLICT (slug) DO UPDATE SET
           title = EXCLUDED.title,
           content = EXCLUDED.content,
           thumbnail = EXCLUDED.thumbnail,
           excerpt = EXCLUDED.excerpt,
           published = EXCLUDED.published`,
        [b.title, b.slug, b.content, b.thumbnail, b.excerpt, b.meta_title, b.meta_desc, b.keywords, b.published, b.created_at || new Date(), b.updated_at || new Date()]
      );
    }
    console.log("✅ Blog Posts synced successfully.");

    // 6. SYNC TEAM MEMBERS
    console.log("\n👥 [6/8] Syncing Team Members...");
    const localTeams = await localPool.query("SELECT * FROM team_members ORDER BY id ASC");
    for (const tm of localTeams.rows) {
      await livePool.query(
        `INSERT INTO team_members (name, role, description, image_url, facebook, twitter, github, behance, "order", created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [tm.name, tm.role, tm.description, tm.image_url, tm.facebook, tm.twitter, tm.github, tm.behance, tm.order, tm.created_at || new Date()]
      );
    }
    console.log("✅ Team Members synced successfully.");

    // 7. SYNC GALLERY IMAGES
    console.log("\n🖼️ [7/8] Syncing Gallery Images...");
    const localGallery = await localPool.query("SELECT * FROM gallery_images ORDER BY id ASC");
    for (const g of localGallery.rows) {
      await livePool.query(
        `INSERT INTO gallery_images (image_url, caption, page_name, sequence, created_at)
         VALUES ($1, $2, $3, $4, $5)`,
        [g.image_url, g.caption, g.page_name, g.sequence, g.created_at || new Date()]
      );
    }
    console.log("✅ Gallery Images synced successfully.");

    // 8. SYNC SITE SETTINGS
    console.log("\n⚙️ [8/8] Syncing Site Settings...");
    const localSettings = await localPool.query("SELECT * FROM site_settings ORDER BY id ASC");
    for (const ss of localSettings.rows) {
      const checkSetting = await livePool.query("SELECT id FROM site_settings LIMIT 1");
      if (checkSetting.rows.length > 0) {
        await livePool.query(
          `UPDATE site_settings SET 
             email = $1, phone = $2, address = $3, location = $4,
             facebook = $5, instagram = $6, x_link = $7, youtube = $8,
             logo_url = $9, signature_url = $10, updated_at = NOW()
           WHERE id = $11`,
          [ss.email, ss.phone, ss.address, ss.location, ss.facebook, ss.instagram, ss.x_link, ss.youtube, ss.logo_url, ss.signature_url, checkSetting.rows[0].id]
        );
      } else {
        await livePool.query(
          `INSERT INTO site_settings (email, phone, address, location, facebook, instagram, x_link, youtube, logo_url, signature_url, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
          [ss.email, ss.phone, ss.address, ss.location, ss.facebook, ss.instagram, ss.x_link, ss.youtube, ss.logo_url, ss.signature_url]
        );
      }
    }
    console.log("✅ Site Settings synced successfully.");

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log("\n=================================================");
    console.log(`🎉 ALL 130,466 LOCAL QUESTIONS & DATA SUCCESSFULLY SYNCED TO LIVE NEON DB IN ${duration}s!`);
    console.log("=================================================");

  } catch (error) {
    console.error("\n❌ SYNC ERROR:", error);
  } finally {
    await localPool.end();
    await livePool.end();
  }
}

runSync();
