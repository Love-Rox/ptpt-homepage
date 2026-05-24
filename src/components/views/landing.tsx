import { Link } from "waku";
import { presets } from "@love-rox/ptpt-core";
import { PatapataBoard } from "@love-rox/ptpt-react";
import "@love-rox/ptpt-core/styles.css";
import { Meta } from "@/components/global/meta";
import {
  ADAPTERS,
  Badge,
  Cta,
  InlineMd,
  NewBadge,
  Prose,
  RECOMMENDED_CSS,
  Section,
  SnippetBlock,
  stripMd,
} from "@/components/ptpt/shared";
import { localePath, type Locale } from "@/lib/locale";
import { VERSIONS } from "@/lib/versions";
import langJa from "@private/lang/pages/ja/index.json";
import langEn from "@private/lang/pages/en/index.json";

const data = { en: langEn, ja: langJa };

const NPM_URL = "https://www.npmjs.com/package/@love-rox/ptpt-core";
const GITHUB_URL = "https://github.com/Love-Rox/ptpt";
const HERO_SAMPLE = "PATAPATA";

export default async function LandingView({ locale }: { locale: Locale }) {
  const content = data[locale];
  const url = localePath(locale, "");
  const demoUrl = localePath(locale, "demo");

  const items = content.family.items;
  const coreItem = items.core;
  const adapterItems = [items.react, items.vue, items.rehype, items.astro];
  const adapterMap = ADAPTERS.reduce<Record<string, (typeof ADAPTERS)[number]>>(
    (acc, a) => ({ ...acc, [a.key]: a }),
    {},
  );

  return (
    <div className="relative">
      <Meta
        title={`${content.hero.heading} - ${content.hero.eyebrow}`}
        description={stripMd(content.hero.tagline)}
        image={`/api/og?title=${encodeURIComponent(content.hero.heading)}&eyebrow=${encodeURIComponent(content.hero.eyebrow)}`}
        url={url}
        lang={locale}
      />
      {/* No BreadcrumbList on the landing — Schema.org expects ≥2 items, and
          a "Home" by itself doesn't add value for the root URL. */}

      {/* —— HERO ——————————————————————————————————————————————————————
          The vertical Mincho sample is the protagonist: it gets the larger
          column (7/12 on lg+), large type, and a faint giant 「縦」 watermark
          behind it. The horizontal metadata + CTAs sit on the left in a
          narrower column. Reader is met by typography first. */}
      <section className="relative px-5 sm:px-6 lg:px-12 pt-10 pb-16 sm:pt-12 sm:pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-12 gap-x-6 lg:gap-x-16 items-start">
          {/* Left column: eyebrow + heading + tagline + badges + CTAs (narrower) */}
          <div className="col-span-12 lg:col-span-5 wa-fade-up" style={{ animationDelay: "120ms" }}>
            <p className="font-gothic text-[11px] uppercase tracking-[0.3em] text-shu-deep dark:text-shu mb-6">
              {content.hero.eyebrow}
            </p>
            {/* Wordmark — パタパタ in Mincho display, the second half tinted
                shu. aria-label feeds screen readers the canonical romaji. */}
            <h1
              className="font-mincho text-[3rem] xs:text-[3.5rem] sm:text-[4.75rem] lg:text-[5.5rem] leading-none tracking-tight text-ink mb-3"
              aria-label="patapata"
            >
              パタ<span className="text-shu-deep dark:text-shu">パタ</span>
            </h1>
            <p className="font-mono text-[12px] text-ink-soft tracking-[0.18em] mb-8">
              patapata · ptpt
            </p>

            <p className="font-gothic text-base text-ink leading-[1.85] max-w-md mb-8">
              <InlineMd text={content.hero.tagline} />
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              <Badge>v{VERSIONS.core}</Badge>
              <Badge>{content.hero.badges.license}</Badge>
              <Badge>{content.hero.badges.ssr}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <Cta to={demoUrl} variant="primary">
                {content.hero.ctaDemo}
              </Cta>
              <a
                href={NPM_URL}
                target="_blank"
                rel="noreferrer"
                className="font-gothic text-sm text-ink-mute hover:text-shu-deep dark:hover:text-shu transition-colors underline decoration-rule decoration-from-font underline-offset-4"
              >
                {content.hero.ctaNpm}
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noreferrer"
                className="font-gothic text-sm text-ink-mute hover:text-shu-deep dark:hover:text-shu transition-colors underline decoration-rule decoration-from-font underline-offset-4"
              >
                {content.hero.ctaGithub}
              </a>
            </div>
          </div>

          {/* Right column: live vertical sample, now the wider column. */}
          <div
            className="col-span-12 lg:col-span-7 wa-fade-up mt-12 lg:mt-0"
            style={{ animationDelay: "320ms" }}
          >
            <figure
              className="relative px-5 sm:px-8 lg:px-12 py-2 overflow-hidden"
              style={{
                borderLeft: "1px solid var(--color-rule)",
                borderRight: "1px solid var(--color-rule)",
              }}
            >
              {/* shu chapter accent on the left rule */}
              <span
                aria-hidden="true"
                className="absolute -left-px top-0 w-px h-16 sm:h-20 bg-shu wa-rule-draw"
              />

              {/* Atmospheric watermark — giant ぱ in shu-wash. Clamps with
                  viewport so it doesn't blow past mobile screens. */}
              <span
                aria-hidden="true"
                className="absolute -top-6 sm:-top-12 -right-4 sm:-right-8 font-mincho text-shu-wash select-none pointer-events-none leading-none"
                style={{ fontSize: "clamp(13rem, 55vw, 26rem)", opacity: 0.55 }}
              >
                ぱ
              </span>

              {/* Tiny caption in the right gutter. Hidden on the smallest
                  screens where it competes for space with the watermark. */}
              <span
                aria-hidden="true"
                className="hidden sm:block absolute right-2 top-2 font-gothic text-[10px] uppercase tracking-[0.4em] text-ink-soft select-none"
                style={{ writingMode: "vertical-rl" }}
              >
                live · split-flap
              </span>

              {/* Live split-flap board — flips between destinations like a real
                  departure display. The protagonist of the hero. */}
              <div className="relative flex items-center justify-center min-h-[clamp(14rem,40vw,20rem)]">
                <PatapataBoard
                  cellOptions={{ preset: presets.alphanumeric }}
                  targets={HERO_SAMPLE}
                  flipMode="replace"
                  className="ptpt-board"
                  style={{ display: "flex", gap: "0.4rem" }}
                />
              </div>
            </figure>

            {/* Caption strip below the figure: the <PatapataBoard> markup in
                mono with a small shu seal on the left marking it as the page's
                signature. */}
            <figcaption className="mt-6 flex items-baseline gap-3 px-5 sm:px-8 lg:px-12">
              <span
                aria-hidden="true"
                className="block w-4 h-px bg-shu translate-y-[-3px] flex-shrink-0"
              />
              <p className="font-mono text-[10px] sm:text-[11px] text-ink-mute break-all flex-1">
                {`<PatapataBoard targets="${HERO_SAMPLE}" />`}
              </p>
            </figcaption>
          </div>
        </div>
      </section>

      {/* No breadcrumbs on the landing — the page IS home; rendering a
          "Home / patapata" trail just doubles up the title. */}

      <div className="px-5 sm:px-6 lg:px-12 lg:pl-20 max-w-6xl mx-auto pb-20 sm:pb-24">
        {/* —— Problem ——————————————————————————————————————————————— */}
        <Section n={1} eyebrow="Why" heading={content.problem.heading}>
          <Prose>{content.problem.body}</Prose>
        </Section>

        {/* —— Family ——————————————————————————————————————————————— */}
        <Section n={2} eyebrow="Packages" heading={content.family.heading}>
          <Prose>{content.family.description}</Prose>

          <div className="mt-10">
            <p className="font-gothic text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-4">
              {content.family.coreLabel}
            </p>
            <Link
              to={adapterMap.core.href(locale) as `/${string}`}
              className="group block py-6 transition-colors"
              style={{
                borderTop: "1px solid var(--color-rule)",
                borderBottom: "1px solid var(--color-rule)",
              }}
            >
              <div className="grid grid-cols-12 gap-4 items-baseline">
                <div className="col-span-12 sm:col-span-4">
                  <p className="font-mono text-base text-ink group-hover:text-shu-deep dark:group-hover:text-shu transition-colors break-all">
                    {coreItem.name}
                  </p>
                  <p className="font-mono text-[11px] text-ink-soft tracking-wider mt-1">
                    v{VERSIONS.core}
                  </p>
                </div>
                <div className="col-span-12 sm:col-span-8">
                  <p className="font-mincho text-lg text-ink leading-snug mb-1.5">
                    {coreItem.role}
                  </p>
                  <p className="text-sm text-ink-mute leading-relaxed">
                    <InlineMd text={coreItem.description} />
                  </p>
                </div>
              </div>
            </Link>
          </div>

          <div className="mt-10">
            <p className="font-gothic text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-4">
              {content.family.adaptersLabel}
            </p>
            <ul className="grid sm:grid-cols-2 gap-x-8">
              {adapterItems.map((pkg, i) => {
                const meta = adapterMap[asAdapterKey(pkg.name)];
                return (
                  <li
                    key={pkg.name}
                    className={i < 2 ? "" : "sm:pt-0"}
                    style={{
                      borderTop: "1px solid var(--color-rule)",
                    }}
                  >
                    <Link to={meta.href(locale) as `/${string}`} className="group block py-5">
                      <div className="flex items-baseline gap-2 mb-1.5 flex-wrap">
                        <p className="font-mono text-sm text-ink group-hover:text-shu-deep dark:group-hover:text-shu transition-colors break-all">
                          {pkg.name}
                        </p>
                        {pkg.isNew && <NewBadge />}
                      </div>
                      <p className="font-mincho text-base text-ink leading-snug mb-1">{pkg.role}</p>
                      <p className="text-sm text-ink-mute leading-relaxed">
                        <InlineMd text={pkg.description} />
                      </p>
                      <div className="flex items-center justify-between mt-3 text-xs">
                        {pkg.tagline ? (
                          <span className="font-mincho text-ink-soft italic">{pkg.tagline}</span>
                        ) : (
                          <span />
                        )}
                        <span className="font-gothic text-ink-mute group-hover:text-shu-deep dark:group-hover:text-shu transition-colors uppercase tracking-[0.18em]">
                          {content.family.viewLabel} →
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </Section>

        {/* —— Shared CSS —————————————————————————————————————————— */}
        <Section n={3} eyebrow="Stylesheet" heading={content.shared.heading}>
          <Prose>{content.shared.description}</Prose>
          <SnippetBlock label="recommended.css" code={RECOMMENDED_CSS} language="css" />
        </Section>

        {/* —— Behavior ——————————————————————————————————————————— */}
        <Section n={4} eyebrow="Behaviour" heading={content.behavior.heading}>
          <ul className="space-y-3 text-ink leading-relaxed">
            {content.behavior.items.map((item, i) => (
              <li key={i} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="font-mincho text-shu-deep dark:text-shu mt-0.5 select-none"
                >
                  ・
                </span>
                <span className="flex-1">
                  <InlineMd text={item} />
                </span>
              </li>
            ))}
          </ul>
        </Section>

        {/* —— Browser —————————————————————————————————————————— */}
        <Section n={5} eyebrow="Browser support" heading={content.browser.heading}>
          <Prose>{content.browser.body}</Prose>
        </Section>

        {/* —— Versioning —————————————————————————————————————— */}
        <Section n={6} eyebrow="Versioning" heading={content.versioning.heading}>
          <Prose>{content.versioning.body}</Prose>
        </Section>

        {/* —— License —————————————————————————————————————————— */}
        <Section n={7} eyebrow="License" heading={content.license.heading}>
          <Prose>{content.license.body}</Prose>
        </Section>

        {/* —— CTA strip ——————————————————————————————————————— */}
        <section className="mt-16 pt-12" style={{ borderTop: "1px solid var(--color-rule)" }}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <h2 className="font-mincho text-2xl text-ink leading-snug mb-1">
                {content.cta.heading}
              </h2>
              <p className="text-sm text-ink-mute leading-relaxed max-w-md">
                <InlineMd text={content.cta.body} />
              </p>
            </div>
            <Cta to={demoUrl} variant="primary">
              {content.cta.button}
            </Cta>
          </div>
        </section>
      </div>
    </div>
  );
}

function asAdapterKey(name: string): "react" | "vue" | "rehype" | "astro" {
  if (name.endsWith("-react")) return "react";
  if (name.endsWith("-vue")) return "vue";
  if (name.endsWith("-rehype")) return "rehype";
  return "astro";
}
