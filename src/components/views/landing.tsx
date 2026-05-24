import { Link } from "waku";
import { presets } from "@love-rox/ptpt-core";
import { PatapataBoard } from "@love-rox/ptpt-react";
import "@love-rox/ptpt-core/styles.css";
import { Meta } from "@/components/global/meta";
import {
  ADAPTERS,
  Badge,
  Cta,
  FlapWord,
  InlineMd,
  Prose,
  RECOMMENDED_CSS,
  Section,
  SnippetBlock,
  StatusPill,
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

type FamilyItem = {
  name: string;
  role: string;
  description: string;
  tagline?: string;
  isNew?: boolean;
};

export default async function LandingView({ locale }: { locale: Locale }) {
  const content = data[locale];
  const url = localePath(locale, "");
  const demoUrl = localePath(locale, "demo");

  // The package family, arranged as a departures board: each package is a
  // "service" with a gate, a destination (its name), a route (its role) and a
  // status lamp.
  const items = content.family.items as Record<string, FamilyItem>;
  const departures = ADAPTERS.map((a, i) => ({
    meta: a,
    item: items[a.key],
    gate: `A${i + 1}`,
    ver: VERSIONS[a.key],
    status: a.status,
  }));

  return (
    <div className="relative">
      <Meta
        title={`${content.hero.heading} - ${content.hero.eyebrow}`}
        description={stripMd(content.hero.tagline)}
        image={`/api/og?title=${encodeURIComponent(content.hero.heading)}&eyebrow=${encodeURIComponent(content.hero.eyebrow)}`}
        url={url}
        lang={locale}
      />

      {/* —— HERO ——————————————————————————————————————————————————————
          The live split-flap board is the protagonist, framed inside a real
          departures-board housing. The metadata + CTAs sit on the left. */}
      <section className="relative px-5 sm:px-6 lg:px-12 pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pt-16 lg:pb-32 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-12 gap-x-6 lg:gap-x-16 items-center">
          {/* Left column: eyebrow + wordmark + tagline + badges + CTAs */}
          <div className="col-span-12 lg:col-span-5 wa-fade-up" style={{ animationDelay: "120ms" }}>
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-shu-deep dark:text-shu mb-6">
              {content.hero.eyebrow}
            </p>
            {/* Wordmark — signage caps; second half lit amber. aria-label feeds
                screen readers the canonical romaji. */}
            <h1
              className="font-display uppercase text-[3rem] xs:text-[3.5rem] sm:text-[4.75rem] lg:text-[5.25rem] leading-none tracking-tight text-ink mb-4"
              aria-label="patapata"
            >
              パタ<span className="text-shu-deep dark:text-shu">パタ</span>
            </h1>
            <FlapWord text="PATAPATA" className="mb-8 text-[12px]" ariaLabel="patapata" />

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

          {/* Right column: the live board inside a Solari housing. */}
          <div
            className="col-span-12 lg:col-span-7 wa-fade-up mt-12 lg:mt-0"
            style={{ animationDelay: "320ms" }}
          >
            <figure className="board flap-in overflow-hidden">
              {/* legend strip */}
              <div className="board-head flex items-center justify-between gap-4 px-4 sm:px-5 h-9">
                <span>now departing</span>
                <span className="flex items-center gap-3">
                  <span className="hidden sm:inline">gate a1</span>
                  <span className="pill pill-boarding" style={{ border: 0, padding: 0 }}>
                    <span aria-hidden="true" className="pill-lamp" />
                    boarding
                  </span>
                </span>
              </div>

              {/* the live split-flap board */}
              <div className="relative flex items-center justify-center px-3 sm:px-6 py-10 sm:py-12 min-h-[clamp(11rem,32vw,17rem)]">
                <PatapataBoard
                  cellOptions={{ preset: presets.alphanumeric }}
                  targets={HERO_SAMPLE}
                  flipMode="replace"
                  className="ptpt-board"
                  style={{ display: "flex", gap: "0.35rem" }}
                />
              </div>

              {/* markup caption */}
              <figcaption className="flex items-center gap-3 px-4 sm:px-5 h-10 border-t border-rule">
                <span aria-hidden="true" className="block w-3 h-px bg-shu flex-shrink-0" />
                <p className="font-mono text-[10px] sm:text-[11px] text-ink-mute break-all">
                  {`<PatapataBoard targets="${HERO_SAMPLE}" />`}
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <div className="px-5 sm:px-6 lg:px-12 max-w-6xl mx-auto pb-20 sm:pb-24">
        {/* —— Problem ——————————————————————————————————————————————— */}
        <Section n={1} eyebrow="Why" heading={content.problem.heading}>
          <Prose>{content.problem.body}</Prose>
        </Section>

        {/* —— Family: the departures board ———————————————————————————— */}
        <Section n={2} eyebrow="Departures" heading={content.family.heading}>
          <Prose>{content.family.description}</Prose>

          <div className="board mt-8">
            {/* column legend */}
            <div className="board-head grid grid-cols-12 gap-3 items-center px-4 sm:px-5 h-9">
              <span className="col-span-5 sm:col-span-3">dest</span>
              <span className="hidden sm:block sm:col-span-5">via</span>
              <span className="col-span-3 sm:col-span-1">gate</span>
              <span className="col-span-4 sm:col-span-3 text-right">status</span>
            </div>

            {departures.map((row, i) => (
              <Link
                key={row.meta.key}
                to={row.meta.href(locale) as `/${string}`}
                className="flap-row flap-in group grid grid-cols-12 gap-3 items-center px-4 sm:px-5 py-4"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <div className="col-span-5 sm:col-span-3 min-w-0">
                  <p className="font-display uppercase tracking-wide text-base sm:text-lg leading-none text-ink group-hover:text-shu-deep dark:group-hover:text-shu transition-colors">
                    {row.meta.short}
                  </p>
                  <p className="font-mono text-[10px] text-ink-soft mt-1 truncate">
                    {row.item.name} · v{row.ver}
                  </p>
                </div>
                <div className="hidden sm:block sm:col-span-5 min-w-0">
                  <p className="font-mincho text-sm text-ink leading-snug">{row.item.role}</p>
                  <p className="text-xs text-ink-mute leading-relaxed truncate">
                    <InlineMd text={row.item.description} />
                  </p>
                </div>
                <div className="col-span-3 sm:col-span-1">
                  <span className="flap-chip text-shu-deep dark:text-shu" style={{ fontSize: "13px" }}>
                    {row.gate}
                  </span>
                </div>
                <div className="col-span-4 sm:col-span-3 flex justify-end">
                  <StatusPill kind={row.status}>
                    {row.status === "new" ? "new" : "on time"}
                  </StatusPill>
                </div>
              </Link>
            ))}
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
                  className="text-shu-deep dark:text-shu mt-1 select-none text-[10px]"
                >
                  ▸
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

        {/* —— CTA strip — a boarding call ——————————————————————— */}
        <section className="board mt-16 px-6 sm:px-8 py-8 sm:py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-shu-deep dark:text-shu mb-3">
                final call · boarding
              </p>
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
