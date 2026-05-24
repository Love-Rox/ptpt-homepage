import type { ReactNode } from "react";
import { Link } from "waku";
import { Meta } from "@/components/global/meta";
import { Breadcrumbs, generateBreadcrumbItems } from "@/components/common/breadcrumbs";
import { BreadcrumbSchema } from "@/components/seo/structured-data";
import {
  ADAPTERS,
  AdapterNav,
  type AdapterKey,
  Badge,
  Cta,
  InlineMd,
  InstallCommands,
  npmUrl,
  githubPackageUrl,
  type OptionRow,
  OptionsTable,
  Prose,
  Section,
  SnippetBlock,
  StatusPill,
  stripMd,
} from "@/components/ptpt/shared";
import { localePath, type Locale } from "@/lib/locale";
import { VERSIONS } from "@/lib/versions";

export interface AdapterUsageBlock {
  /** Sub-heading shown above the snippet (omit for the first snippet which uses
      the section's main heading). */
  heading?: string;
  description?: string;
  label: string;
  language: string;
  code: string;
}

export interface AdapterOptionGroup {
  label: string;
  rows: OptionRow[];
}

export interface AdapterPageProps {
  locale: Locale;
  adapterKey: AdapterKey;
  pkg: string;
  /** GitHub folder under packages/ — e.g. "react", "vue", "rehype", "astro". */
  ghFolder: string;
  /** Third badge after version + MIT (varies by adapter). */
  thirdBadge: string;
  /** i18n content for this adapter (loaded from private/lang/pages/{lang}/<adapter>.json). */
  content: any;
  /** Landing page content (for breadcrumb label). */
  landing: any;
  usage: AdapterUsageBlock[];
  /** Optional extra section that lives between Install and Usage (used by Astro). */
  extraSection?: ReactNode;
  /** Always-on shared options + 0..n adapter-specific groups, rendered in order. */
  optionGroups: AdapterOptionGroup[];
}

/**
 * Shared layout for the four adapter pages. Each adapter view is a ~40 line
 * thin wrapper that supplies content + snippets; the visual structure lives
 * here so design tweaks land in one place.
 */
