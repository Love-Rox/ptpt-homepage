---
title: Announcing patapata — Bringing the feel of Japanese vertical typography to the web
date: 2026-04-19
author: Rox Team
tags: [Love-Rox, patapata, npm, release, patapata, Japanese-typography]
description: A new npm package from Love-Rox that automates patapata (縦中横) wrapping for Japanese vertical text on the web
excerpt: In Japanese newspapers and books, short runs of half-width digits stand upright inside vertical text without anyone thinking about it. On the web, every run has to be wrapped by hand. patapata removes that chore.
---

# Announcing patapata — Bringing the feel of Japanese vertical typography to the web

Today we shipped **patapata** on npm ✨

It's a small library from the Love-Rox team for typesetting Japanese vertical text on the web, published as three packages:

- 📦 npm: [@love-rox/ptpt-react](https://www.npmjs.com/package/@love-rox/ptpt-react)
- 💾 GitHub: [Love-Rox/patapata](https://github.com/Love-Rox/patapata)
- 🎨 Package page: [/packages/patapata](/en/packages/patapata)
- 🖋️ Interactive demo: [/packages/patapata/demo](/en/packages/patapata/demo)

## What is "patapata"?

**Tate-chu-yoko** (縦中横, literally _horizontal-within-vertical_) is a Japanese typographic convention. When a paragraph is set vertically, short runs of half-width Latin letters or Arabic digits — a year, a chapter number, an acronym — are rotated back upright and packed horizontally instead of each glyph lying on its side.

If you open a Japanese paperback, a newspaper TV schedule, or a manga column, you see it constantly. It's invisible in the same way good kerning is invisible: it's just how a reader expects the page to feel.

## Vertical writing is one of the rare writing systems still actively used

Most writing in the world long ago settled on left-to-right horizontal lines. Vertical writing, handed down through Japanese, Chinese, and Korean book culture, is one of the very few exceptions that still shapes everyday reading. Novels, poetry, newspapers, wrappers on snack bags, signs over shop doors — vertical typesetting is a craft with centuries of accumulated detail behind it.

Tate-chu-yoko is one such detail.

## Why a library?

### CSS has the pieces, but not the ergonomics

Modern browsers give us `writing-mode: vertical-rl` and `text-combine-upright: all`. In other words, the **rendering primitives are already there**. What's missing is the ergonomics — somebody has to tell the browser _which_ characters to upright-compose.

In practice, that means writing source that looks like this:

```html
Chapter <span class="ptpt">1</span>, <span class="ptpt">2026</span>
```

That's fine for one hand-built page. It falls apart the moment the text comes from a CMS, from Markdown, from user-submitted posts, or from a translation pipeline — any place where a **human author is writing plain text and should not have to think about typesetting markup**.

### Don't push typesetting onto the author

The Love-Rox team builds Rox, a lightweight ActivityPub platform. Across everything we do, we keep coming back to the same principle: let people focus on what they're writing, and let the stack handle the rest.

Tate-chu-yoko is that idea applied to vertical Japanese text. The author writes "Chapter 1, 2026" exactly like they would anywhere else. The library looks at the final DOM, finds the runs that need to be uprighted, and wraps them in spans — deterministically, safely for SSR, without tripping over nested elements.

### A small, Japan-origin library in a Japan-origin ecosystem

Rox's stack is deliberately built on top of Japan-origin open-source projects — [Waku](https://waku.gg/) and [Jotai](https://jotai.org/) by Daishi Kato, [Hono](https://hono.dev/) by Yusuke Wada. We picked them for technical reasons, but also because we care about Japanese developer presence in the global open-source conversation. patapata is our small contribution back to that same lineage — from a different angle: typography rather than runtime.

There are already excellent libraries in this space, and we owe them a lot. What we're adding is a **small, React/Vue-native, SSR-safe, deterministic option** — one more choice, not a replacement.

## How it's built

```
@love-rox/ptpt-core    ← framework-agnostic tokenizer, deterministic output
    ↓
@love-rox/ptpt-react   ← React <Patapata> component
@love-rox/ptpt-vue     ← Vue 3 <Patapata> component
```

Design principles we held on to:

- **Deterministic output** — same input produces the same DOM on the server and the client. No hydration drift.
- **Transparent descent into nested elements** — a `<strong>` or `<em>` inside a `<Patapata>` is traversed correctly, but runs are not joined across element boundaries, so `<em>12</em>34` emits two separate spans.
- **Leaves full-width characters alone** — `Ａ` and `１` already stand upright in vertical text; we don't touch them.
- **A tiny API** — just `target`, `combine`, `include`, `exclude`. Easy to remember, hard to misuse.

## Using it

The React component boils down to:

```tsx
import { Patapata } from "@love-rox/ptpt-react";

export function Chapter() {
  return (
    <p style={{ writingMode: "vertical-rl" }}>
      <Patapata>第1章 2026年4月、Webの縦書きは進化した。</Patapata>
    </p>
  );
}
```

Rendered DOM:

```html
第<span class="ptpt">1</span>章 <span class="ptpt">2026</span>年<span class="ptpt">4</span
>月、Webの縦書きは進化した。
```

Pair it with one block of CSS:

```css
.ptpt {
  -webkit-text-combine: horizontal;
  text-combine-upright: all;
}
```

And your authors keep writing plain text.

Full API and behavior notes are on the [package page](/en/packages/patapata), and you can play with it live on the [demo](/en/packages/patapata/demo).

## Where we'd like to go

patapata is a 0.1-series release — young, and we want it to stay honest about that. The things we're thinking about next:

- **More framework adapters** — Svelte / Solid / Astro wrappers, if the shape fits cleanly on top of `@love-rox/ptpt-core`.
- **Better defaults around character classes** — working out, with real-world feedback, which characters authors actually expect to see uprighted in Japanese vertical text.
- **Recipes that compose with other vertical-typography tooling** — punctuation handling, ruby, and the long tail of details vertical text demands.

If you typeset Japanese on the web — as a writer, an editor, a CMS maintainer, or a frontend engineer — we'd love to hear what works and what doesn't. [Open an issue](https://github.com/Love-Rox/patapata/issues). The web's vertical writing experience is going to improve fastest if the people who use it every day are part of the conversation.

**The Love Rocks. Rox.**
