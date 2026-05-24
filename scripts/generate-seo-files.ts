import fs from "fs";
import path from "path";

const SITE_URL = "https://ptpt.love-rox.cc";
const LANGUAGES = ["ja", "en"] as const;
type Lang = (typeof LANGUAGES)[number];
const PROJECT_ROOT = process.cwd();

// en-default URL strategy:
//   /        = en landing (canonical)
//   /<slug>  = en per-page
//   /ja/...  = Japanese mirror
//
// hreflang: en is x-default. Each URL declares en=<root variant>, ja=<ja variant>.

function getMarkdownSlugs(dir: string, lang: Lang): string[] {
  try {
    return fs
      .readdirSync(path.join(dir, lang))
      .filter((f) => f.endsWith(".md"))
      .map((f) => f.replace(/\.md$/, ""));
  } catch {
    return [];
  }
}

function enUrl(suffix: string): string {
  return suffix === "" ? "/" : `/${suffix}`;
}

function jaUrl(suffix: string): string {
  return suffix === "" ? "/ja" : `/ja/${suffix}`;
}

function urlEntry(suffix: string, priority: string, changefreq: string, lastmod: string) {
  const en = `${SITE_URL}${enUrl(suffix)}`;
  const ja = `${SITE_URL}${jaUrl(suffix)}`;
  return [
    { loc: en, alternates: { en, ja, "x-default": en } },
    { loc: ja, alternates: { en, ja, "x-default": en } },
  ].map(
    ({ loc, alternates }) => `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${Object.entries(alternates)
  .map(
    ([hreflang, href]) =>
      `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`,
  )
  .join("\n")}
  </url>`,
  );
}

function generateSitemap(): string {
  const blogRoot = path.join(PROJECT_ROOT, "private/contents/blog");
  const blogSlugs = Array.from(
    new Set([...getMarkdownSlugs(blogRoot, "ja"), ...getMarkdownSlugs(blogRoot, "en")]),
  );

  const lastmod = new Date().toISOString().split("T")[0];
  const urls: string[] = [];

  // Landing
  urls.push(...urlEntry("", "1.0", "weekly", lastmod));

  // Per-adapter pages + demo
  for (const slug of ["demo", "react", "vue", "rehype", "astro"]) {
    urls.push(...urlEntry(slug, "0.9", "monthly", lastmod));
  }

  // Blog index
  urls.push(...urlEntry("blog", "0.8", "weekly", lastmod));

  // Blog posts
  for (const slug of blogSlugs) {
    urls.push(...urlEntry(`blog/${slug}`, "0.7", "monthly", lastmod));
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>`;
}

function generateRobotsTxt(): string {
  return `User-agent: *
Disallow: /RSC/

Sitemap: ${SITE_URL}/sitemap.xml
`;
}

export function generateSEOFiles() {
  const publicDir = path.join(PROJECT_ROOT, "public");
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), generateSitemap(), "utf-8");
  console.log("✓ Generated sitemap.xml");

  fs.writeFileSync(path.join(publicDir, "robots.txt"), generateRobotsTxt(), "utf-8");
  console.log("✓ Generated robots.txt");

  console.log("\nSEO files generated successfully!");
}

const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith("generate-seo-files.ts") ||
    process.argv[1].endsWith("generate-seo-files.js"));

if (isMain) {
  generateSEOFiles();
}
