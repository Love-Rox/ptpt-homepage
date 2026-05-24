---
title: patapata v0.2.0 リリース - 縦中横に「組まない自由」を
date: 2026-05-01
author: Roxチーム
tags: [Love-Rox, patapata, npm, リリース, 縦中横, 日本語組版]
description: patapata の3パッケージ (core / react / vue) を v0.2.0 にアップデートしました。`maxLength` と `excludeWords` の2オプションを追加し、「縦中横にしないもの」をピンポイントで指定できるようになります
excerpt: patapata v0.2.0 を npm に公開しました。書き手から組版の手間を消すのが 0.1 系のテーマでしたが、現場で組んでみると「これは寝かせたままがいい」という run も出てきます。今回追加された `maxLength` と `excludeWords` は、その「組まない自由」のための小さなオプションです。
---

# patapata v0.2.0 リリース - 縦中横に「組まない自由」を

**patapata v0.2.0** を本日 npm に公開しました ✨

3つのパッケージすべてが minor アップデートで `0.2.0` になっています。

- 📦 [@love-rox/ptpt-core@0.2.0](https://www.npmjs.com/package/@love-rox/ptpt-core)
- 📦 [@love-rox/ptpt-react@0.2.0](https://www.npmjs.com/package/@love-rox/ptpt-react)
- 📦 [@love-rox/ptpt-vue@0.2.0](https://www.npmjs.com/package/@love-rox/ptpt-vue)
- 💾 GitHub: [Love-Rox/patapata](https://github.com/Love-Rox/patapata)
- 🎨 パッケージ紹介: [/packages/patapata](/ja/packages/patapata)
- 🖋️ デモ: [/packages/patapata/demo](/ja/packages/patapata/demo)

> **互換性について**: 0.1.x からの破壊的変更はありません。既存利用者は `bun update`（または `pnpm update` / `npm update`）でそのまま移行できます。

## 0.1 のあと、現場から返ってきた声

[0.1.0 のリリース記事](/ja/blog/patapata-release) では、「書き手に組版の都合を押し付けたくない」という想いで、半角英数字を自動で縦中横にする動きをデフォルトにしました。

実際に縦組みで原稿を流してみると、もう一段の調整が必要なケースが見えてきます。

- **長い英数字 run はそもそも縦中横にしない方が読みやすい**。たとえば `2026` のような4桁年や、`v0.2.0` のようなバージョン文字列は、縦の流れを乱さないようそのまま寝かせたい——という編集判断は、新聞や書籍では普通にあります。
- **特定の語だけは寝かせたい**。`URL` や `API` のような略号、英数字混じりの製品名、固有の年号——「この単語は今回は組まない」と一語単位で決めたい場面があります。

これまではこの細かい制御をするのに、書き手側で文字列を分割するか、`<Patapata>` の外に出してしまう必要がありました。0.2.0 では、これをオプションだけで完結できるようにしています。

## 追加された2つのオプション

`@love-rox/ptpt-core` の `tokenize()`、`@love-rox/ptpt-react` の `<Patapata>`、`@love-rox/ptpt-vue` の `<Patapata>` すべてで使えます。

### `maxLength?: number`

縦中横セグメント（連続した英数字 run）の最大文字数。これを超える長さの run はプレーンテキストに戻ります。

```ts
import { tokenize } from "@love-rox/ptpt-core";

tokenize("第1章 2026年4月", { maxLength: 2 });
// "2026" (4文字) は text に降格
// "1" と "4" は  ptpt のまま
```

React / Vue でもそのまま渡せます。

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

「短い数字は組む、長い数字は寝かせる」という判断を、原稿には触れずに切り替えられます。

### `excludeWords?: string[]`

完全一致（部分一致ではなく、セグメント値全体のマッチ）で指定した語を縦中横から除外します。

```ts
tokenize("第1章 2026年4月、URLとAPIの話", { excludeWords: ["2026", "URL", "API"] });
// "2026" "URL" "API" は text に降格
// "1" や "4" など他の英数字は  ptpt のまま
```

略号や固有名詞だけ「今回は組まない」を1行で指定できます。

### 降格された run の扱い

`maxLength` または `excludeWords` で text に降格された run は、隣接する text セグメントと自動的にマージされます。出力 DOM に余計な空のスパンや切れ目が出ないので、CSS や検索の挙動に影響しません。

## 互換性

- 既存の `target` / `combine` / `include` / `exclude` の挙動は変わっていません。
- 新オプションはどちらも省略可能なので、**何もしなければ 0.1.x と同じ出力**です。
- `combine: false`（1文字ずつ別スパン）の場合、`maxLength` は実質1文字の制限としてのみ働きます。`maxLength` は `combine: true` 前提のオプションだと考えてください。

## 4オプション主義からの小さな譲歩

0.1.0 の記事で「迷う余地を減らすために `target` / `combine` / `include` / `exclude` の4つだけにした」と書きました。今回その方針を曲げてオプションを増やしたのは、現場のフィードバックが理由です。「`<Patapata>` で囲む / 囲まない」の2値だけでは、実際の縦組み原稿に必要な粒度に届かないケースがあった。`maxLength` と `excludeWords` は、その隙間を最小コストで埋めるためのものです。

それでも API はまだ十分に小さい（共通オプションは6つ）と思っています。次に増やす前には、また同じくらい慎重に悩むつもりです。

## アップデート方法

```bash
# React
bun add @love-rox/ptpt-react@latest
# Vue
bun add @love-rox/ptpt-vue@latest
# Core を直接使っている場合
bun add @love-rox/ptpt-core@latest
```

`pnpm` / `npm` / `yarn` でも同じです。詳細な API は [パッケージ紹介ページ](/ja/packages/patapata) と [インタラクティブデモ](/ja/packages/patapata/demo) で確認できます。デモには `maxLength` と `excludeWords` のコントロールも追加してあるので、設定を変えながら手元で挙動を確かめてみてください。

## 引き続きフィードバック歓迎です

縦組みの Web は、書き手・編集・組版・実装が同じ場所で会話できると一気に良くなる領域だと思っています。「この単語は寝かせたい」「ここは組みたい」という現場の判断こそ、ライブラリだけでは辿り着けない知見です。

[GitHub Issues](https://github.com/Love-Rox/patapata/issues) でお待ちしています。

**愛がロックする。Rox。**
