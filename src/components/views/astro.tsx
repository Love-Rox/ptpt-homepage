import AdapterPage from "@/components/views/_adapter-page";
import {
  ASTRO_INTEGRATION_OPTIONS,
  InlineMd,
  REHYPE_OPTIONS,
  Section,
  SHARED_OPTIONS,
} from "@/components/ptpt/shared";
import type { Locale } from "@/lib/locale";
import langJa from "@private/lang/pages/ja/astro.json";
import langEn from "@private/lang/pages/en/astro.json";
import landingJa from "@private/lang/pages/ja/index.json";
import landingEn from "@private/lang/pages/en/index.json";

const data = { en: langEn, ja: langJa };
const landing = { en: landingEn, ja: landingJa };

const PKG = "@love-rox/ptpt-astro";

const integrationSnippet = `// astro.config.mjs
import { defineConfig } from "astro/config";
import ptpt from "@love-rox/ptpt-astro";

export default defineConfig({
  integrations: [ptpt()],
});`;

const integrationWithOptionsSnippet = `// astro.config.mjs
import { defineConfig } from "astro/config";
import ptpt from "@love-rox/ptpt-astro";

export default defineConfig({
  integrations: [
    ptpt({
      // forward rehype options (e.g. a default preset name)
      markdown: { defaultPreset: "alphanumeric" },
      styles: true,
      hydrate: true,
    }),
  ],
});`;

const componentSnippet = `---
import Patapata from "@love-rox/ptpt-astro/Patapata.astro";
import PatapataBoard from "@love-rox/ptpt-astro/PatapataBoard.astro";
---

<!-- preset is a built-in preset NAME, resolved by the hydrator -->
<Patapata target="TOKYO" preset="alphanumeric" />

<PatapataBoard targets={\`TOKYO\\nOSAKA\`} preset="alphanumeric" />`;

export default async function AstroView({ locale }: { locale: Locale }) {
  const content = data[locale];

  // Astro is the only adapter with a "two pieces" intermezzo (integration vs
  // standalone component). Render it inline as the extraSection prop.
  const twoPieces = (
    <Section n={2} eyebrow="Pieces" heading={content.twoPieces.heading}>
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mt-2">
        {content.twoPieces.items.map((piece: { name: string; description: string }) => (
          <div
            key={piece.name}
            className="pt-4"
            style={{ borderTop: "1px solid var(--color-rule)" }}
          >
            <p className="font-mono text-sm text-ink mb-2 break-all">{piece.name}</p>
            <p className="text-sm text-ink-mute leading-relaxed">
              <InlineMd text={piece.description} />
            </p>
          </div>
        ))}
      </div>
    </Section>
  );

  // shared options + rehype passthrough live in one combined table for Astro,
  // and integration-specific options live in their own.
  const sharedAndRehype = [...SHARED_OPTIONS[locale], ...REHYPE_OPTIONS[locale]];

  return (
    <AdapterPage
      locale={locale}
      adapterKey="astro"
      pkg={PKG}
      ghFolder="astro"
      thirdBadge="astro >= 4"
      content={content}
      landing={landing[locale]}
      extraSection={twoPieces}
      usage={[
        {
          label: content.usage.integrationLabel,
          language: "ts",
          code: integrationSnippet,
        },
        {
          heading: content.usage.withOptionsHeading,
          description: content.usage.withOptionsDescription,
          label: content.usage.withOptionsLabel,
          language: "ts",
          code: integrationWithOptionsSnippet,
        },
        {
          heading: content.usage.componentHeading,
          description: content.usage.componentDescription,
          label: content.usage.componentLabel,
          language: "astro",
          code: componentSnippet,
        },
      ]}
      optionGroups={[
        { label: content.options.sharedLabel, rows: sharedAndRehype },
        { label: content.options.integrationLabel, rows: ASTRO_INTEGRATION_OPTIONS[locale] },
      ]}
    />
  );
}
