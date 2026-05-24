import { localePath, type Locale } from "@/lib/locale";
import { SealMark } from "@/components/ptpt/shared";
import footerEn from "@private/lang/components/global/en/footer.json";
import footerJa from "@private/lang/components/global/ja/footer.json";

const data = { en: footerEn, ja: footerJa };

export const Footer = ({ lang = "en" }: { lang?: Locale }) => {
  const content = data[lang];
  const link = (suffix: string) => localePath(lang, suffix);

  return (
    <footer className="relative mt-32">
      {/* shu top rule — punctuates the page like a colophon line */}
      <span aria-hidden="true" className="block h-px w-full bg-shu" />

      <div className="px-5 sm:px-6 lg:px-12 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Wordmark + tagline (5 cols) */}
          <div className="md:col-span-5">
            <p className="font-mincho text-3xl text-ink leading-none mb-3">パタパタ</p>
            <p className="font-mono text-[11px] text-ink-mute tracking-[0.18em] mb-5">patapata</p>
            <p className="font-gothic text-sm text-ink-mute leading-relaxed max-w-md">
              {content.tagline}
            </p>
          </div>

          {/* Packages column (3 cols) */}
          <div className="md:col-span-3">
            <h3 className="font-gothic text-[10px] uppercase tracking-[0.25em] text-ink-soft mb-4">
              {content.sections.packages}
            </h3>
            <ul className="space-y-2">
              {(["", "react", "vue", "rehype", "astro"] as const).map((slug) => (
                <li key={slug || "core"}>
                  <a
                    href={link(slug)}
                    className="font-mono text-[13px] text-ink-mute hover:text-shu-deep dark:hover:text-shu transition-colors"
                  >
                    {slug ? `ptpt-${slug}` : "ptpt-core"}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Links column (3 cols) */}
          <div className="md:col-span-3">
            <h3 className="font-gothic text-[10px] uppercase tracking-[0.25em] text-ink-soft mb-4">
              {content.sections.community}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={link("demo")}
                  className="font-gothic text-sm text-ink-mute hover:text-shu-deep dark:hover:text-shu transition-colors"
                >
                  {content.links.demo}
                </a>
              </li>
              <li>
                <a
                  href={link("blog")}
                  className="font-gothic text-sm text-ink-mute hover:text-shu-deep dark:hover:text-shu transition-colors"
                >
                  {content.links.blog}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Love-Rox/ptpt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-gothic text-sm text-ink-mute hover:text-shu-deep dark:hover:text-shu transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://love-rox.cc"
                  className="font-gothic text-sm text-ink-mute hover:text-shu-deep dark:hover:text-shu transition-colors"
                >
                  {content.links.rox}
                </a>
              </li>
            </ul>
          </div>

          {/* Seal — 1 cols on the lower-right margin */}
          <div className="md:col-span-1 flex md:justify-end items-end">
            <SealMark label="ぱた" size={48} />
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="max-w-6xl mx-auto mt-16 pt-5 flex flex-col sm:flex-row justify-between items-baseline gap-2"
          style={{ borderTop: "1px solid var(--color-rule)" }}
        >
          <p className="font-mono text-[11px] text-ink-soft tracking-wider">{content.copyright}</p>
          <p className="font-gothic text-[11px] text-ink-soft">
            {content.builtWith}{" "}
            <a
              href="https://waku.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-mute hover:text-shu-deep dark:hover:text-shu underline decoration-rule underline-offset-4 transition-colors"
            >
              Waku
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
