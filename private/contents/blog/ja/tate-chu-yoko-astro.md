---
title: patapata に Astro が加わりました - Markdown / MDX に自動縦中横を、設定1行で
date: 2026-05-03
author: Roxチーム
tags: [Love-Rox, patapata, Astro, MDX, npm, リリース, 縦中横, 日本語組版]
description: 5つ目のパッケージ `@love-rox/ptpt-astro` を公開しました。Astro 4+ の Markdown / MDX パイプラインに rehype プラグインを自動登録するインテグレーションと、`.astro` 用の `<Patapata>` コンポーネントが入っています。`astro.config.mjs` に1行加えるだけで、日本語縦組み本文の半角英数字がビルド時に縦中横として組版されます。
excerpt: 前回の rehype 公開から、いちばん多く聞いたのは「Astro でも使いたい」でした。`@love-rox/ptpt-astro` はそのフィードバックへの返答です。インテグレーションを registers するだけで `.md` と `.mdx` が自動で縦中横化され、`.astro` 用には `<Patapata>` コンポーネントも同梱。5パッケージはすべて `0.3.0` の同じバージョン番号で揃えました。
---

# patapata に Astro が加わりました - Markdown / MDX に自動縦中横を、設定1行で

patapata の5つ目のパッケージ **`@love-rox/ptpt-astro`** を npm に公開しました ✨

- 📦 [@love-rox/ptpt-astro@0.3.0](https://www.npmjs.com/package/@love-rox/ptpt-astro)
- 📦 [@love-rox/ptpt-rehype@0.3.0](https://www.npmjs.com/package/@love-rox/ptpt-rehype)
- 📦 [@love-rox/ptpt-react@0.3.0](https://www.npmjs.com/package/@love-rox/ptpt-react)
- 📦 [@love-rox/ptpt-vue@0.3.0](https://www.npmjs.com/package/@love-rox/ptpt-vue)
- 📦 [@love-rox/ptpt-core@0.3.0](https://www.npmjs.com/package/@love-rox/ptpt-core)
- 💾 GitHub: [Love-Rox/patapata](https://github.com/Love-Rox/patapata)
- 🎨 パッケージ紹介: [/packages/patapata](/ja/packages/patapata)
- 🎨 Astro 専用ページ: [/packages/patapata/astro](/ja/packages/patapata/astro)

> 5 パッケージは「shared version line」運用です。どれか一つでも変更があれば全部まとめて同じ番号に上がります。今回 Astro パッケージの追加にあわせて、5つ全部が `0.3.0` になりました。

## なぜ Astro 専用パッケージを作ったか

[前回 `@love-rox/ptpt-rehype` を公開した記事](/ja/blog/patapata-rehype) でも書いたとおり、rehype プラグインは「`unified` パイプラインを持っているなら、どこでも build 時に組版を済ませられる」という設計です。Astro は中で `unified` を使っているので、理屈の上では rehype を直接挿せば動きます。

ただ、実際にやってみると毎回同じセットアップを書くことになります:

- `astro.config.mjs` の `markdown.rehypePlugins` に追記
- `.mdx` 用にも `integrations: [mdx({ rehypePlugins: [...] })]` を別途設定
- `.astro` 直書きの本文には別の手段が必要（`<Patapata>` の代替がない）

5つ目のパッケージは、ここを「組み立てる必要のないもの」にする役割です。

## `astro.config.mjs` に1行

```ts
import { defineConfig } from "astro/config";
import ptpt from "@love-rox/ptpt-astro";

export default defineConfig({
  integrations: [ptpt()],
});
```

これだけで、`.md` と `.mdx` の本文中の半角英数字 run が、ビルド時に `<span class="ptpt">` で包まれます。Astro 側の Markdown 構成と MDX 構成、両方を内部でフックします。

クライアントランタイムは0です。Astro が SSG でビルドした時点で HTML には縦中横ラッピングが既に入っているので、ページに React も Vue も載りません。

## オプションは rehype と完全に同じ

```ts
integrations: [
  ptpt({
    maxLength: 2,
    excludeWords: ["URL", "API", "2026"],
  }),
],
```

`@love-rox/ptpt-rehype` に渡せるオプション（`target` / `combine` / `include` / `exclude` / `maxLength` / `excludeWords` / `tagName` / `className` / `skipTags`）はそのまま透過します。

インテグレーション専用のオプションは1つだけ:

- **`markdown`**（既定値 `true`）— Markdown / MDX パイプラインへの登録を行うか。`false` にすると `<Patapata>` コンポーネントだけ使う構成にできます。

## `.astro` 直書きにも `<Patapata>`

Markdown を介さずに `.astro` ファイルに直接本文を書くこともあります。そういうケース用にコンポーネントも同梱しています。

```astro
---
import Patapata from "@love-rox/ptpt-astro/Patapata.astro";
---

<p style="writing-mode: vertical-rl">
  <Patapata>第1章 2026年4月、Webの縦書きは進化した。</Patapata>
</p>
```

内部では同じ `ptpt-rehype` を呼んでいるので、Markdown 経由と `.astro` 直書きで挙動はぴったり揃います。

## ラインアップの中での位置づけ

```
@love-rox/ptpt-core    — framework-agnostic トークナイザー（脳）
@love-rox/ptpt-react   — React 用 `<Patapata>`（描画時にラップ）
@love-rox/ptpt-vue     — Vue 3 用 `<Patapata>`（描画時にラップ）
@love-rox/ptpt-rehype  — `unified` プラグイン（build 時にラップ）
@love-rox/ptpt-astro   — Astro インテグレーション + `<Patapata>` コンポーネント ← 新規
```

`ptpt-astro` は中で `ptpt-rehype` を呼んでいて、`ptpt-rehype` は中で `ptpt-core` を呼んでいます。「縦中横にすべき run はどれか」の判定はどのアダプタでも同一です。違うのは「いつ・どこで」ラップが起きるか、それだけです。

## ドキュメントページも整理しました

5パッケージ全部を1ページに詰め込むとそろそろ読みにくくなってきたので、[`/packages/patapata`](/ja/packages/patapata) を core を主としたランディングに作り直し、各アダプタを別ページに分けました。

- [/packages/patapata/react](/ja/packages/patapata/react)
- [/packages/patapata/vue](/ja/packages/patapata/vue)
- [/packages/patapata/rehype](/ja/packages/patapata/rehype)
- [/packages/patapata/astro](/ja/packages/patapata/astro)

各ページの上部に5パッケージのナビが出るので、横移動はそこから1クリックです。

## 試してみる

```bash
bun add @love-rox/ptpt-astro
# pnpm / npm / yarn でも同じ
```

`astro.config.mjs` に1行加えて、CSS で `.ptpt` を組版したら完了です。

```css
.ptpt {
  -webkit-text-combine: horizontal;
  text-combine-upright: all;
}
```

詳細は [Astro パッケージ紹介ページ](/ja/packages/patapata/astro) と [GitHub の README](https://github.com/Love-Rox/patapata/tree/main/packages/astro#readme) にあります。

## フィードバック歓迎です

Astro での縦組み × 縦中横は、まだ実例が多いとは言えない領域です。「ここで意図しない挙動になった」「この語は寝かせたい / 起こしたい」のような実装現場の判断が、ライブラリ側のデフォルトをよくするための一番の手がかりです。

[GitHub Issues](https://github.com/Love-Rox/patapata/issues) でお待ちしています。

**愛がロックする。Rox。**
