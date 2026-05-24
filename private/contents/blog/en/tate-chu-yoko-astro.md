---
title: patapata meets Astro - one line in astro.config.mjs, automatic patapata everywhere
date: 2026-05-03
author: Rox Team
tags: [Love-Rox, patapata, Astro, MDX, npm, release, Japanese-typography]
description: A fifth patapata package — `@love-rox/ptpt-astro` — wires the rehype plugin into Astro 4+'s Markdown and MDX pipelines and ships a `<Patapata>` component for `.astro` files. Add one line to `astro.config.mjs` and half-width alphanumerics in your vertical Japanese content get wrapped at build time.
excerpt: Since shipping the rehype plugin, the most common follow-up has been "what about Astro?". `@love-rox/ptpt-astro` is the answer — register the integration and `.md` / `.mdx` content gets patapata automatically; for `.astro` files, the `<Patapata>` component is in the same package. All five packages are now released on the same shared version line at `0.3.0`.
---

# patapata meets Astro - one line in astro.config.mjs, automatic patapata everywhere

We just shipped a fifth patapata package: **`@love-rox/ptpt-astro`** ✨

- 📦 [@love-rox/ptpt-astro@0.3.0](https://www.npmjs.com/package/@love-rox/ptpt-astro)
- 📦 [@love-rox/ptpt-rehype@0.3.0](https://www.npmjs.com/package/@love-rox/ptpt-rehype)
- 📦 [@love-rox/ptpt-react@0.3.0](https://www.npmjs.com/package/@love-rox/ptpt-react)
- 📦 [@love-rox/ptpt-vue@0.3.0](https://www.npmjs.com/package/@love-rox/ptpt-vue)
- 📦 [@love-rox/ptpt-core@0.3.0](https://www.npmjs.com/package/@love-rox/ptpt-core)
- 💾 GitHub: [Love-Rox/patapata](https://github.com/Love-Rox/patapata)
- 🎨 Package page: [/packages/patapata](/en/packages/patapata)
- 🎨 Astro-specific page: [/packages/patapata/astro](/en/packages/patapata/astro)

> The five packages are on a shared version line — whenever any of them changes, the others move to the same number. Adding the Astro package this round bumped all five to `0.3.0`.

## Why an Astro-specific package

As we wrote when [`@love-rox/ptpt-rehype` shipped](/en/blog/patapata-rehype), the rehype plugin is designed to drop into any `unified` pipeline. Astro uses `unified` under the hood, so in principle you can wire `ptpt-rehype` into Astro by hand.

In practice, though, you end up writing the same setup over and over:

- Add the plugin to `markdown.rehypePlugins` in `astro.config.mjs`.
- Configure `.mdx` separately, since MDX has its own integration entry.
- And `.astro` content authored directly (no Markdown in the picture) needs a different mechanism altogether — there's no `<Patapata>` equivalent.

The fifth package exists to take all of that off your plate.

## One line in `astro.config.mjs`

```ts
import { defineConfig } from "astro/config";
import ptpt from "@love-rox/ptpt-astro";

export default defineConfig({
  integrations: [ptpt()],
});
```

That's it. After that, half-width alphanumeric runs in `.md` and `.mdx` content get wrapped in `<span class="ptpt">` at build time. The integration hooks into both the Markdown configuration and the MDX configuration internally.

There's zero client-side runtime. Astro is SSG-first, so by the time the page reaches the browser the wrapping is already in the HTML — no React, no Vue, no extra JS.

## Same options as `ptpt-rehype`

```ts
integrations: [
  ptpt({
    maxLength: 2,
    excludeWords: ["URL", "API", "2026"],
  }),
],
```

Anything you can pass to `@love-rox/ptpt-rehype` (`target`, `combine`, `include`, `exclude`, `maxLength`, `excludeWords`, `tagName`, `className`, `skipTags`) flows straight through.

The integration adds exactly one option of its own:

- **`markdown`** (default `true`) — whether to register `rehype-ptpt` on the Markdown / MDX pipeline. Set to `false` if you only want the `<Patapata>` component and want to opt out of the Markdown wiring.

## `<Patapata>` for `.astro` files

Sometimes the body content is authored directly in an `.astro` file rather than coming from Markdown. The same package ships a component for that:

```astro
---
import Patapata from "@love-rox/ptpt-astro/Patapata.astro";
---

<p style="writing-mode: vertical-rl">
  <Patapata>第1章 2026年4月、Webの縦書きは進化した。</Patapata>
</p>
```

Internally the component delegates to the same `ptpt-rehype`, so behavior between Markdown and `.astro`-authored content lines up exactly.

## Where this fits in the family

```
@love-rox/ptpt-core    — framework-agnostic tokenizer (the brain)
@love-rox/ptpt-react   — `<Patapata>` for React (runtime wrapping)
@love-rox/ptpt-vue     — `<Patapata>` for Vue 3 (runtime wrapping)
@love-rox/ptpt-rehype  — `unified` plugin (build-time wrapping)
@love-rox/ptpt-astro   — Astro integration + `<Patapata>` component ← new
```

`ptpt-astro` calls into `ptpt-rehype`, which calls into `ptpt-core`. All five share the exact same opinion of "what is a ptpt-eligible run." The only difference is _where_ in your stack the wrapping happens.

## We also restructured the docs

Five packages on a single page was getting hard to skim, so we rebuilt [`/packages/patapata`](/en/packages/patapata) as a core-focused landing and split each adapter onto its own page:

- [/packages/patapata/react](/en/packages/patapata/react)
- [/packages/patapata/vue](/en/packages/patapata/vue)
- [/packages/patapata/rehype](/en/packages/patapata/rehype)
- [/packages/patapata/astro](/en/packages/patapata/astro)

A nav across the top of each page lets you hop between adapters in one click.

## Try it

```bash
bun add @love-rox/ptpt-astro
# or pnpm / npm / yarn
```

Add one line to `astro.config.mjs`, drop the CSS in:

```css
.ptpt {
  -webkit-text-combine: horizontal;
  text-combine-upright: all;
}
```

That's the whole setup. Full docs live on the [Astro package page](/en/packages/patapata/astro) and the [README on GitHub](https://github.com/Love-Rox/patapata/tree/main/packages/astro#readme).

## Feedback welcome

Vertical Japanese typography in Astro is still pretty new ground in practice. If you hit something — an unexpected wrap, a word you wanted left as-is, an MDX edge case — that kind of feedback is the most useful input we get for tuning the defaults.

[Open an issue](https://github.com/Love-Rox/patapata/issues) and we'll dig in.

**The Love Rocks. Rox.**
