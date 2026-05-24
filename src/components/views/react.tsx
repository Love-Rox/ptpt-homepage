import AdapterPage from "@/components/views/_adapter-page";
import { COMPONENT_OPTIONS, SHARED_OPTIONS } from "@/components/ptpt/shared";
import type { Locale } from "@/lib/locale";
import langJa from "@private/lang/pages/ja/react.json";
import langEn from "@private/lang/pages/en/react.json";
import landingJa from "@private/lang/pages/ja/index.json";
import landingEn from "@private/lang/pages/en/index.json";

const data = { en: langEn, ja: langJa };
const landing = { en: landingEn, ja: landingJa };

const PKG = "@love-rox/ptpt-react";

const reactSnippet = `import { PatapataBoard } from "@love-rox/ptpt-react";
import { alphanumericPreset } from "@love-rox/ptpt-core/presets/alphanumeric";
import "@love-rox/ptpt-core/styles.css";

export function Departures() {
  return (
    <PatapataBoard
      cellOptions={{ preset: alphanumericPreset }}
      targets="TOKYO  "
      flipMode="replace"
    />
  );
}`;

export default async function ReactView({ locale }: { locale: Locale }) {
  const content = data[locale];
  return (
    <AdapterPage
      locale={locale}
      adapterKey="react"
      pkg={PKG}
      ghFolder="react"
      thirdBadge="SSR-safe"
      content={content}
      landing={landing[locale]}
      usage={[
        {
          label: content.usage.snippetLabel,
          language: "tsx",
          code: reactSnippet,
        },
      ]}
      optionGroups={[
        { label: content.options.sharedLabel, rows: SHARED_OPTIONS[locale] },
        { label: content.options.componentLabel, rows: COMPONENT_OPTIONS[locale] },
      ]}
    />
  );
}
