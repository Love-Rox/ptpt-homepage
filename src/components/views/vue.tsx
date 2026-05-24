import AdapterPage from "@/components/views/_adapter-page";
import { COMPONENT_OPTIONS, SHARED_OPTIONS } from "@/components/ptpt/shared";
import type { Locale } from "@/lib/locale";
import langJa from "@private/lang/pages/ja/vue.json";
import langEn from "@private/lang/pages/en/vue.json";
import landingJa from "@private/lang/pages/ja/index.json";
import landingEn from "@private/lang/pages/en/index.json";

const data = { en: langEn, ja: langJa };
const landing = { en: landingEn, ja: landingJa };

const PKG = "@love-rox/ptpt-vue";

const vueSnippet = `<script setup lang="ts">
import { PatapataBoard } from "@love-rox/ptpt-vue";
import "@love-rox/ptpt-core/styles.css";
</script>

<template>
  <PatapataBoard
    :cell-options="{ preset: 'alphanumeric' }"
    targets="TOKYO  "
    flip-mode="replace"
  />
</template>`;

export default async function VueView({ locale }: { locale: Locale }) {
  const content = data[locale];
  return (
    <AdapterPage
      locale={locale}
      adapterKey="vue"
      pkg={PKG}
      ghFolder="vue"
      thirdBadge="vue 3.x"
      content={content}
      landing={landing[locale]}
      usage={[
        {
          label: content.usage.snippetLabel,
          language: "vue",
          code: vueSnippet,
        },
      ]}
      optionGroups={[
        { label: content.options.sharedLabel, rows: SHARED_OPTIONS[locale] },
        { label: content.options.componentLabel, rows: COMPONENT_OPTIONS[locale] },
      ]}
    />
  );
}
