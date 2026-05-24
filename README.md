# ptpt-homepage

[`@love-rox/ptpt-*`](https://www.npmjs.com/org/love-rox) パッケージファミリーの公式サイト — [ptpt.love-rox.cc](https://ptpt.love-rox.cc)。

Web に、パタパタ（反転フラップ）式ディスプレイの手触りを。`patapata` 表示ライブラリ群（core / react / vue / rehype / astro）のランディング・デモ・ドキュメント・ブログを束ねた静的寄りの RSC サイトです。

---

## スタック

- **[Waku](https://waku.gg/)** — React Server Components ベースのフレームワーク
- **React 19** + React Compiler
- **Tailwind CSS v4** — `wa-modern` デザインシステム（墨 × 生成り × 朱）
- **Cloudflare Workers** — `@cloudflare/vite-plugin` 経由でデプロイ
- **Bun** — パッケージマネージャ／テストランナー
- **TypeScript** — strict + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`

## 必要環境

- [Bun](https://bun.sh/) (latest)
- Node.js ≥ 22（`wrangler` が Node 22+ を要求）

## セットアップ

```bash
bun install
bun run dev      # Waku dev server
```

## よく使うコマンド

| コマンド               | 用途                                                                      |
| ---------------------- | ------------------------------------------------------------------------- |
| `bun run dev`          | Waku 開発サーバ                                                           |
| `bun run build`        | 本番ビルド（`prebuild` で npm から `@love-rox/ptpt-*` の最新版を取得）    |
| `bun run start`        | ビルド成果物を `wrangler dev` で起動                                      |
| `bun run deploy`       | `wrangler deploy`（通常は CI が `main` プッシュで実行）                   |
| `bun run lint` / `fmt` | `vite-plus` (`vp check` / `vp fmt`)                                       |
| `bun test`             | Bun テストランナー                                                        |
| `bun run versions`     | npm レジストリから最新バージョンを取得して `src/lib/versions.ts` を再生成 |
| `bun run generate-seo` | `public/sitemap.xml` と `public/robots.txt` を再生成                      |
| `bun run cf-typegen`   | `wrangler.jsonc` から `worker-configuration.d.ts` を再生成                |

## ディレクトリ構成

```
src/
  pages/             ファイルベースルーティング（en-default, /ja/* が日本語ミラー）
    _api/api/og.tsx  動的 OG 画像エンドポイント（workers-og）
    _layout.tsx      共通レイアウト（ヘッダ、フッタ、構造化データ）
  components/
    views/           各ページの実体（pages から locale を渡して呼ぶ）
    ptpt/            patapata デモ用プリミティブ
    common, global, blog, seo
  lib/
    locale.ts        en-default URL ヘルパー（localePath / detectLocale）
    markdown-loader.ts  ビルド時に Markdown を eager bundle（Workers に fs はない）
    og-helpers.ts    OG クエリ／フォントサイズの純粋関数（テスト対象）
    versions.ts      ★ 自動生成（手で編集しない）
  waku.server.tsx    Cloudflare adapter エントリポイント

private/
  contents/blog/{ja,en}/  ブログ Markdown
  lang/pages/{ja,en}/     ページ単位の i18n JSON
  lang/components/        コンポーネント単位の i18n JSON

public/                   静的アセット（sitemap.xml は生成物）
scripts/                  fetch-versions.ts / generate-seo-files.ts
tests/                    Bun テスト
.github/workflows/        CI / Deploy / Auto-merge
```

パスエイリアス：`@/*` → `src/*`、`@private/*` → `private/*`、`@content/*` → `private/contents/*`

## ロケール戦略

`en` をデフォルトとし、日本語版は `/ja/...` にミラーする戦略です。

```
/             → 英語ランディング（canonical）
/demo         → 英語版
/blog/[slug]  → 英語ブログ記事
/ja           → 日本語ランディング
/ja/demo      → 日本語版
/ja/blog/[slug] → 日本語ブログ記事
```

URL の組み立て・解析は必ず `src/lib/locale.ts` のヘルパー (`localePath`, `detectLocale`, `stripLocale`) を経由してください。`/ja` プレフィックスを直接書かないのが原則です。

各ページは薄いシェルとして `src/pages/foo.tsx` ↔ `src/pages/ja/foo.tsx` の 2 ファイルを置き、共通実体は `src/components/views/foo.tsx` に集約しています。

## コンテンツの追加

ブログ記事を追加する場合：

1. `private/contents/blog/ja/<slug>.md` と `private/contents/blog/en/<slug>.md` を作成
2. frontmatter に `title`, `description`, `date`, `author`, `tags` などを記述
3. 開発サーバを起動していればホットリロードで反映、`sitemap.xml` も自動再生成

`markdown-loader` がビルド時に Markdown を `import.meta.glob` で eager bundle するため、Cloudflare Workers ランタイムに `fs` を持ち込みません。

## デプロイ

`.github/workflows/deploy.yml` が以下のトリガで本番デプロイ（[love-rox.cc](https://love-rox.cc)）を実行します。

- `main` への `push`
- 週次 cron（月曜 06:00 UTC）— `ptpt-*` の最新版を反映するためのセーフティネット
- `repository_dispatch: ptpt-released` — `Love-Rox/ptpt` のリリース時に発火

つまり npm への新リリース 〜 サイト更新まで概ね 1 分。手動でバージョン番号を書き換える必要はありません。

## CI / Auto-merge

- **CI** (`.github/workflows/ci.yml`): PR と `main` push で `bun run lint` と `bun test` を実行。
- **Auto-merge** (`.github/workflows/auto-merge.yml`): CI 成功後、オーナー PR を GitHub App 経由で admin-merge（squash + ブランチ削除）。GitHub ネイティブの auto-merge は ruleset bypass を尊重しないための回避策です。

## デザインシステム

「**wa-modern**」 — 墨 (sumi) のインクを生成り (kinari) の紙に落とし、朱 (shu) の朱印を一点だけ差すコンセプト。

- フォント: Shippori Mincho B1（明朝・縦組み主役）／ Zen Kaku Gothic New（和文ゴシック）／ Cormorant Garamond + Inter Tight（欧文）／ JetBrains Mono（コード・パッケージ名）
- カラー／タイポグラフィのトークンは `src/styles.css` で `@theme` 定義。`bg-ground` / `text-ink` / `bg-shu` / `font-mincho` などを再利用してください。

## ライセンス

Private (unpublished). サイトに表示されているサンプル文章は CC0 で扱える古典・著者作のものに限定しています。
