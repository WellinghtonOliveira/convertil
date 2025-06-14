// backend/utils/generate-sitemap.js
const fs = require("fs");
const path = require("path");

const publicDir = path.join(__dirname, "../../frontend/public");
const baseUrl = "https://seusite.com"; // Altere para seu domínio real

function getToolDirectories() {
  return fs.readdirSync(publicDir).filter((file) => {
    const fullPath = path.join(publicDir, file);
    return fs.statSync(fullPath).isDirectory();
  });
}

function generateSitemap() {
  const tools = getToolDirectories();

  const urls = tools.map((tool) => {
    return `
  <url>
    <loc>${baseUrl}/${tool}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <priority>0.8</priority>
  </url>`;
  });

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  const outputPath = path.join(publicDir, "sitemap.xml");
  fs.writeFileSync(outputPath, sitemapContent.trim());

  console.log("✅ sitemap.xml gerado com sucesso!");
}

module.exports = generateSitemap