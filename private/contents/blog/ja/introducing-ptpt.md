---
title: ptpt をリリースしました — Web で動かすスプリットフラップ・ディスプレイ
date: 2026-04-19
author: Roxチーム
tags: [Love-Rox, ptpt, patapata, npm, リリース, スプリットフラップ]
description: 空港の発車標、Solari di Udine、Vestaboard——あのスプリットフラップ（パタパタ）式ディスプレイを Web で再現する npm パッケージ群を Love-Rox からリリースしました。
excerpt: パタパタ式の盤面は、値を「表示する」のではなく、文字を一枚ずつめくりながら値に「たどり着く」装置です。その手触りを Web で再現し、しかも「待ち」をあえて残したのが ptpt。本日 npm に公開しました。
---

# ptpt をリリースしました — Web で動かすスプリットフラップ・ディスプレイ

**ptpt**（パタパタ）を本日 npm に公開しました ✨

空港で見上げるあの発車標、イタリアの駅の Solari di Udine、誰かの壁に掛かった Vestaboard——スプリットフラップ式ディスプレイをブラウザで再現する、Love-Rox チームの小さなライブラリです。

- 📦 npm: [@love-rox/ptpt-core](https://www.npmjs.com/package/@love-rox/ptpt-core)
- 💾 GitHub: [Love-Rox/ptpt](https://github.com/Love-Rox/ptpt)
- 🎛️ インタラクティブデモ: [/ja/demo](/ja/demo)

## スプリットフラップ・ディスプレイとは

スプリットフラップ（パタパタ）式は、蝶番でつながった板の束に文字を印刷したディスプレイです。文字を変えるには、いまの値から次の値まで、間にある板を一枚ずつめくっていく——あの独特のカチャカチャという機械音とともに。プロジェクトの愛称「パタパタ」は、まさにその音の擬音語。`ptpt` は `patapata` から母音を抜いた省略形で、姉妹ライブラリ [`tcy`](https://github.com/Love-Rox/tcy) と同じ命名規則です。

## 本質は「待つ」こと

設計でずっと立ち返っていたのはこの一点でした。パタパタ式の盤面は、値を「_見せる_」のではなく、値に「_たどり着く_」。間の文字をめくっていくその間——目的地が確定する前のわずかな息継ぎ——こそが体験のすべてです。

素朴にデジタル化すれば、その間は最適化で消せます。答えに一発で飛べば速い。でも、速さはこの体験の核心を取り逃がします。だから ptpt は「待ち」をコストではなく価値として扱います。フラップがめくれ、盤面が波打ち、ほんの少し待たされる。それでいい。それがいい。

## モデル

名詞は3つ。これで API のほとんどです。

- **Frame**（フレーム）— 1枚のフラップ。text / image / 任意の `element` のいずれかで、`slug` で識別します。`"A"` のような素の文字列は text フレームに正規化されます。
- **Cell**（セル）— 1個のパタパタ。フレームのリング（`preset` か明示的な `frames`）を目標までめくります。
- **Board**（ボード）— セルの一列。`delayFn` で時間差を付けて盤面を波打たせ、1つの `role="status"` ライブリージョンを持つので、スクリーンリーダーには途中の乱れではなく確定した結果だけが届きます。

最小の例:

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
await board.flipTo("042"); // 糖衣構文: '042' → ['0', '4', '2']
```

> **早めに覚えておきたい落とし穴。** `preset` は `PresetDefinition` オブジェクト _または_ 文字列を受け取りますが、文字列はプリセット名ではなく「フラップの文字列そのもの」として解釈されます。`"digits"` ではなく、import したオブジェクト（`digitsPreset`）を渡してください。

## 5つのパッケージ

ptpt は framework-agnostic なコアに、極薄のラッパーを重ねた構成です。

```
@love-rox/ptpt-core    — エンジン。依存ゼロ・ESM・gzip 約 3 KB・styles.css 同梱
    ↓
@love-rox/ptpt-react   — <Patapata> / <PatapataBoard> / useFlipCell（"use client"）
@love-rox/ptpt-vue     — Vue 3 向けの同じ API と useFlipCell コンポーザブル
@love-rox/ptpt-rehype  — 印付きの Markdown / HTML を盤面に変換し、読み込み時に hydrate
@love-rox/ptpt-astro   — 上記をまとめて配線するインテグレーション + コンポーネント
```

コアはあえて小さく保っています。セルのアニメーション、ボードのオーケストレーション、フレームの正規化、a11y まわりの配線、そして `computeFlipPath` のような純粋関数の export——やることはそれだけ。画像処理パイプラインや状態管理は、コアの仕事ではありません。

## 日本発のライブラリを、日本発のスタックで

Love-Rox チームは軽量な ActivityPub プラットフォーム Rox を、日本発の OSS の上に作っています——Daishi Kato さんの [Waku](https://waku.gg/) と [Jotai](https://jotai.org/)、Yusuke Wada さんの [Hono](https://hono.dev/)。ptpt はその系譜への小さな恩返しでもあります。焦点を絞った、型のしっかりした、そして手触りに正直なライブラリとして。

## これから

ptpt は 0.1 系のリリース——若く、そのことに正直でいたいと思っています。次に考えていること:

- **プリセットの拡充** — かな、ハングル、通貨や時計のグリフ。1プリセット = 1ファイルなので、追加は小さな PR で済みます。
- **物理アニメーションモード** — 現在のフリップは綺麗な片方向の「倒れ」。4要素方式なら「上が倒れて下が起き上がる」双方向の挙動をより忠実に表現できます。
- **アダプタの追加** — コアの上にきれいに乗る形なら、他のフレームワーク向けも。

カウンタでも、天気ボードでも、本物の発車標でも——何か作ったらぜひ見せてください。[Issue](https://github.com/Love-Rox/ptpt/issues) でも、ただ見せてくれるだけでも。

**The Love Rocks. Rox.**
