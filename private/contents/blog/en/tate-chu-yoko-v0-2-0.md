---
title: patapata v0.2.0 - The freedom to leave runs uncomposed
date: 2026-05-01
author: Rox Team
tags: [Love-Rox, patapata, npm, release, patapata, Japanese-typography]
description: All three patapata packages (core / react / vue) are now at v0.2.0. The release adds two opt-out controls — `maxLength` and `excludeWords` — for runs you want to leave lying on their side instead of upright
excerpt: patapata v0.2.0 is on npm. The 0.1 line was about removing typesetting work from authors; once people started feeding real vertical text through it, the next thing they wanted was the opposite — a way to say "this run, leave it alone." `maxLength` and `excludeWords` are that opt-out, kept as small as we could make them.
---

# patapata v0.2.0 - The freedom to leave runs uncomposed

We just published **patapata v0.2.0** to npm ✨

All three packages move to `0.2.0` together as a minor release.

- 📦 [@love-rox/ptpt-core@0.2.0](https://www.npmjs.com/package/@love-rox/ptpt-core)
- 📦 [@love-rox/ptpt-react@0.2.0](https://www.npmjs.com/package/@love-rox/ptpt-react)
- 📦 [@love-rox/ptpt-vue@0.2.0](https://www.npmjs.com/package/@love-rox/ptpt-vue)
- 💾 GitHub: [Love-Rox/patapata](https://github.com/Love-Rox/patapata)
- 🎨 Package page: [/packages/patapata](/en/packages/patapata)
- 🖋️ Demo: [/packages/patapata/demo](/en/packages/patapata/demo)

> **Compatibility**: no breaking changes from 0.1.x. Existing users can update with `bun update` (or the equivalent in pnpm / npm / yarn) and keep their existing configuration.

## What we heard after 0.1

In the [0.1.0 release post](/en/blog/patapata-release) we wrote that the goal was to take the typesetting chore off the author and make patapata wrapping just _happen_ for half-width Latin and Arabic runs. That default still works.

What surfaced once people started running real vertical text through it was a quieter, opposite request:

- **Long alphanumeric runs often read better when they're _not_ uprighted.** A four-digit year like `2026`, a version string like `v0.2.0`, a long ID — editors traditionally leave those lying horizontally so the vertical column doesn't bulge.
- **Some specific words shouldn't be uprighted at all.** Acronyms like `URL` / `API`, mixed-case product names, the occasional named year — sometimes the right answer is "yes, treat alphanumerics as ptpt, _except_ this exact word."

Until 0.2, the way to do this was to split the string in the source, or pull the offending run out of `<Patapata>` and reassemble around it. That's exactly the kind of work we said we didn't want to push back onto authors. So 0.2 takes care of it with options.

## The two new options

Available everywhere the existing options are: in `tokenize()` from `@love-rox/ptpt-core`, and on the `<Patapata>` component in both `@love-rox/ptpt-react` and `@love-rox/ptpt-vue`.

### `maxLength?: number`

Maximum length of a ptpt segment (a contiguous alphanumeric run). Anything longer than this is demoted back to plain text.

```ts
import { tokenize } from "@love-rox/ptpt-core";

tokenize("第1章 2026年4月", { maxLength: 2 });
// "2026" (4 chars) → text
// "1" and "4"      →  ptpt (unchanged)
```

It works the same way on the components:

```tsx
import { Patapata } from "@love-rox/ptpt-react";

export function Chapter() {
  return (
    <p style={{ writingMode: "vertical-rl" }}>
      <Patapata maxLength={2}>第1章 2026年4月、Webの縦書きは進化した。</Patapata>
    </p>
  );
}
```

"Upright the short numbers, leave the long ones flat" becomes a single prop change — no edits to the manuscript.

### `excludeWords?: string[]`

Exact-match (whole segment, not substring) words to exclude from ptpt wrapping.

```ts
tokenize("第1章 2026年4月、URLとAPIの話", { excludeWords: ["2026", "URL", "API"] });
// "2026", "URL", "API" → text
// "1" / "4" / etc.    →  ptpt (unchanged)
```

Useful for an acronym list, a product name list, or a small set of years you want to leave horizontal.

### What happens to demoted runs

When `maxLength` or `excludeWords` knocks a run out of ptpt, it's demoted to a plain text segment and merged with the surrounding text. There are no leftover empty spans or seam-level breaks, so CSS, copy/paste, and search behave the way you'd expect.

## Compatibility

- Existing `target` / `combine` / `include` / `exclude` behavior is unchanged.
- Both new options are optional, so **without setting anything, the output is identical to 0.1.x**.
- With `combine: false` (one span per character), `maxLength` only ever sees single-character segments, so it's effectively a no-op. Treat `maxLength` as a `combine: true` companion.

## A small concession from "four options only"

In the 0.1.0 post we said the API was deliberately kept to four shared options — `target`, `combine`, `include`, `exclude` — to keep the surface easy to memorize. We're loosening that ever so slightly because the binary "wrap / don't wrap" choice wasn't enough to express what people actually wanted from real Japanese vertical text. `maxLength` and `excludeWords` cover that gap with the smallest extra surface we could justify.

The shared option count goes from four to six. We'd like to keep it there for a while.

## How to update

```bash
# React
bun add @love-rox/ptpt-react@latest
# Vue
bun add @love-rox/ptpt-vue@latest
# Or the core tokenizer directly
bun add @love-rox/ptpt-core@latest
```

`pnpm` / `npm` / `yarn` work the same way. The full API and behavior notes live on the [package page](/en/packages/patapata), and you can play with the new options live on the [interactive demo](/en/packages/patapata/demo) — `maxLength` and `excludeWords` controls are wired up so you can feel what they do.

## Keep the feedback coming

Vertical typesetting on the web gets noticeably better when authors, editors, typesetters, and engineers can talk in the same place. The judgment calls — _this acronym stays flat, that number gets uprighted_ — are not things a library can derive on its own.

[Open an issue](https://github.com/Love-Rox/patapata/issues) if you have one. We're listening.

**The Love Rocks. Rox.**
