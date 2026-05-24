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
import type { getConfig as File_En404_getConfig } from './pages/en/404';
// prettier-ignore
import type { getConfig as File_EnAstro_getConfig } from './pages/en/astro';
// prettier-ignore
import type { getConfig as File_EnBlogSlug_getConfig } from './pages/en/blog/[slug]';
// prettier-ignore
import type { getConfig as File_EnBlogIndex_getConfig } from './pages/en/blog/index';
// prettier-ignore
import type { getConfig as File_EnDemo_getConfig } from './pages/en/demo';
// prettier-ignore
import type { getConfig as File_EnIndex_getConfig } from './pages/en/index';
// prettier-ignore
import type { getConfig as File_EnReact_getConfig } from './pages/en/react';
// prettier-ignore
import type { getConfig as File_EnRehype_getConfig } from './pages/en/rehype';
// prettier-ignore
import type { getConfig as File_EnVue_getConfig } from './pages/en/vue';
// prettier-ignore
import type { getConfig as File_Index_getConfig } from './pages/index';
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
| ({ path: '/en/404' } & GetConfigResponse<typeof File_En404_getConfig>)
| ({ path: '/en/astro' } & GetConfigResponse<typeof File_EnAstro_getConfig>)
| ({ path: '/en/blog/[slug]' } & GetConfigResponse<typeof File_EnBlogSlug_getConfig>)
| ({ path: '/en/blog' } & GetConfigResponse<typeof File_EnBlogIndex_getConfig>)
| ({ path: '/en/demo' } & GetConfigResponse<typeof File_EnDemo_getConfig>)
| ({ path: '/en' } & GetConfigResponse<typeof File_EnIndex_getConfig>)
| ({ path: '/en/react' } & GetConfigResponse<typeof File_EnReact_getConfig>)
| ({ path: '/en/rehype' } & GetConfigResponse<typeof File_EnRehype_getConfig>)
| ({ path: '/en/vue' } & GetConfigResponse<typeof File_EnVue_getConfig>)
| ({ path: '/' } & GetConfigResponse<typeof File_Index_getConfig>)
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
