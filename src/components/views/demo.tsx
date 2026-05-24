import { Link } from "waku";
import { Meta } from "@/components/global/meta";
import { Breadcrumbs, generateBreadcrumbItems } from "@/components/common/breadcrumbs";
import { BreadcrumbSchema } from "@/components/seo/structured-data";
import { DemoPlayground } from "@/components/ptpt/demo-playground";
import { localePath, type Locale } from "@/lib/locale";

const copy = {
  en: {
    packageLabel: "patapata",
    demoLabel: "Demo",
    eyebrow: "Interactive demo",
    heading: "Set the controls. Watch it flip.",
    description:
      "A live split-flap departure board. Pick a preset and a flip mode, then watch the cells ripple to the next destination — just like a real patapata display.",
    backToPackage: "← Back to overview",
    metaTitle: "patapata — interactive demo",
  },
  ja: {
    packageLabel: "patapata",
    demoLabel: "デモ",
    eyebrow: "インタラクティブ・デモ",
    heading: "操作盤を動かして、めくる。",
    description:
      "本物のパタパタ式発車案内板のように動くデモです。プリセットとフリップモードを選ぶと、セルが次の行き先へと波打つようにめくれます。",
    backToPackage: "← パッケージ紹介に戻る",
    metaTitle: "patapata — インタラクティブ・デモ",
  },
} as const;

export default async function DemoView({ locale }: { locale: Locale }) {
  const content = copy[locale];
  const url = localePath(locale, "demo");
  const packageUrl = localePath(locale, "");

  return (
    <div className="relative">
      <Meta
        title={content.metaTitle}
        description={content.description.replace(/<\/?[^>]+>/g, "")}
        image={`/api/og?title=${encodeURIComponent(content.metaTitle)}&eyebrow=${encodeURIComponent(content.packageLabel + " · " + content.demoLabel)}`}
        url={url}
        lang={locale}
      />
      <BreadcrumbSchema
        items={generateBreadcrumbItems(
          [
            { label: content.packageLabel, href: packageUrl },
            { label: content.demoLabel, href: url },
          ],
          locale,
        )}
      />

      <div className="px-5 sm:px-6 lg:px-12 max-w-6xl mx-auto pt-8 sm:pt-10 lg:pt-14">
        <Breadcrumbs
          items={[{ label: content.packageLabel, href: packageUrl }, { label: content.demoLabel }]}
          lang={locale}
        />
      </div>

      <div className="px-5 sm:px-6 lg:px-12 lg:pl-20 max-w-6xl mx-auto pb-20 sm:pb-24">
        <header className="mb-14 wa-fade-up" style={{ animationDelay: "120ms" }}>
          <p className="font-gothic text-[11px] uppercase tracking-[0.3em] text-shu-deep dark:text-shu mb-5">
            {content.eyebrow}
          </p>
          <h1 className="font-mincho text-[2rem] sm:text-[2.75rem] lg:text-[3.5rem] leading-[1.15] text-ink mb-5 sm:mb-6 max-w-3xl">
            {content.heading}
          </h1>
          <p className="font-gothic text-base text-ink-mute leading-[1.85] max-w-2xl">
            {content.description}
          </p>
          <span aria-hidden="true" className="block h-px w-12 bg-shu mt-8" />
        </header>

        <DemoPlayground lang={locale} />

        <div className="mt-16 pt-10" style={{ borderTop: "1px solid var(--color-rule)" }}>
          <Link
            to={packageUrl as `/${string}`}
            className="font-gothic text-sm text-ink-mute hover:text-shu-deep dark:hover:text-shu transition-colors underline decoration-rule decoration-from-font underline-offset-4"
          >
            {content.backToPackage}
          </Link>
        </div>
      </div>
    </div>
  );
}
