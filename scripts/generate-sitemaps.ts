/**
 * Build-time XML sitemap generator.
 * Reads the same SEO catalogs used by React pages via tsx.
 *
 * Output:
 *   public/sitemap.xml
 *   public/sitemaps/sitemap-*.xml
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  SITEMAP_GROUPS,
  buildSitemapUrls,
  urlsByGroup,
  type SitemapUrl,
} from "../src/lib/seo/sitemapRegistry.ts";
import { SITE_ORIGIN } from "../src/lib/seo/site.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const publicDir = join(root, "public");
const sitemapsDir = join(publicDir, "sitemaps");

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function urlSetXml(urls: SitemapUrl[]) {
  const body = urls
    .map((u) => {
      const parts = [`    <loc>${escapeXml(u.loc)}</loc>`];
      if (u.lastmod) parts.push(`    <lastmod>${escapeXml(u.lastmod)}</lastmod>`);
      if (u.changefreq) parts.push(`    <changefreq>${u.changefreq}</changefreq>`);
      if (u.priority != null) parts.push(`    <priority>${u.priority.toFixed(1)}</priority>`);
      return `  <url>\n${parts.join("\n")}\n  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function sitemapIndexXml(files: { path: string; lastmod: string }[]) {
  const body = files
    .map(
      (f) => `  <sitemap>
    <loc>${escapeXml(`${SITE_ORIGIN}${f.path}`)}</loc>
    <lastmod>${escapeXml(f.lastmod)}</lastmod>
  </sitemap>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

function validateUrl(u: SitemapUrl): string | null {
  if (!u.loc.startsWith("https://")) return "must be https absolute URL";
  if (!u.path.startsWith("/")) return "path must be absolute";
  if (u.path.includes("?")) return "temporary query URLs are not indexable";
  if (u.loc.includes("localhost")) return "localhost not allowed";
  return null;
}

mkdirSync(sitemapsDir, { recursive: true });

const all = buildSitemapUrls();
const invalid: string[] = [];
const valid = all.filter((u) => {
  const err = validateUrl(u);
  if (err) {
    invalid.push(`${u.path}: ${err}`);
    return false;
  }
  return true;
});

const today = new Date().toISOString().slice(0, 10);
const childFiles: { path: string; lastmod: string }[] = [];

for (const group of SITEMAP_GROUPS) {
  const urls = urlsByGroup(group).filter((u) => valid.some((v) => v.path === u.path));
  if (!urls.length) continue;
  const fileName = `sitemap-${group}.xml`;
  const relPath = `/sitemaps/${fileName}`;
  writeFileSync(join(sitemapsDir, fileName), urlSetXml(urls), "utf8");
  childFiles.push({ path: relPath, lastmod: today });
  console.log(`wrote ${relPath} (${urls.length} urls)`);
}

writeFileSync(join(publicDir, "sitemap.xml"), sitemapIndexXml(childFiles), "utf8");
console.log(`wrote /sitemap.xml index (${childFiles.length} children, ${valid.length} total urls)`);

if (invalid.length) {
  console.warn("Skipped invalid URLs:");
  invalid.forEach((i) => console.warn(" -", i));
}
