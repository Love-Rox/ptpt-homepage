import { Link } from "waku";
import { Meta } from "@/components/global/meta";
import { PageShell } from "@/components/global/page-shell";
import { Breadcrumbs, generateBreadcrumbItems } from "@/components/common/breadcrumbs";
import { BreadcrumbSchema } from "@/components/seo/structured-data";
import { getAllSlugs, loadMarkdownBySlug } from "@/lib/markdown-loader";
import { localePath, type Locale } from "@/lib/locale";

const indexCopy = {
  en: {
    eyebrow: "Journal",
    title: "Releases & notes",
    description: "Release announcements, design notes, and updates from the patapata packages.",
    by: "By",
  },
  ja: {
    eyebrow: "ジャーナル",
    title: "リリースと開発手記",
    description: "patapata パッケージのリリース、設計の手記、アップデートを綴っています。",
    by: "著",
  },
} as const;

export default async function BlogIndexView({ locale }: { locale: Locale }) {
  const indexData = indexCopy[locale];
  const slugs = await getAllSlugs("blog", locale);

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const content = await loadMarkdownBySlug("blog", slug, locale);
      return content
        ? {
            slug,
            title: content.metadata.title,
            excerpt: content.metadata.excerpt || content.metadata.description || "",
            date: content.metadata.date || "",
            author: content.metadata.author || "Love-Rox",
          }
        : null;
    }),
  );

  const now = new Date();
  const validPosts = posts
    .filter((post): post is NonNullable<typeof post> => post !== null)
    .filter((post) => {
      if (!post.date) return true;
      const d = new Date(`${post.date}T00:00:00+09:00`);
      if (isNaN(d.getTime())) return true;
      return d <= now;
    });
  const sortedPosts = validPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <PageShell lang={locale}>
      <div className="relative">
        <Meta
          title={`${indexData.title} - patapata`}
          description={indexData.description}
          image={`/api/og?title=${encodeURIComponent(indexData.title)}&eyebrow=${encodeURIComponent(indexData.eyebrow)}`}
          url={localePath(locale, "blog")}
          lang={locale}
        />
        <BreadcrumbSchema
          items={generateBreadcrumbItems(
            [{ label: indexData.title, href: localePath(locale, "blog") }],
            locale,
          )}
        />

        <div className="px-5 sm:px-6 lg:px-12 max-w-6xl mx-auto pt-8 sm:pt-10 lg:pt-14">
          <Breadcrumbs items={[{ label: indexData.title }]} lang={locale} />
        </div>

        <div className="px-5 sm:px-6 lg:px-12 max-w-6xl mx-auto pb-20 sm:pb-24">
          <header className="mb-12 wa-fade-up" style={{ animationDelay: "120ms" }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-shu-deep dark:text-shu mb-5">
              {indexData.eyebrow}
            </p>
            <h1 className="font-mincho text-[2rem] sm:text-[2.75rem] lg:text-[3.5rem] leading-[1.15] text-ink mb-5 sm:mb-6 max-w-3xl">
              {indexData.title}
            </h1>
            <p className="font-gothic text-base text-ink-mute leading-[1.85] max-w-2xl">
              {indexData.description}
            </p>
            <span aria-hidden="true" className="board-seam block w-full mt-8" />
          </header>

          {/* Posts as an arrivals board — date | title | crew */}
          <div className="board max-w-4xl">
            <div className="board-head grid grid-cols-12 gap-x-6 items-center px-4 sm:px-5 h-9">
              <span className="col-span-3">date</span>
              <span className="col-span-9">arrival</span>
            </div>
            <ul>
              {sortedPosts.map((post) => (
                <li key={post.slug} className="flap-row">
                  <Link
                    to={localePath(locale, `blog/${post.slug}`)}
                    className="group grid grid-cols-12 gap-x-6 px-4 sm:px-5 py-6 sm:py-7 transition-colors"
                  >
                    <time
                      dateTime={post.date}
                      className="col-span-12 sm:col-span-3 font-mono text-[10px] sm:text-[11px] uppercase tracking-wider text-ink-soft mb-2 sm:mb-0 sm:pt-1.5"
                    >
                      {new Date(post.date).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })}
                    </time>
                    <div className="col-span-12 sm:col-span-9">
                      <h2 className="font-mincho text-xl sm:text-2xl lg:text-3xl text-ink leading-snug mb-2 group-hover:text-shu-deep dark:group-hover:text-shu transition-colors">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="font-gothic text-sm text-ink-mute leading-relaxed mb-3">
                          {post.excerpt}
                        </p>
                      )}
                      <p className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
                        {indexData.by} · {post.author}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
