import { Link } from "waku";
import { localePath, type Locale } from "@/lib/locale";

interface BlogPostProps {
  content: string;
  date: string;
  updatedDate?: string | undefined;
  author: string;
  lang: Locale;
  backLabel: string;
}

export const BlogPost = ({
  content,
  date,
  updatedDate,
  author,
  lang,
  backLabel,
}: BlogPostProps) => {
  return (
    <article className="max-w-3xl mx-auto">
      <Link
        to={localePath(lang, "blog")}
        className="inline-block font-gothic text-[12px] uppercase tracking-[0.2em] text-ink-mute hover:text-shu-deep dark:hover:text-shu transition-colors mb-12"
      >
        {backLabel}
      </Link>

      <header className="mb-10">
        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-wider text-ink-soft">
          <time dateTime={date}>{date}</time>
          {updatedDate && (
            <span className="flex items-center gap-2">
              <span aria-hidden="true">/</span>
              <span>{lang === "ja" ? "更新" : "Updated"}</span>
              <time dateTime={updatedDate}>{updatedDate}</time>
            </span>
          )}
        </div>
        <p className="font-mincho italic text-ink-mute mt-3">
          {lang === "ja" ? `著・${author}` : `By ${author}`}
        </p>
      </header>

      <span aria-hidden="true" className="block h-px w-12 bg-shu mb-10" />

      <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
};
