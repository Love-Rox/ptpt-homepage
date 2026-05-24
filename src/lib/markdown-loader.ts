import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";
import { remarkAlert } from "remark-github-blockquote-alert";
import remarkDeflist from "remark-deflist";

export interface MarkdownMetadata {
  title: string;
  description?: string;
  date?: string;
  updated?: string;
  author?: string;
  tags?: string[];
  faq?: { question: string; answer: string }[];
  howto?: {
    name: string;
    description?: string;
    supply?: string[];
    tool?: string[];
    step: { name: string; text: string; url?: string; image?: string }[];
    totalTime?: string;
  };
  [key: string]: any;
}

export interface MarkdownContent {
  metadata: MarkdownMetadata;
  content: string;
  html: string;
}

// Eagerly bundle all markdown content at build time so the runtime never
// touches `fs` (which doesn't exist in the Cloudflare Workers runtime).
// The keys are the file paths relative to this file, e.g.
// "../../private/contents/blog/ja/welcome-to-rox.md".
const blogModules = import.meta.glob("../../private/contents/blog/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

const docsModules = import.meta.glob("../../private/contents/docs/**/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function modulesFor(type: "blog" | "docs"): Record<string, string> {
  return type === "blog" ? blogModules : docsModules;
}

function keyPrefix(type: "blog" | "docs", locale: "en" | "ja"): string {
  return `../../private/contents/${type}/${locale}/`;
}

// Strip the first leading <h1>…</h1> from the rendered HTML. Authors typically
// repeat the title at the top of the body ("# Title") even though the same
// string is already in the frontmatter and gets rendered as the page heading
// by the view. Removing it here keeps existing posts intact while avoiding
// the visible duplication.
function stripLeadingH1(html: string): string {
  return html.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, "");
}

async function processMarkdown(raw: string): Promise<MarkdownContent> {
  const { data, content } = matter(raw);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkAlert)
    .use(remarkDeflist)
    .use(remarkHtml, { sanitize: false })
    .process(content);

  return {
    metadata: data as MarkdownMetadata,
    content,
    html: stripLeadingH1(processedContent.toString()),
  };
}

/**
 * Load Markdown content by slug and locale.
 *
 * Returns null when the slug is unknown or when frontmatter parsing fails —
 * a malformed entry should be silently skipped from the listing rather than
 * tearing down the whole index page.
 */
export async function loadMarkdownBySlug(
  type: "docs" | "blog",
  slug: string,
  locale: "en" | "ja",
): Promise<MarkdownContent | null> {
  const modules = modulesFor(type);
  const key = `${keyPrefix(type, locale)}${slug}.md`;
  const raw = modules[key];
  if (raw == null) return null;
  try {
    return await processMarkdown(raw);
  } catch (e) {
    console.error(`Failed to parse markdown ${key}:`, e);
    return null;
  }
}

/**
 * Get all content slugs for a given type and locale.
 */
export async function getAllSlugs(type: "docs" | "blog", locale: "en" | "ja"): Promise<string[]> {
  const modules = modulesFor(type);
  const prefix = keyPrefix(type, locale);
  return Object.keys(modules)
    .filter((k) => k.startsWith(prefix))
    .map((k) => k.slice(prefix.length).replace(/\.md$/, ""));
}
