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
import rehypeStringify from "rehype-stringify";
import rehypePtpt from "@love-rox/ptpt-rehype";

const html = String(
  await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePtpt)
    .use(rehypeStringify)
    .process("TOKYO"),
);
// <span class="ptpt" data-target="TOKYO">…split-flap markup…</span>`;

const htmlOnlySnippet = `import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypePtpt from "@love-rox/ptpt-rehype";

const html = String(
  await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypePtpt)
    .use(rehypeStringify)
    .process("<p>TOKYO</p>"),
);`;

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