export default async function AdapterPage({
  locale,
  adapterKey,
  pkg,
  ghFolder,
  thirdBadge,
  content,
  landing,
  usage,
  extraSection,
  optionGroups,
}: AdapterPageProps) {
  const url = localePath(locale, ghFolder);
  const familyUrl = localePath(locale, "");
  const demoUrl = localePath(locale, "demo");
  const status = ADAPTERS.find((a) => a.key === adapterKey)?.status ?? "ontime";

  return (
    <div className="relative">
      <Meta
        title={`${content.hero.heading} - ${content.hero.eyebrow}`}
        description={stripMd(content.hero.tagline)}
        image={`/api/og?title=${encodeURIComponent(content.hero.heading)}&eyebrow=${encodeURIComponent(content.hero.eyebrow)}`}
        url={url}
        lang={locale}
      />
      <BreadcrumbSchema
        items={generateBreadcrumbItems(
          [
            { label: landing.hero.heading, href: familyUrl },
            { label: content.hero.eyebrow, href: url },
          ],
          locale,
        )}
      />

      <div className="px-5 sm:px-6 lg:px-12 max-w-6xl mx-auto pt-8 sm:pt-10 lg:pt-14">
        <Breadcrumbs
          items={[
            { label: landing.hero.heading, href: familyUrl },
            { label: content.hero.eyebrow },
          ]}
          lang={locale}
        />
      </div>

      <div className="px-5 sm:px-6 lg:px-12 max-w-6xl mx-auto pb-20 sm:pb-24">
        <AdapterNav current={adapterKey} locale={locale} />

        {/* —— hero ——————————————————————————————————————————————— */}
        <section className="mb-20 wa-fade-up" style={{ animationDelay: "120ms" }}>
          <div className="flex items-center gap-3 mb-4">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-shu-deep dark:text-shu">
              {content.hero.eyebrow}
            </p>
            <StatusPill kind={status}>{status === "new" ? "new" : "on time"}</StatusPill>
          </div>

          <h1 className="font-mono font-medium text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] leading-[1.05] tracking-tight text-ink mb-6 break-all">
            {content.hero.heading}
          </h1>

          <p className="font-gothic text-lg text-ink leading-[1.85] max-w-2xl mb-8">
            <InlineMd text={content.hero.tagline} />
          </p>

          <div className="flex flex-wrap gap-2 mb-10">
            <Badge>v{VERSIONS[adapterKey]}</Badge>
            <Badge>MIT</Badge>
            <Badge>{thirdBadge}</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Cta to={demoUrl} variant="primary">
              {content.hero.ctaDemo}
            </Cta>
            <a
              href={npmUrl(pkg)}
              target="_blank"
              rel="noreferrer"
              className="font-gothic text-sm text-ink-mute hover:text-shu-deep dark:hover:text-shu transition-colors underline decoration-rule decoration-from-font underline-offset-4"
            >
              {content.hero.ctaNpm}
            </a>
            <a
              href={githubPackageUrl(ghFolder)}
              target="_blank"
              rel="noreferrer"
              className="font-gothic text-sm text-ink-mute hover:text-shu-deep dark:hover:text-shu transition-colors underline decoration-rule decoration-from-font underline-offset-4"
            >
              {content.hero.ctaGithub}
            </a>
          </div>
        </section>

        {/* —— install —————————————————————————————————————————— */}
        <Section n={1} eyebrow="Install" heading={content.install.heading}>
          <Prose>{content.install.description}</Prose>
          <InstallCommands pkg={pkg} />
        </Section>

        {/* —— optional extra section (e.g. Astro's twoPieces) ———————— */}
        {extraSection}

        {/* —— usage —————————————————————————————————————————— */}
        <Section n={extraSection ? 3 : 2} eyebrow="Usage" heading={content.usage.heading}>
          <Prose>{content.usage.description}</Prose>

          {usage.map((u, i) => (
            <div key={i} className={i > 0 ? "mt-10" : ""}>
              {u.heading && <h3 className="font-mincho text-xl text-ink mt-2 mb-3">{u.heading}</h3>}
              {u.description && <Prose>{u.description}</Prose>}
              <SnippetBlock label={u.label} code={u.code} language={u.language} />
            </div>
          ))}
        </Section>

        {/* —— options —————————————————————————————————————————— */}
        <Section n={extraSection ? 4 : 3} eyebrow="Options" heading={content.options.heading}>
          <Prose>{content.options.description}</Prose>

          {optionGroups.map((g, i) => (
            <div key={g.label} className={i > 0 ? "mt-10" : "mt-6"}>
              <h3 className="font-mincho text-xl text-ink mb-3">{g.label}</h3>
              <OptionsTable columns={content.options.columns} rows={g.rows} />
            </div>
          ))}
        </Section>

        {/* —— behaviour —————————————————————————————————————————— */}
        <Section n={extraSection ? 5 : 4} eyebrow="Behaviour" heading={content.behavior.heading}>
          <ul className="space-y-3 text-ink leading-relaxed">
            {content.behavior.items.map((item: string, i: number) => (
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

        {/* —— related —————————————————————————————————————————— */}
        <Section n={extraSection ? 6 : 5} eyebrow="Related" heading={content.related.heading}>
          <Prose>{content.related.description}</Prose>
        </Section>

        {/* —— back link —————————————————————————————————————————— */}
        <div className="mt-16 pt-10" style={{ borderTop: "1px solid var(--color-rule)" }}>
          <Link
            to={familyUrl as `/${string}`}
            className="font-gothic text-sm text-ink-mute hover:text-shu-deep dark:hover:text-shu transition-colors underline decoration-rule decoration-from-font underline-offset-4"
          >
            {content.hero.backToFamily}
          </Link>
        </div>
      </div>
    </div>
  );
}
