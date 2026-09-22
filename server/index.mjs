import "dotenv/config";
import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import multer from "multer";
import pg from "pg";
import { mkdir, readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const { Pool } = pg;
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const uploadsDir = path.join(rootDir, "uploads", "blog-images");
const distDir = path.join(rootDir, "dist");
const port = Number(process.env.PORT || 3000);
const databaseUrl = process.env.DATABASE_URL;
const jwtSecret = process.env.JWT_SECRET;

if (!databaseUrl) throw new Error("DATABASE_URL is required.");
if (!jwtSecret || jwtSecret.length < 32) throw new Error("JWT_SECRET must be at least 32 characters.");

const pool = new Pool({ connectionString: databaseUrl, ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : undefined });
const app = express();
const upload = multer({
  storage: multer.diskStorage({
    destination: async (_request, _file, callback) => {
      try { await mkdir(uploadsDir, { recursive: true }); callback(null, uploadsDir); }
      catch (error) { callback(error); }
    },
    filename: (_request, file, callback) => {
      const extension = path.extname(file.originalname).toLowerCase() || ".jpg";
      callback(null, `${randomUUID()}${extension}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => callback(null, /^image\/(jpeg|png|webp|gif)$/.test(file.mimetype)),
});

app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(path.join(rootDir, "uploads"), { maxAge: "7d" }));

function slugify(value) {
  return String(value || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function publicPost(row) {
  return {
    ...row,
    tags: Array.isArray(row.tags) ? row.tags : (row.tags ? (typeof row.tags === "string" ? JSON.parse(row.tags) : row.tags) : []),
  };
}
function getToken(request) {
  const value = request.headers.authorization || "";
  return value.startsWith("Bearer ") ? value.slice(7) : "";
}
function requireAdmin(request, response, next) {
  try {
    request.admin = jwt.verify(getToken(request), jwtSecret);
    next();
  } catch { response.status(401).json({ error: "Authentication required." }); }
}
function postValues(input) {
  const title = String(input.title || "").trim();
  const excerpt = String(input.excerpt || "").trim();
  const content = String(input.content || "").trim();
  if (!title || !excerpt || !content) throw new Error("Title, excerpt, and content are required.");

  let tags = [];
  if (Array.isArray(input.tags)) {
    tags = input.tags.map((t) => String(t).trim()).filter(Boolean);
  } else if (typeof input.tags === "string" && input.tags.trim()) {
    try {
      const parsed = JSON.parse(input.tags);
      tags = Array.isArray(parsed) ? parsed : [input.tags.trim()];
    } catch {
      tags = input.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
  }

  return [
    title,
    slugify(input.slug || title),
    excerpt,
    content,
    input.cover_image_url || null,
    input.mobile_image_url || null,
    input.post_date || new Date().toISOString().slice(0, 10),
    input.read_time || null,
    input.image_alt_text || null,
    input.image_title || null,
    input.meta_title || null,
    input.meta_description || null,
    input.canonical_url || null,
    input.author_name || "TERRA-X Team",
    input.category || "Technology",
    input.status === "published" ? "published" : "draft",
    JSON.stringify(tags),
    input.og_image_url || null,
    input.meta_keywords || null,
    Boolean(input.no_index),
    input.head_scripts || null,
    input.body_scripts || null,
    input.schema_markup || null,
    input.author_role || null,
    input.author_bio || null,
    input.author_avatar_url || null,
    input.author_social_url || null,
  ];
}

app.post("/api/auth/login", async (request, response, next) => {
  try {
    const email = String(request.body.email || "").trim().toLowerCase();
    const password = String(request.body.password || "");
    const { rows } = await pool.query("select id, email, password_hash from admin_users where email = $1", [email]);
    const admin = rows[0];
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) return response.status(401).json({ error: "Invalid email or password." });
    const access_token = jwt.sign({ sub: admin.id, email: admin.email, role: "admin" }, jwtSecret, { expiresIn: "8h" });
    response.json({ access_token, user: { email: admin.email } });
  } catch (error) { next(error); }
});

app.get("/api/blog-posts", async (_request, response, next) => {
  try {
    const { rows } = await pool.query("select * from blog_posts where status = 'published' order by published_at desc nulls last");
    response.json(rows.map(publicPost));
  } catch (error) { next(error); }
});
app.get("/api/blog-posts/:slug", async (request, response, next) => {
  try {
    const token = getToken(request);
    let isAdmin = false;
    if (token) {
      try {
        jwt.verify(token, jwtSecret);
        isAdmin = true;
      } catch {}
    }

    const query = isAdmin
      ? "select * from blog_posts where slug = $1 limit 1"
      : "select * from blog_posts where slug = $1 and status = 'published' limit 1";

    const { rows } = await pool.query(query, [request.params.slug]);
    response.json(rows[0] ? publicPost(rows[0]) : null);
  } catch (error) { next(error); }
});
app.get("/api/admin/blog-posts", requireAdmin, async (_request, response, next) => {
  try {
    const { rows } = await pool.query("select * from blog_posts order by updated_at desc");
    response.json(rows.map(publicPost));
  } catch (error) { next(error); }
});
app.post("/api/admin/blog-posts", requireAdmin, async (request, response, next) => {
  try {
    const values = postValues(request.body);
    const { rows } = await pool.query(
      `insert into blog_posts (
        title, slug, excerpt, content, cover_image_url, mobile_image_url, post_date, read_time,
        image_alt_text, image_title, meta_title, meta_description, canonical_url, author_name,
        category, status, tags, og_image_url, meta_keywords, no_index, head_scripts, body_scripts,
        schema_markup, author_role, author_bio, author_avatar_url, author_social_url, published_at
      ) values (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27,
        case when $16 = 'published' then now() else null end
      ) returning *`,
      values
    );
    response.status(201).json(publicPost(rows[0]));
  } catch (error) { next(error); }
});
app.patch("/api/admin/blog-posts/:id", requireAdmin, async (request, response, next) => {
  try {
    const values = postValues(request.body);
    const { rows } = await pool.query(
      `update blog_posts set
        title=$1, slug=$2, excerpt=$3, content=$4, cover_image_url=$5, mobile_image_url=$6,
        post_date=$7, read_time=$8, image_alt_text=$9, image_title=$10, meta_title=$11,
        meta_description=$12, canonical_url=$13, author_name=$14, category=$15, status=$16,
        tags=$17, og_image_url=$18, meta_keywords=$19, no_index=$20, head_scripts=$21,
        body_scripts=$22, schema_markup=$23, author_role=$24, author_bio=$25,
        author_avatar_url=$26, author_social_url=$27,
        published_at=case when $16 = 'published' then coalesce(published_at, now()) else null end
      where id=$28 returning *`,
      [...values, request.params.id]
    );
    if (!rows[0]) return response.status(404).json({ error: "Post not found." });
    response.json(publicPost(rows[0]));
  } catch (error) { next(error); }
});
app.post("/api/admin/blog-posts/:id/duplicate", requireAdmin, async (request, response, next) => {
  try {
    const { rows } = await pool.query("select * from blog_posts where id = $1", [request.params.id]);
    const original = rows[0];
    if (!original) return response.status(404).json({ error: "Post not found." });

    let baseSlug = original.slug.replace(/-copy(-\d+)?$/i, "");
    let newSlug = `${baseSlug}-copy`;
    let count = 1;
    while ((await pool.query("select id from blog_posts where slug = $1", [newSlug])).rowCount > 0) {
      count++;
      newSlug = `${baseSlug}-copy-${count}`;
    }

    const newTitle = `${original.title} (Copy)`;
    const { rows: inserted } = await pool.query(
      `insert into blog_posts (
        title, slug, excerpt, content, cover_image_url, mobile_image_url, post_date, read_time,
        image_alt_text, image_title, meta_title, meta_description, canonical_url, author_name,
        category, status, tags, og_image_url, meta_keywords, no_index, head_scripts, body_scripts, schema_markup,
        author_role, author_bio, author_avatar_url, author_social_url
      ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,'draft',$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26) returning *`,
      [
        newTitle,
        newSlug,
        original.excerpt,
        original.content,
        original.cover_image_url,
        original.mobile_image_url,
        original.post_date,
        original.read_time,
        original.image_alt_text,
        original.image_title,
        original.meta_title,
        original.meta_description,
        original.canonical_url,
        original.author_name,
        original.category,
        original.tags || '[]',
        original.og_image_url,
        original.meta_keywords,
        original.no_index || false,
        original.head_scripts,
        original.body_scripts,
        original.schema_markup,
        original.author_role,
        original.author_bio,
        original.author_avatar_url,
        original.author_social_url,
      ]
    );

    response.status(201).json(publicPost(inserted[0]));
  } catch (error) { next(error); }
});
app.delete("/api/admin/blog-posts/:id", requireAdmin, async (request, response, next) => {
  try { await pool.query("delete from blog_posts where id = $1", [request.params.id]); response.status(204).end(); }
  catch (error) { next(error); }
});
app.post("/api/admin/uploads/blog-images", requireAdmin, upload.single("image"), (request, response) => {
  if (!request.file) return response.status(400).json({ error: "A JPEG, PNG, WebP, or GIF image is required." });
  response.status(201).json({ url: `/uploads/blog-images/${request.file.filename}` });
});

import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_request, file, callback) => {
    const isPdf =
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf");
    callback(null, isPdf);
  },
});

function parseTextToBlogDetails(rawText, originalFilename = "") {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  let title = "";
  const bodyLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (
      !title &&
      line.length >= 3 &&
      line.length <= 120 &&
      !/^(page\s+\d+|table of contents|contents|introduction)$/i.test(line)
    ) {
      title = line.replace(/^[#\s]+/, "");
    } else {
      bodyLines.push(line);
    }
  }

  if (!title) {
    title = originalFilename
      ? originalFilename.replace(/\.pdf$/i, "").replace(/[-_]/g, " ")
      : "Imported PDF Document";
  }

  let formattedContent = "";
  let paragraph = [];

  for (const line of bodyLines) {
    if (
      (line.length < 60 && /^[A-Z0-9\s:—–-]+$/.test(line)) ||
      /^(\d+\.|\b(Section|Chapter|Part)\b)/i.test(line)
    ) {
      if (paragraph.length > 0) {
        formattedContent += paragraph.join(" ") + "\n\n";
        paragraph = [];
      }
      formattedContent += `## ${line.replace(/^#+\s*/, "")}\n\n`;
    } else if (/^[-•*]\s+/.test(line)) {
      if (paragraph.length > 0) {
        formattedContent += paragraph.join(" ") + "\n\n";
        paragraph = [];
      }
      formattedContent += `- ${line.replace(/^[-•*]\s*/, "")}\n`;
    } else {
      paragraph.push(line);
    }
  }

  if (paragraph.length > 0) {
    formattedContent += paragraph.join(" ") + "\n\n";
  }

  const cleanContent = formattedContent.trim() || rawText.trim();
  const plainBody = cleanContent.replace(/^#+\s.*$/gm, "").replace(/^-\s/gm, "").trim();
  const excerpt =
    plainBody.length > 240
      ? plainBody.slice(0, 240).replace(/\s+[^\s]*$/, "") + "..."
      : plainBody || "Read details from the imported document.";

  const wordCount = rawText.split(/\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
  const read_time = `${readTimeMinutes} min read`;

  const lower = rawText.toLowerCase();
  let category = "Technology";
  if (lower.includes("excavat") || lower.includes("construct") || lower.includes("heavy machin")) {
    category = "Excavators";
  } else if (lower.includes("robot") || lower.includes("autonom") || lower.includes("ai")) {
    category = "Robotics & AI";
  } else if (lower.includes("agri") || lower.includes("farm")) {
    category = "Agriculture";
  } else if (lower.includes("rescue") || lower.includes("disaster") || lower.includes("defense")) {
    category = "Rescue & Defense";
  }

  return {
    title,
    slug: slugify(title),
    excerpt,
    content: cleanContent,
    read_time,
    category,
    meta_title: title.slice(0, 60),
    meta_description: excerpt.slice(0, 155),
  };
}

app.post(
  "/api/admin/parse-pdf",
  requireAdmin,
  pdfUpload.single("pdf"),
  async (request, response, next) => {
    try {
      if (!request.file) {
        return response.status(400).json({ error: "A PDF file is required." });
      }

      const { PDFParse } = require("pdf-parse");
      let extractedText = "";

      try {
        const parser = new PDFParse({ data: request.file.buffer });
        await parser.load();
        const textResult = await parser.getText();
        extractedText =
          textResult?.text || (typeof textResult === "string" ? textResult : "");
      } catch (parseErr) {
        console.warn("PDFParse load error:", parseErr.message);
      }

      if (!extractedText) {
        const str = request.file.buffer.toString("binary");
        const textMatches = str.match(/\((.*?)\)\s*Tj/g) || [];
        const parts = [];
        for (const tm of textMatches) {
          const m = tm.match(/\((.*?)\)/);
          if (m && m[1]) parts.push(m[1]);
        }
        extractedText = parts.join(" ").trim();
      }

      if (!extractedText || extractedText.length < 5) {
        return response.status(400).json({
          error:
            "Could not extract readable text from the uploaded PDF. Please make sure the PDF has selectable text content.",
        });
      }

      const details = parseTextToBlogDetails(extractedText, request.file.originalname);
      response.json(details);
    } catch (error) {
      next(error);
    }
  },
);

app.get("/api/admin/users", requireAdmin, async (_request, response, next) => {
  try {
    const { rows } = await pool.query("select id, email, created_at from admin_users order by created_at desc");
    response.json(rows);
  } catch (error) { next(error); }
});
app.post("/api/admin/users", requireAdmin, async (request, response, next) => {
  try {
    const email = String(request.body.email || "").trim().toLowerCase();
    const password = String(request.body.password || "");
    if (!email || !password) return response.status(400).json({ error: "Email and password are required." });
    if (password.length < 6) return response.status(400).json({ error: "Password must be at least 6 characters." });
    const passwordHash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      "insert into admin_users (email, password_hash) values ($1, $2) returning id, email, created_at",
      [email, passwordHash]
    );
    response.status(201).json(rows[0]);
  } catch (error) { next(error); }
});
app.patch("/api/admin/users/:id", requireAdmin, async (request, response, next) => {
  try {
    const password = String(request.body.password || "");
    if (!password || password.length < 6) return response.status(400).json({ error: "Password must be at least 6 characters." });
    const passwordHash = await bcrypt.hash(password, 12);
    const { rows } = await pool.query(
      "update admin_users set password_hash = $1 where id = $2 returning id, email, created_at",
      [passwordHash, request.params.id]
    );
    if (!rows[0]) return response.status(404).json({ error: "User not found." });
    response.json(rows[0]);
  } catch (error) { next(error); }
});
app.delete("/api/admin/users/:id", requireAdmin, async (request, response, next) => {
  try {
    const { rows: countRows } = await pool.query("select count(*) as count from admin_users");
    if (parseInt(countRows[0].count, 10) <= 1) {
      return response.status(400).json({ error: "Cannot delete the last remaining admin user." });
    }
    await pool.query("delete from admin_users where id = $1", [request.params.id]);
    response.status(204).end();
  } catch (error) { next(error); }
});

// Serve static production build files
app.use(
  express.static(distDir, {
    extensions: ["html"],
    index: "index.html",
    dotfiles: "ignore",
    redirect: false,
    maxAge: "1d",
  })
);

// SPA fallback for frontend client-side routes with dynamic canonical and meta tags
app.use(async (request, response, next) => {
  if (request.method === "GET" && !request.path.startsWith("/api/")) {
    const indexPath = path.join(distDir, "index.html");
    try {
      let html = await readFile(indexPath, "utf-8");
      const cleanPath = request.path.replace(/\/+$/, "") || "/";
      let canonicalUrl = `https://terraxopc.com${cleanPath === "/" ? "/" : cleanPath}`;
      let pageTitle = "";
      let pageDescription = "";

      if (cleanPath.startsWith("/blog/")) {
        const slug = cleanPath.replace("/blog/", "");
        try {
          const { rows } = await pool.query(
            "SELECT title, meta_title, meta_description, canonical_url FROM blog_posts WHERE slug = $1 AND status = 'published' LIMIT 1",
            [slug]
          );
          if (rows.length > 0) {
            const post = rows[0];
            canonicalUrl = post.canonical_url?.trim() || `https://terraxopc.com/blog/${slug}`;
            pageTitle = post.meta_title?.trim() || post.title?.trim() || "";
            pageDescription = post.meta_description?.trim() || "";
          }
        } catch (dbErr) {
          console.warn("Could not query post for dynamic canonical fallback:", dbErr.message);
        }
      }

      // Dynamically replace canonical and og:url in served HTML
      html = html.replace(
        /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
        `<link rel="canonical" href="${canonicalUrl}" />`
      );
      html = html.replace(
        /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
        `<meta property="og:url" content="${canonicalUrl}" />`
      );

      if (pageTitle) {
        html = html.replace(/<title>[^<]*<\/title>/i, `<title>${pageTitle}</title>`);
        html = html.replace(
          /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
          `<meta property="og:title" content="${pageTitle}" />`
        );
      }
      if (pageDescription) {
        html = html.replace(
          /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
          `<meta name="description" content="${pageDescription}" />`
        );
        html = html.replace(
          /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
          `<meta property="og:description" content="${pageDescription}" />`
        );
      }

      response.setHeader("Content-Type", "text/html; charset=utf-8");
      return response.send(html);
    } catch (err) {
      if (!response.headersSent) {
        response.status(404).send("Not found");
      }
    }
  }
  next();
});

// Global Error Handler (must be after routes & static handlers)
app.use((error, _request, response, _next) => {
  if (error instanceof multer.MulterError) return response.status(400).json({ error: error.message });
  if (error?.code === "23505") {
    if (error.detail?.includes("email") || error.constraint?.includes("admin_users_email")) {
      return response.status(409).json({ error: "A user with this email already exists." });
    }
    return response.status(409).json({ error: "A record with this unique identifier already exists." });
  }
  console.error("Server Error:", error);
  if (!response.headersSent) {
    response.status(500).json({ error: error instanceof Error ? error.message : "Server error." });
  }
});

async function initialise() {
  await pool.query(`create extension if not exists pgcrypto;
  create table if not exists admin_users (
    id uuid primary key default gen_random_uuid(), email text not null unique, password_hash text not null, created_at timestamptz not null default now()
  ); create table if not exists blog_posts (
    id uuid primary key default gen_random_uuid(), title text not null, slug text not null unique, excerpt text not null, content text not null, cover_image_url text, post_date date default current_date, read_time text, image_alt_text text, image_title text, meta_title text, meta_description text, canonical_url text, author_name text not null default 'TERRA-X Team', category text not null default 'Technology', status text not null default 'draft' check (status in ('draft','published')), published_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
  );
  alter table blog_posts add column if not exists mobile_image_url text;
  alter table blog_posts add column if not exists tags text default '[]';
  alter table blog_posts add column if not exists og_image_url text;
  alter table blog_posts add column if not exists meta_keywords text;
  alter table blog_posts add column if not exists no_index boolean default false;
  alter table blog_posts add column if not exists head_scripts text;
  alter table blog_posts add column if not exists body_scripts text;
  alter table blog_posts add column if not exists schema_markup text;
  alter table blog_posts add column if not exists author_role text;
  alter table blog_posts add column if not exists author_bio text;
  alter table blog_posts add column if not exists author_avatar_url text;
  alter table blog_posts add column if not exists author_social_url text;
  `);
  await pool.query(`create or replace function set_blog_updated_at() returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
    drop trigger if exists blog_posts_set_updated_at on blog_posts;
    create trigger blog_posts_set_updated_at before update on blog_posts for each row execute function set_blog_updated_at();`);
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await pool.query("insert into admin_users (email, password_hash) values ($1, $2) on conflict (email) do nothing", [process.env.ADMIN_EMAIL.toLowerCase(), passwordHash]);
  }
  app.listen(port, "0.0.0.0", () => console.log(`TERRA-X server listening on port ${port}`));
}

initialise().catch((error) => { console.error("Database initialisation failed", error); process.exit(1); });
