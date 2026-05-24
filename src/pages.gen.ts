// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages, GetConfigResponse } from 'waku/router';

// prettier-ignore
import type { getConfig as File_404_getConfig } from './pages/404';
// prettier-ignore
import type { getConfig as File_ApiApiOg_getConfig } from './pages/_api/api/og';
// prettier-ignore
import type { getConfig as File_Astro_getConfig } from './pages/astro';
// prettier-ignore
import type { getConfig as File_BlogSlug_getConfig } from './pages/blog/[slug]';
// prettier-ignore
import type { getConfig as File_BlogIndex_getConfig } from './pages/blog/index';
// prettier-ignore
import type { getConfig as File_Demo_getConfig } from './pages/demo';
// prettier-ignore
import type { getConfig as File_Index_getConfig } from './pages/index';
// prettier-ignore
import type { getConfig as File_Ja404_getConfig } from './pages/ja/404';
// prettier-ignore
import type { getConfig as File_JaAstro_getConfig } from './pages/ja/astro';
// prettier-ignore
import type { getConfig as File_JaBlogSlug_getConfig } from './pages/ja/blog/[slug]';
// prettier-ignore
import type { getConfig as File_JaBlogIndex_getConfig } from './pages/ja/blog/index';
// prettier-ignore
import type { getConfig as File_JaDemo_getConfig } from './pages/ja/demo';
// prettier-ignore
import type { getConfig as File_JaIndex_getConfig } from './pages/ja/index';
// prettier-ignore
import type { getConfig as File_JaReact_getConfig } from './pages/ja/react';
// prettier-ignore
import type { getConfig as File_JaRehype_getConfig } from './pages/ja/rehype';
// prettier-ignore
import type { getConfig as File_JaVue_getConfig } from './pages/ja/vue';
// prettier-ignore
import type { getConfig as File_React_getConfig } from './pages/react';
// prettier-ignore
import type { getConfig as File_Rehype_getConfig } from './pages/rehype';
// prettier-ignore
import type { getConfig as File_Vue_getConfig } from './pages/vue';

// prettier-ignore
type Page =
| ({ path: '/404' } & GetConfigResponse<typeof File_404_getConfig>)
| ({ path: '/_api/api/og' } & GetConfigResponse<typeof File_ApiApiOg_getConfig>)
| ({ path: '/astro' } & GetConfigResponse<typeof File_Astro_getConfig>)
| ({ path: '/blog/[slug]' } & GetConfigResponse<typeof File_BlogSlug_getConfig>)
| ({ path: '/blog' } & GetConfigResponse<typeof File_BlogIndex_getConfig>)
| ({ path: '/demo' } & GetConfigResponse<typeof File_Demo_getConfig>)
| ({ path: '/' } & GetConfigResponse<typeof File_Index_getConfig>)
| ({ path: '/ja/404' } & GetConfigResponse<typeof File_Ja404_getConfig>)
| ({ path: '/ja/astro' } & GetConfigResponse<typeof File_JaAstro_getConfig>)
| ({ path: '/ja/blog/[slug]' } & GetConfigResponse<typeof File_JaBlogSlug_getConfig>)
| ({ path: '/ja/blog' } & GetConfigResponse<typeof File_JaBlogIndex_getConfig>)
| ({ path: '/ja/demo' } & GetConfigResponse<typeof File_JaDemo_getConfig>)
| ({ path: '/ja' } & GetConfigResponse<typeof File_JaIndex_getConfig>)
| ({ path: '/ja/react' } & GetConfigResponse<typeof File_JaReact_getConfig>)
| ({ path: '/ja/rehype' } & GetConfigResponse<typeof File_JaRehype_getConfig>)
| ({ path: '/ja/vue' } & GetConfigResponse<typeof File_JaVue_getConfig>)
| ({ path: '/react' } & GetConfigResponse<typeof File_React_getConfig>)
| ({ path: '/rehype' } & GetConfigResponse<typeof File_Rehype_getConfig>)
| ({ path: '/vue' } & GetConfigResponse<typeof File_Vue_getConfig>);

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>;
  }
  interface CreatePagesConfig {
    pages: Page;
  }
}
