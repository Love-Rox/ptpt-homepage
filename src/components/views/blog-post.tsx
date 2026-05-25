import { Meta } from "@/components/global/meta";
import { PageShell } from "@/components/global/page-shell";
import { loadMarkdownBySlug } from "@/lib/markdown-loader";
import { BlogPost } from "@/components/blog/blog-post";
import { Breadcrumbs, generateBreadcrumbItems } from "@/components/common/breadcrumbs";
import { ArticleSchema, BreadcrumbSchema } from "@/components/seo/structured-data";
import { localePath, type Locale } from "@/lib/locale";

const indexCopy = {
  en: { title: "Journal", backToList: "← All entries" },
  ja: { title: "ジャーナル", backToList: "← 一覧へ戻る" },
} as const;

export default async function BlogPostView({ locale, slug }: { locale: Locale; slug: string }) {
  const indexData = indexCopy[locale];
  const content = await loadMarkdownBySlug("blog", slug, locale);
  const url = localePath(locale, `blog/${slug}`);

  if (!content) {
    return (
      <div className="px-6 lg:px-12 pl-6 lg:pl-20 max-w-6xl mx-auto pt-16 pb-24">
        <Meta
          title={`Not Found - ${indexData.title}`}
          description="The requested journal entry could not be found."
          url={url}
          lang={locale}
        />
        <h1 className="font-mincho text-3xl text-ink mb-4">
          {locale === "ja" ? "記事が見つかりません" : "Entry not found"}
        </h1>
      </div>
    );
  }

  const ogParams = new URLSearchParams({ title: content.metadata.title });
  ogParams.set("eyebrow", `${indexData.title} · ${locale.toUpperCase()}`);
  if (content.metadata.author) ogParams.set("author", content.metadata.author);
  const ogUrl = `/api/og?${ogParams.toString()}`;

  return (
    <PageShell lang={locale}>
      <div className="relative">
        <Meta
          title={`${content.metadata.title} - ${indexData.title}`}
          description={content.metadata.excerpt || content.metadata.description}
          image={ogUrl}
          url={url}
          lang={locale}
        />
        <BreadcrumbSchema
          items={generateBreadcrumbItems(
            [
              { label: indexData.title, href: localePath(locale, "blog") },
              { label: content.metadata.title, href: url },
            ],
            locale,
          )}
        />
        <ArticleSchema
          title={content.metadata.title}
          description={content.metadata.excerpt || content.metadata.description || ""}
          url={url}
          image={ogUrl}
          {...(content.metadata.date && { datePublished: content.metadata.date })}
          {...(content.metadata.updated && { dateModified: content.metadata.updated })}
          author={content.metadata.author || "Love-Rox"}
        />

        <div className="px-5 sm:px-6 lg:px-12 max-w-6xl mx-auto pt-8 sm:pt-10 lg:pt-14">
          <Breadcrumbs
            items={[
              { label: indexData.title, href: localePath(locale, "blog") },
              { label: content.metadata.title },
            ]}
            lang={locale}
          />
        </div>

        <div className="px-5 sm:px-6 lg:px-12 max-w-6xl mx-auto pt-5 sm:pt-6 pb-20 sm:pb-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-shu-deep dark:text-shu max-w-3xl mx-auto mb-4 sm:mb-5">
            {indexData.title}
          </p>
          <h1 className="font-mincho text-[2rem] sm:text-[2.75rem] lg:text-[3.75rem] leading-[1.2] sm:leading-[1.15] text-ink mb-8 sm:mb-10 max-w-3xl mx-auto">
            {content.metadata.title}
          </h1>

          <BlogPost
            content={content.html}
            date={
              content.metadata.date
                ? new Date(content.metadata.date).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : ""
            }
            updatedDate={
              content.metadata.updated
                ? new Date(content.metadata.updated).toLocaleDateString(locale, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : undefined
            }
            author={content.metadata.author || "Love-Rox"}
            lang={locale}
            backLabel={indexData.backToList}
          />
        </div>
      </div>
    </PageShell>
  );
}
