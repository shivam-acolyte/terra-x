import { mkdir, readdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";
import "dotenv/config";
import pg from "pg";

const siteUrl = "https://terraxopc.com";

const staticPages = [
  {
    path: "/",
    title: "TERRA-X | Autonomous AI Excavators for Construction, Agriculture & Rescue",
    description: "See how TERRA-X's autonomous excavators cut labor costs and improve safety across construction, farming, and rescue operations. Get a demo.",
    priority: "1.0",
  },
  {
    path: "/about",
    title: "About TERRA-X | Autonomous Heavy Machinery Company",
    description: "Learn about TERRA-X's mission to make autonomous AI excavation safe, accessible, and reliable across construction, agriculture, rescue, and defense.",
    priority: "0.8",
  },
  {
    path: "/products",
    title: "TERRA-X Products | Autonomous Excavators & Heavy Machinery",
    description: "Explore TERRA-X's autonomous excavator models built for construction, agriculture, rescue, and defense operations.",
    priority: "0.8",
  },
  {
    path: "/technology",
    title: "TERRA-X Technology | How Autonomous Excavation Works",
    description: "A technical look at the AI, sensors, and planning systems behind TERRA-X's autonomous excavators.",
    priority: "0.8",
  },
  {
    path: "/market",
    title: "The Autonomous Heavy Machinery Market | TERRA-X",
    description: "An overview of the market for autonomous excavators and AI-powered heavy machinery across construction, agriculture, rescue, and defense.",
    priority: "0.8",
  },
  {
    path: "/strategy",
    title: "TERRA-X Strategy | Our Approach to Autonomous Heavy Machinery",
    description: "How TERRA-X is building and scaling autonomous excavators across construction, agriculture, rescue, and defense.",
    priority: "0.8",
  },
  {
    path: "/founder",
    title: "Sooraj Anil — Founder of TERRA-X",
    description: "Meet Sooraj Anil, founder of TERRA-X, building AI-powered autonomous excavators for construction, agriculture, rescue, and defense.",
    priority: "0.8",
  },
  {
    path: "/contact",
    title: "Contact TERRA-X | Request a Demo or Get Support",
    description: "Get in touch with TERRA-X for demo requests, partnership inquiries, or support.",
    priority: "0.8",
  },
  {
    path: "/blog",
    title: "TERRA-X Blog | Autonomous Heavy Machinery Insights",
    description: "Read TERRA-X updates, robotics insights, autonomous excavator articles, and heavy machinery innovation notes.",
    priority: "0.8",
  },
  {
    path: "/admin",
    title: "TERRA-X Admin Console",
    description: "TERRA-X Admin Portal for managing blogs and system users.",
    noindex: true,
  },
  {
    path: "/admin/blogs",
    title: "TERRA-X Blog Management",
    description: "Manage TERRA-X blog posts.",
    noindex: true,
  },
  {
    path: "/admin/users",
    title: "TERRA-X User Management",
    description: "Manage TERRA-X admin users and credentials.",
    noindex: true,
  },
];

const distDir = "dist";
const assetsDir = join(distDir, "assets");
const assets = await readdir(assetsDir, { withFileTypes: true });
const files = assets.filter((entry) => entry.isFile()).map((entry) => entry.name);

const styleFile = files.find((file) => /^index-.*\.css$/.test(file));
const entryFiles = files.filter((file) => /^index-.*\.js$/.test(file));

if (!styleFile || entryFiles.length === 0) {
  throw new Error("Could not find built CSS or JS entry assets in dist/assets.");
}

const entryFile = (
  await Promise.all(
    entryFiles.map(async (file) => ({
      file,
      size: (await stat(join(assetsDir, file))).size,
    })),
  )
).sort((a, b) => b.size - a.size)[0].file;

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function generateHtml({
  path,
  title,
  description,
  canonicalUrl,
  ogImage,
  noindex = false,
}) {
  const finalCanonical = canonicalUrl || new URL(path, siteUrl).toString();
  const safeTitle = escapeHtml(title || "TERRA-X | Autonomous AI Excavators");
  const safeDesc = escapeHtml(
    description ||
      "TERRA-X builds AI-powered autonomous excavators and robotic heavy machines for agriculture, construction, rescue, and defense."
  );
  const safeOgImage = ogImage ? escapeHtml(ogImage) : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDesc}" />
    <link rel="canonical" href="${finalCanonical}" />
    <meta name="google-site-verification" content="google35c1a4c8212447cc.html" />
    <meta name="google-site-verification" content="google35c1a4c8212447cc" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDesc}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${finalCanonical}" />
    <meta property="og:site_name" content="TERRA-X" />
    ${safeOgImage ? `<meta property="og:image" content="${safeOgImage}" />` : ""}
    <meta name="twitter:card" content="summary_large_image" />
    ${noindex ? `<meta name="robots" content="noindex, nofollow" />` : ""}
    <link rel="stylesheet" href="/assets/${styleFile}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${entryFile}"></script>
  </body>
