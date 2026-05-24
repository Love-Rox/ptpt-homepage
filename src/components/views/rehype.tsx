import AdapterPage from "@/components/views/_adapter-page";
import { REHYPE_OPTIONS, SHARED_OPTIONS } from "@/components/ptpt/shared";
import type { Locale } from "@/lib/locale";
import langJa from "@private/lang/pages/ja/rehype.json";
import langEn from "@private/lang/pages/en/rehype.json";
import landingJa from "@private/lang/pages/ja/index.json";
import landingEn from "@private/lang/pages/en/index.json";

const data = { en: langEn, ja: langJa };
const landing = { en: landingEn, ja: landingJa };

const PKG = "@love-rox/ptpt-rehype";

const markdownSnippet = `import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import rehypePtpt from "@love-rox/ptpt-rehype";

// Markdown marks a board with the marker class (or a \`\`\`patapata fence):
const md = '<span class="patapata" data-preset="alphanumeric">TOKYO</span>';

const html = String(
  await unified()
    .use(remarkParse)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypePtpt)
    .use(rehypeStringify)
    .process(md),
);
// <span class="ptpt" data-ptpt-targets="TOKYO" data-ptpt-preset="alphanumeric">TOKYO</span>`;

const htmlOnlySnippet = `// Browser entry — animate everything the plugin emitted.
import { hydrate } from "@love-rox/ptpt-rehype/client";
import "@love-rox/ptpt-core/styles.css";

// scans the document for [data-ptpt-targets] and flips them into boards
hydrate();`;

export default async function RehypeView({ locale }: { locale: Locale }) {
  const content = data[locale];
  return (
    <AdapterPage
      locale={locale}
      adapterKey="rehype"
      pkg={PKG}
      ghFolder="rehype"
      thirdBadge="build-time"
      content={content}
      landing={landing[locale]}
      usage={[
        { label: content.usage.snippetLabel, language: "ts", code: markdownSnippet },
        {
          heading: content.usage.htmlOnlyHeading,
          description: content.usage.htmlOnlyDescription,
          label: content.usage.htmlOnlyLabel,
          language: "ts",
          code: htmlOnlySnippet,
        },
      ]}
      optionGroups={[
        { label: content.options.sharedLabel, rows: SHARED_OPTIONS[locale] },
        { label: content.options.pluginLabel, rows: REHYPE_OPTIONS[locale] },
      ]}
    />
  );
}
