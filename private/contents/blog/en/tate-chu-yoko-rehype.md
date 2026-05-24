---
title: patapata meets rehype - drop patapata into your unified pipeline
date: 2026-05-03
author: Rox Team
tags: [Love-Rox, patapata, rehype, unified, npm, release, Japanese-typography]
description: A new fourth package — `@love-rox/ptpt-rehype` — applies patapata inside any `unified` pipeline. Markdown → HTML, HTML → HTML, Astro, eleventy, MDX — wrap half-width runs at build time, no React or Vue runtime required.
excerpt: Until now, automatic patapata meant rendering through React or Vue. That works great inside an app, but it asks the wrong things of static sites and Markdown content pipelines. `@love-rox/ptpt-rehype` is the fourth patapata package — a small `unified` plugin that drops the same wrapping into any HAST pipeline. No runtime cost, no framework dependency, same options.
---

# patapata meets rehype - drop patapata into your unified pipeline

We just shipped a fourth patapata package: **`@love-rox/ptpt-rehype`** ✨

- 📦 [@love-rox/ptpt-rehype@0.2.2](https://www.npmjs.com/package/@love-rox/ptpt-rehype)
- 📦 [@love-rox/ptpt-core@0.2.2](https://www.npmjs.com/package/@love-rox/ptpt-core)
- 📦 [@love-rox/ptpt-react@0.2.2](https://www.npmjs.com/package/@love-rox/ptpt-react)
- 📦 [@love-rox/ptpt-vue@0.2.2](https://www.npmjs.com/package/@love-rox/ptpt-vue)
- 💾 GitHub: [Love-Rox/patapata](https://github.com/Love-Rox/patapata)
- 🎨 Package page: [/packages/patapata](/en/packages/patapata)

> The four packages are now released on a single shared version line, so they all move together.

## What it is

A [rehype](https://github.com/rehypejs/rehype) plugin built on top of `@love-rox/ptpt-core`. It walks a HAST tree, finds half-width alphanumeric runs in text nodes, and wraps them in `<span class="ptpt">` so CSS `text-combine-upright: all` can compose them as patapata.

If you have a `unified` pipeline — for Markdown, MDX, an Astro site, an eleventy build, or just plain HTML rewriting — you can now do patapata inside that pipeline at build time, with no React or Vue dependency on the client.

## The shape it makes possible

Until 0.2.2, the way to get automatic patapata was to render content through `<Patapata>` in React or Vue. That assumes a React/Vue runtime is in the page. Two situations push back on that:

- **Static sites that don't have a JS runtime.** A documentation site, a blog, a publication — the value of `text-combine-upright` is highest exactly there, and yet React or Vue often isn't.
- **Markdown content with a server-side pipeline.** When the canonical source is `.md` or MDX, we want the wrapping baked in at build time so the HTML on disk is already correct, not a hydration step.

A rehype plugin maps cleanly onto both. It runs once during the build, leaves a static HTML tree behind, and you ship zero extra JS for it.

## Markdown pipeline

```ts
import { unified } from "unified";
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
    .process("第1章 2026年4月"),
);
// <p>第<span class="ptpt">1</span>章 <span class="ptpt">2026</span>年<span class="ptpt">4</span>月</p>
```

Slot it in between `remark-rehype` and `rehype-stringify` (or wherever your pipeline finalizes HAST), and the output is wrapped before it ever leaves the build.

## HTML-only pipeline

If you don't have Markdown in the picture — just HTML in, HTML out — it's the same idea:

```ts
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypePtpt from "@love-rox/ptpt-rehype";

const html = String(
  await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypePtpt)
    .use(rehypeStringify)
    .process("<p>第1章 2026年4月</p>"),
);
```

## All the same options as `<Patapata>`

The shared options work identically — `target`, `combine`, `include`, `exclude`, `maxLength`, `excludeWords`. So everything you can express with the React or Vue component, you can express in the rehype pipeline:

```ts
.use(rehypePtpt, {
  maxLength: 2,
  excludeWords: ["URL", "API", "2026"],
})
```

There are three plugin-only options:

- **`tagName`** (default `'span'`) — the wrapping element.
- **`className`** (default `'ptpt'`) — class on the wrapping element. Pass an array for multiple classes.
- **`skipTags`** (default `['code', 'pre', 'script', 'style']`) — subtrees that the plugin won't touch.

Skipping `code` / `pre` / `script` / `style` matters more than it sounds: it's how the plugin avoids mangling code samples and embedded JSON.

## A note on idempotency

Running the plugin twice on the same HAST gives the exact same output as running it once. No re-wrapping, no doubled spans. So it's safe in pipelines where multiple stages might want to ensure patapata has been applied — last one in wins, no damage done.

## Where this fits in the family

```
@love-rox/ptpt-core    — framework-agnostic tokenizer (the brain)
@love-rox/ptpt-react   — `<Patapata>` for React (runtime wrapping)
@love-rox/ptpt-vue     — `<Patapata>` for Vue 3 (runtime wrapping)
@love-rox/ptpt-rehype  — `unified` plugin (build-time wrapping) ← new
```

All four use the same `core` tokenizer underneath, so they all share the same opinion of "what is a ptpt-eligible run." The only difference is _where_ in your stack the wrapping happens.

If you've been using `<Patapata>` and it's working, nothing changes. If you've been wishing you could do this without React or Vue around — that's now `@love-rox/ptpt-rehype`.

## Try it

```bash
bun add @love-rox/ptpt-rehype
# or pnpm / npm / yarn
```

Drop it into your `unified` pipeline, set the same options you'd give to `<Patapata>`, and you're done. The full README and examples live in the [GitHub repository](https://github.com/Love-Rox/patapata/tree/main/packages/rehype#readme).

## Feedback welcome

If you're using patapata in a Markdown pipeline, an Astro site, an eleventy build, or anything else `unified` shows up in — we want to know what worked and what didn't. The judgment calls in vertical typesetting are not things a library can derive on its own; they come from people writing real text.

[Open an issue](https://github.com/Love-Rox/patapata/issues) if you have one. We're listening.

**The Love Rocks. Rox.**
