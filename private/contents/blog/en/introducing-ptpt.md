---
title: Introducing ptpt — split-flap displays for the web
date: 2026-04-19
author: Rox Team
tags: [Love-Rox, ptpt, patapata, npm, release, split-flap]
description: A new npm package family from Love-Rox that brings split-flap (patapata) departure-board displays to the web — airport boards, the Solari di Udine, the Vestaboard, recreated in the browser.
excerpt: A split-flap board doesn't show a value — it arrives at one, ticking through every glyph on the way. ptpt is a small library that recreates that on the web, and keeps the wait on purpose. Today it ships on npm.
---

# Introducing ptpt — split-flap displays for the web

Today we shipped **ptpt** (patapata) on npm ✨

It's a small library from the Love-Rox team for building split-flap displays on the web — the kind you stand under at an airport, the Solari di Udine in an Italian station, a Vestaboard on someone's wall — recreated in the browser.

- 📦 npm: [@love-rox/ptpt-core](https://www.npmjs.com/package/@love-rox/ptpt-core)
- 💾 GitHub: [Love-Rox/ptpt](https://github.com/Love-Rox/ptpt)
- 🎛️ Interactive demo: [/demo](/demo)

## What is a split-flap display?

A split-flap (or "flip-board") display shows characters on a stack of hinged flaps. To change a letter, the board flips through every flap between the current value and the next one, one at a time, with that unmistakable mechanical _clack_. The name **patapata** is the Japanese onomatopoeia for exactly that sound — and `ptpt` is just `patapata` with the vowels dropped, the same naming trick as its sibling library [`tcy`](https://github.com/Love-Rox/tcy).

## The point is the wait

Here's the thing we kept coming back to: a split-flap board doesn't _show_ you a value. It _arrives_ at one. The flaps tick through the letters in between, and that delay — the little held breath before the destination settles — is the whole experience.

A naïve digital reimplementation would optimize that away. Snap straight to the answer; it's faster. But faster misses the point entirely. So ptpt treats the wait as a feature, not a cost. The flaps tick. The board ripples. You wait, just a little, and that's exactly right.

## The model

Three nouns, and that's most of the API:

- **Frame** — one flap. It can be text, an image, or an arbitrary `element`, each addressed by a `slug`. A bare string like `"A"` is normalized to a text frame for you.
- **Cell** — one flapping unit. It flips through a ring of frames (from a `preset` or an explicit `frames` list) toward a target.
- **Board** — a row of cells. It staggers them with a `delayFn` so the whole display ripples, and exposes one `role="status"` live region so screen readers hear the settled result, not the blur in between.

The smallest useful program:

```ts
import { createCell, createBoard } from "@love-rox/ptpt-core";
import { digitsPreset } from "@love-rox/ptpt-core/presets/digits";
import "@love-rox/ptpt-core/styles.css";

const cells = Array.from({ length: 3 }, () => {
  const el = document.createElement("div");
  document.body.appendChild(el);
  return createCell(el, { preset: digitsPreset });
});

const board = createBoard(cells);
await board.flipTo("042"); // string sugar → ['0', '4', '2']
```

> **One gotcha worth learning early.** `preset` accepts a `PresetDefinition` object _or_ a string — but a string is read as the literal flap characters, not a preset name. So pass the imported object (`digitsPreset`), not `"digits"`.

## Five packages

ptpt is a framework-agnostic core with paper-thin wrappers around it:

```
@love-rox/ptpt-core    — the engine. Zero deps, ESM, ~3 KB gzip, ships styles.css
    ↓
@love-rox/ptpt-react   — <Patapata>, <PatapataBoard>, useFlipCell ("use client")
@love-rox/ptpt-vue     — the same API for Vue 3, plus a useFlipCell composable
@love-rox/ptpt-rehype  — turn marked Markdown / HTML into boards, hydrate on load
@love-rox/ptpt-astro   — integration + components that wire all of the above up
```

The core is deliberately small. It does cell animation, board orchestration, frame normalization, the accessibility plumbing, and exports a few pure functions like `computeFlipPath` for people who want to reach in. It does not do image pipelines or state management — those aren't its job.

## A Japan-origin library, in a Japan-origin stack

The Love-Rox team builds Rox, a lightweight ActivityPub platform, on top of Japan-origin open source — [Waku](https://waku.gg/) and [Jotai](https://jotai.org/) by Daishi Kato, [Hono](https://hono.dev/) by Yusuke Wada. ptpt is a small contribution back in the same spirit: a focused, well-typed library with an unapologetically tactile point of view.

## Where we'd like to go

ptpt is a 0.1-series release — young, and honest about it. On our minds next:

- **More presets** — kana, Hangul, currency and clock glyphs. Each preset is one tree-shakable file, so contributing one is a small PR.
- **A physical animation mode** — the current flip is a clean one-way fall; a four-element mode could model the "top falls, bottom rises" double-flip more literally.
- **More framework adapters**, if the shape fits cleanly on top of `core`.

If you build something with it — a counter, a weather board, a real departure display — we'd love to see it. [Open an issue](https://github.com/Love-Rox/ptpt/issues) or just show us.

**The Love Rocks. Rox.**
