const fs = require("fs");
const path = require("path");

const frontendDir = path.join(__dirname, "../../frontend");
const publicDir = path.join(frontendDir, "/");
const baseUrl = "https://convertil.com";

function getIndexPages(dir, basePath = "") {
  const items = fs.readdirSync(dir);
  let urls = [];

  for (const item of items) {
    const itemPath = path.join(dir, item);
    const relativePath = path.join(basePath, item);

    if (fs.statSync(itemPath).isDirectory()) {
      const indexHtmlPath = path.join(itemPath, "index.html");

      if (fs.existsSync(indexHtmlPath)) {
        const cleanPath = relativePath.replace(/\\/g, "/");
        urls.push(`${baseUrl}/${cleanPath}/`);
      }

      urls = urls.concat(getIndexPages(itemPath, relativePath));
    }
  }

  return urls;
}

function generateSitemap() {
  const urls = [`${baseUrl}/`];
  const foundPages = getIndexPages(publicDir);
  urls.push(...foundPages);

  const xmlUrls = urls.map((url) => {
    return `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>${url === `${baseUrl}/` ? "1.0" : "0.8"}</priority>
  </url>`;
  });

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls.join("\n")}
</urlset>`;

  const outputPath = path.join(frontendDir, "sitemap.xml");
  fs.writeFileSync(outputPath, sitemapContent.trim());

  console.log("✅ sitemap.xml gerado com sucesso!");
}

module.exports = generateSitemap;
