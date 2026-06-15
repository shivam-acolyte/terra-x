import { readdir, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const distDir = "dist";
const assetsDir = join(distDir, "assets");
const assets = await readdir(assetsDir, { withFileTypes: true });
const files = assets.filter((entry) => entry.isFile()).map((entry) => entry.name);

const styleFile = files.find((file) => /^styles-.*\.css$/.test(file));
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
    <link rel="stylesheet" href="/assets/${styleFile}" />
  </head>
  <body>
    <script type="module" src="/assets/${entryFile}"></script>
  </body>
</html>
`;

await writeFile(join(distDir, "index.html"), html);