</html>
`;
}

// 1. Generate core static pages
for (const page of staticPages) {
  const htmlContent = generateHtml({
    path: page.path,
    title: page.title,
    description: page.description,
    noindex: page.noindex,
  });

  if (page.path === "/") {
    await writeFile(join(distDir, "index.html"), htmlContent);
  } else {
    const cleanPath = page.path.replace(/^\//, "");
    const routeDir = join(distDir, cleanPath);
    await mkdir(routeDir, { recursive: true });
    await writeFile(join(routeDir, "index.html"), htmlContent);

    // Direct extension resolution
    if (!cleanPath.includes("/")) {
      await writeFile(join(distDir, `${cleanPath}.html`), htmlContent);
    }
  }
}

// 2. Fetch published blog posts from database and generate individual static pages
let blogPosts = [];
if (process.env.DATABASE_URL) {
  try {
    const pool = new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 5000,
    });
    const result = await pool.query(`
      SELECT slug, title, meta_title, meta_description, excerpt, canonical_url, og_image_url, cover_image_url, no_index, published_at, updated_at
      FROM blog_posts
      WHERE status = 'published'
      ORDER BY published_at DESC NULLS LAST
    `);
    blogPosts = result.rows || [];
    await pool.end();
    console.log(`[build] Successfully loaded ${blogPosts.length} published blog posts from database.`);
  } catch (err) {
    console.warn(`[build] Warning: Could not fetch blog posts from database (${err.message}). Proceeding without dynamic blog post static files.`);
  }
}

for (const post of blogPosts) {
  const slug = post.slug;
  if (!slug) continue;
  const postPath = `/blog/${slug}`;
  const canonicalUrl = post.canonical_url?.trim() || `${siteUrl}${postPath}`;
  const title = post.meta_title?.trim() || post.title?.trim() || "TERRA-X Blog";
  const description = post.meta_description?.trim() || post.excerpt?.trim() || "Read updates and insights from TERRA-X.";
  const ogImage = post.og_image_url || post.cover_image_url || "";
  const noindex = Boolean(post.no_index);

  const htmlContent = generateHtml({
    path: postPath,
    title,
    description,
    canonicalUrl,
    ogImage,
    noindex,
  });

  const postDir = join(distDir, "blog", slug);
  await mkdir(postDir, { recursive: true });
  await writeFile(join(postDir, "index.html"), htmlContent);
  await writeFile(join(distDir, "blog", `${slug}.html`), htmlContent);
}

// 3. Build dynamic sitemap.xml
const sitemapEntries = [];

// Add public static pages
for (const page of staticPages) {
  if (page.noindex) continue;
  sitemapEntries.push({
    loc: new URL(page.path, siteUrl).toString(),
    changefreq: page.path === "/" ? "daily" : "weekly",
    priority: page.priority || "0.8",
  });
}

// Add published blog posts
for (const post of blogPosts) {
  if (post.no_index) continue;
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const lastmod = post.updated_at || post.published_at;
  sitemapEntries.push({
    loc: postUrl,
    changefreq: "weekly",
    priority: "0.7",
    lastmod: lastmod ? new Date(lastmod).toISOString().split("T")[0] : undefined,
  });
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map((entry) => {
    return `  <url>
    <loc>${entry.loc}</loc>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ""}
  </url>`;
  })
  .join("\n")}
</urlset>
`;

await writeFile(join(distDir, "sitemap.xml"), sitemap);
console.log(`[build] Wrote sitemap.xml with ${sitemapEntries.length} entries.`);
