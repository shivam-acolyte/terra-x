import { readdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const siteUrl = "https://terraxopc.com";
const sitePaths = [
  "/",
  "/about",
  "/products",
  "/technology",
  "/market",
  "/strategy",
  "/founder",
  "/contact",
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

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TERRA-X | AI-Powered Autonomous Heavy Machinery</title>
    <meta
      name="description"
      content="TERRA-X builds AI-powered autonomous excavators and robotic heavy machines for agriculture, construction, rescue, and defense."
    />
    <link rel="canonical" href="${siteUrl}/" />
    <meta property="og:title" content="TERRA-X | AI-Powered Autonomous Heavy Machinery" />
    <meta property="og:description" content="TERRA-X builds AI-powered autonomous excavators and robotic heavy machines for agriculture, construction, rescue, and defense." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${siteUrl}/" />
    <meta property="og:site_name" content="TERRA-X" />
    <meta name="twitter:card" content="summary_large_image" />
    <link rel="stylesheet" href="/assets/${styleFile}" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/assets/${entryFile}"></script>
  </body>
</html>
`;

await writeFile(join(distDir, "index.html"), html);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitePaths
  .map((path) => {
    const priority = path === "/" ? "1.0" : "0.8";
    return `  <url><loc>${new URL(path, siteUrl)}</loc><changefreq>weekly</changefreq><priority>${priority}</priority></url>`;
  })
  .join("\n")}
</urlset>
`;

await writeFile(join(distDir, "sitemap.xml"), sitemap);
