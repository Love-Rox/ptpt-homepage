import type { ReactNode } from "react";
import { Link } from "waku";
import { Patapata } from "@love-rox/ptpt-react";
import "@love-rox/ptpt-core/styles.css";
import { localePath, type Locale } from "@/lib/locale";

export type { Locale };

export type AdapterKey = "core" | "react" | "vue" | "rehype" | "astro";

export interface AdapterMeta {
  key: AdapterKey;
  name: string;
  short: string;
  href: (locale: Locale) => string;
  isNew?: boolean;
}

export const ADAPTERS: AdapterMeta[] = [
  {
    key: "core",
    name: "@love-rox/ptpt-core",
    short: "core",
    href: (l) => localePath(l, ""),
  },
  {
    key: "react",
    name: "@love-rox/ptpt-react",
    short: "react",
    href: (l) => localePath(l, "react"),
  },
  {
    key: "vue",
    name: "@love-rox/ptpt-vue",
    short: "vue",
    href: (l) => localePath(l, "vue"),
  },
  {
    key: "rehype",
    name: "@love-rox/ptpt-rehype",
    short: "rehype",
    href: (l) => localePath(l, "rehype"),
  },
  {
    key: "astro",
    name: "@love-rox/ptpt-astro",
    short: "astro",
    href: (l) => localePath(l, "astro"),
    isNew: true,
  },
];

// —— wa-modern primitives ——————————————————————————————————————————

const KANJI_NUMS = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

/** Vertical Kanji chapter number for section margins. Index is 1-based. */
export function ChapterNumber({ n }: { n: number }) {
  const k = KANJI_NUMS[n - 1] ?? String(n);
  return (
    <span
      aria-hidden="true"
      className="font-mincho text-shu-deep dark:text-shu select-none"
      style={{
        writingMode: "vertical-rl",
        fontSize: "0.875rem",
        letterSpacing: "0.4em",
        lineHeight: 1,
      }}
    >
      第{k}
    </span>
  );
}

/** A small red square 落款印 (seal). Used in footer + accent moments. */
export function SealMark({ label = "ぱた", size = 56 }: { label?: string; size?: number }) {
  return (
    <span
      role="img"
      aria-label={label}
      className="inline-flex items-center justify-center font-mincho text-ground bg-shu-deep select-none"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.28,
        lineHeight: 1,
        letterSpacing: "0.05em",
        writingMode: "vertical-rl",
        padding: size * 0.08,
        borderRadius: 2,
        boxShadow: "inset 0 0 0 2px rgba(244,237,226,0.2)",
        fontWeight: 700,
      }}
    >
      {label}
    </span>
  );
}

/** A hairline rule. Defaults to horizontal ink, pass orientation/tone to vary. */
export function Rule({
  orientation = "h",
  tone = "ink",
  className = "",
}: {
  orientation?: "h" | "v";
  tone?: "ink" | "shu";
  className?: string;
}) {
  const color = tone === "shu" ? "bg-shu" : "bg-rule";
  const dim = orientation === "h" ? "h-px w-full" : "w-px h-full";
  return <span aria-hidden="true" className={`block ${color} ${dim} ${className}`} />;
}

/** Section: chapter-number margin + Mincho heading + content. Optional eyebrow. */
export function Section({
  n,
  eyebrow,
  heading,
  children,
  className = "",
}: {
  n?: number;
  eyebrow?: string;
  heading: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative mb-14 sm:mb-20 ${className}`}>
      <header className="mb-6 sm:mb-8">
        {n !== undefined && (
          <div className="absolute -left-12 top-0 hidden lg:block">
            <ChapterNumber n={n} />
          </div>
        )}
        {eyebrow && (
          <p className="font-gothic text-[11px] sm:text-xs uppercase tracking-[0.25em] text-ink-mute mb-3">
            {eyebrow}
          </p>
        )}
        <h2 className="font-mincho text-2xl sm:text-3xl lg:text-4xl text-ink leading-tight">
          {heading}
        </h2>
        <span aria-hidden="true" className="block h-px w-10 sm:w-12 bg-shu mt-4 sm:mt-5" />
      </header>
      {children}
    </section>
  );
}

/** Body paragraph with InlineMd (`code` and **bold**). */
export function Prose({ children }: { children: string }) {
  return (
    <p className="text-ink leading-[1.95] whitespace-pre-line">
      <InlineMd text={children} />
    </p>
  );
}

// Lightweight inline markdown renderer for i18n strings. Supports `code`,
// **bold**, and [text](url) links — no nesting, no recursion. Anything outside
// these patterns is rendered as a span (with backslash escapes like \`, \*, \[
// stripped so authors can write a literal `[` without it being parsed as a link).
const INLINE_MD_RE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
const LINK_RE = /^\[([^\]]+)\]\(([^)]+)\)$/;
const ESCAPE_RE = /\\([`*[\]()\\])/g;

/** Strip markdown markers so a string is safe for plain-text contexts like
 *  meta descriptions and OGP unfurls. */
export function stripMd(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(ESCAPE_RE, "$1");
}

export function InlineMd({ text }: { text: string }) {
  const parts = text.split(INLINE_MD_RE);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
          return (
            <code
              key={i}
              className="font-mono text-[0.88em] px-1.5 py-0.5 bg-ground-deep text-shu-deep dark:text-shu"
              style={{ borderRadius: 2 }}
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
          return (
            <strong key={i} className="font-medium text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }
        const linkMatch = part.match(LINK_RE);
        if (linkMatch) {
          const [, label, href] = linkMatch;
          const external = href.startsWith("http");
          return (
            <a
              key={i}
              href={href}
              {...(external && { target: "_blank", rel: "noopener noreferrer" })}
              className="text-shu-deep dark:text-shu underline decoration-shu-soft hover:decoration-shu underline-offset-2 transition-colors"
            >
              {label}
            </a>
          );
        }
        return <span key={i}>{part.replace(ESCAPE_RE, "$1")}</span>;
      })}
    </>
  );
}

/** Hairline-bordered metadata pill in mono (version, license, etc.). */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 font-mono text-[11px] tracking-wide text-ink-mute"
      style={{ border: "1px solid var(--color-rule)", borderRadius: 1 }}
    >
      {children}
    </span>
  );
}

/** Small vermilion seal-square. Kept understated (single character preferred). */
export function NewBadge({ label = "新" }: { label?: string }) {
  return (
    <span
      className="inline-flex items-center justify-center font-mincho text-[11px] font-bold text-ground bg-shu-deep dark:bg-shu w-5 h-5 select-none"
      style={{ borderRadius: 1, lineHeight: 1 }}
      aria-label="new"
    >
      {label}
    </span>
  );
}

export function SnippetBlock({
  label,
  code,
  language,
}: {
  label: string;
  code: string;
  language: string;
}) {
  return (
    <figure className="mt-5">
      <figcaption className="flex items-baseline justify-between mb-2">
        <span className="font-gothic text-xs uppercase tracking-[0.18em] text-ink-mute">
          {label}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          {language}
        </span>
      </figcaption>
      <pre
        className="bg-ink text-ground font-mono text-[13px] leading-[1.7] py-5 pr-5 pl-6 overflow-x-auto m-0"
        style={{ borderLeft: "2px solid var(--color-shu)" }}
      >
        <code>{code}</code>
      </pre>
    </figure>
  );
}

export interface OptionRow {
  name: string;
  type: string;
  default: string;
  description: string;
}

export function OptionsTable({
  columns,
  rows,
}: {
  columns: { name: string; type: string; default: string; description: string };
  rows: OptionRow[];
}) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-rule-strong)" }}>
            <Th>{columns.name}</Th>
            <Th>{columns.type}</Th>
            <Th>{columns.default}</Th>
            <Th>{columns.description}</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} style={{ borderBottom: "1px solid var(--color-rule)" }}>
              <td className="px-3 py-3 font-mono text-[13px] text-ink whitespace-nowrap align-top">
                {row.name}
              </td>
              <td className="px-3 py-3 font-mono text-[12px] text-ink-mute align-top">
                {row.type}
              </td>
              <td className="px-3 py-3 font-mono text-[12px] text-ink-mute whitespace-nowrap align-top">
                {row.default}
              </td>
              <td className="px-3 py-3 text-ink leading-relaxed align-top">
                <InlineMd text={row.description} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th className="text-left font-gothic font-medium text-[11px] uppercase tracking-[0.18em] text-ink-mute px-3 py-3">
      {children}
    </th>
  );
}

export function InstallCommands({ pkg }: { pkg: string }) {
  const commands = [
    { manager: "bun", command: `bun add ${pkg}` },
    { manager: "pnpm", command: `pnpm add ${pkg}` },
    { manager: "npm", command: `npm i ${pkg}` },
    { manager: "yarn", command: `yarn add ${pkg}` },
  ];
  return (
    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mt-5">
      {commands.map(({ manager, command }) => (
        <div key={manager} className="pb-3" style={{ borderBottom: "1px solid var(--color-rule)" }}>
          <p className="font-gothic text-[10px] uppercase tracking-[0.25em] text-ink-mute mb-1.5">
            {manager}
          </p>
          <code className="font-mono text-sm text-ink break-all">{command}</code>
        </div>
      ))}
    </div>
  );
}

/** Adapter switcher: horizontal table-of-contents with shu underline on the
 *  active item. Scrolls horizontally on small screens (no awkward wrapping
 *  that splits the hairline-separator pattern across rows). */
export function AdapterNav({ current, locale }: { current: AdapterKey; locale: Locale }) {
  return (
    <nav aria-label="ptpt packages" className="mb-10 sm:mb-12 -mx-5 sm:mx-0 overflow-x-auto">
      <div className="inline-block min-w-full px-5 sm:px-0">
        <ul className="flex items-stretch text-sm">
          {ADAPTERS.map((a, i) => {
            const active = a.key === current;
            return (
              <li
                key={a.key}
                className="flex items-stretch flex-shrink-0"
                style={i > 0 ? { borderLeft: "1px solid var(--color-rule)" } : {}}
              >
                <Link
                  to={a.href(locale) as `/${string}`}
                  className={[
                    "flex items-center gap-2 px-3 sm:px-4 py-2 font-mono text-[13px] whitespace-nowrap transition-colors relative",
                    active
                      ? "text-ink font-medium"
                      : "text-ink-mute hover:text-ink dark:hover:text-ink",
                  ].join(" ")}
                >
                  <span>{a.short}</span>
                  {a.isNew && <NewBadge />}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute left-3 right-3 sm:left-4 sm:right-4 -bottom-px h-px bg-shu"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
        <span aria-hidden="true" className="block h-px w-full bg-rule" />
      </div>
    </nav>
  );
}

/** A single split-flap cell sample — used for hero/accent moments. */
export function FlapSample({
  target,
  preset,
  className = "",
}: {
  target: string;
  preset?: string;
  className?: string;
}) {
  return (
    <span className={`inline-flex ${className}`}>
      <Patapata target={target} {...(preset ? { preset } : {})} />
    </span>
  );
}

/** CTA link: shu underline-grow on hover. Use for hero CTAs. */
export function Cta({
  to,
  href,
  children,
  variant = "primary",
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const cls = [
    "group inline-flex items-center gap-2 px-5 py-3 font-gothic text-[13px] uppercase tracking-[0.18em] transition-colors",
    variant === "primary"
      ? "text-ground bg-ink hover:bg-shu-deep dark:bg-ink dark:text-ground dark:hover:bg-shu"
      : "text-ink hover:text-shu-deep dark:hover:text-shu",
  ].join(" ");
  const inner = (
    <>
      {children}
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </>
  );
  if (to) {
    return (
      <Link to={to as `/${string}`} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {inner}
    </a>
  );
}

// —— shared option tables ————————————————————————————————————————
//
// These describe the `CellOptions` shared by `createCell`, the React
// `<Patapata>` component, and the other adapters.

export const SHARED_OPTIONS = {
  ja: [
    {
      name: "preset",
      type: "PresetDefinition | string",
      default: "defaultPreset",
      description:
        "フラップに使う文字セット。`PresetDefinition`（`recommendedDuration` / `locale` を既定値に使う）か、フラップ順を表す文字列を渡します。`frames` とは排他です。",
    },
    {
      name: "frames",
      type: "FrameInput[]",
      default: "undefined",
      description:
        "明示的なフレーム集合。文字だけでなく画像や任意要素も指定できます。`preset` とは排他です。",
    },
    {
      name: "durationPerFlap",
      type: "number",
      default: "プリセットの推奨値、なければ 200",
      description: "1 枚をめくるミリ秒数。プリセットの `recommendedDuration` を上書きします。",
    },
    {
      name: "direction",
      type: "'forward' | 'backward'",
      default: "'forward'",
      description: "フレームのリングをめくる向き。",
    },
    {
      name: "reducedMotion",
      type: "'instant' | 'minimal' | 'ignore'",
      default: "'instant'",
      description: "OS が「視差効果を減らす」設定のときの挙動。`instant` は瞬時に切り替えます。",
    },
  ] as OptionRow[],
  en: [
    {
      name: "preset",
      type: "PresetDefinition | string",
      default: "defaultPreset",
      description:
        "The flap set. Pass a `PresetDefinition` (its `recommendedDuration` / `locale` become defaults) or a string of characters whose order is the flap order. Mutually exclusive with `frames`.",
    },
    {
      name: "frames",
      type: "FrameInput[]",
      default: "undefined",
      description:
        "An explicit frame set — text, images, or arbitrary elements. Mutually exclusive with `preset`.",
    },
    {
      name: "durationPerFlap",
      type: "number",
      default: "preset's recommendation, else 200",
      description: "Milliseconds for one flap. Overrides the preset's `recommendedDuration`.",
    },
    {
      name: "direction",
      type: "'forward' | 'backward'",
      default: "'forward'",
      description: "Direction taken through the frame ring.",
    },
    {
      name: "reducedMotion",
      type: "'instant' | 'minimal' | 'ignore'",
      default: "'instant'",
      description:
        "Behaviour when the OS prefers reduced motion. `instant` snaps to the target without animating.",
    },
  ] as OptionRow[],
};

export const COMPONENT_OPTIONS = {
  ja: [
    {
      name: "target",
      type: "string",
      default: "—",
      description: "変化を監視し、変わるたびにめくる先のスラッグ。",
    },
    {
      name: "flipMode",
      type: "'replace' | 'queue'",
      default: "undefined",
      description: "`target` が連続で変わったときの挙動。`replace` は最新だけ、`queue` は順番に。",
    },
    {
      name: "onFlipComplete",
      type: "() => void",
      default: "undefined",
      description: "各フリップが落ち着いたあとに呼ばれます。",
    },
    {
      name: "className / style",
      type: "string / CSSProperties",
      default: "undefined",
      description: "ホスト要素に付与するクラス／スタイル。",
    },
  ] as OptionRow[],
  en: [
    {
      name: "target",
      type: "string",
      default: "—",
      description: "Slug to flip to whenever it changes.",
    },
    {
      name: "flipMode",
      type: "'replace' | 'queue'",
      default: "undefined",
      description:
        "Behaviour when `target` changes rapidly. `replace` coalesces to the latest; `queue` runs each in order.",
    },
    {
      name: "onFlipComplete",
      type: "() => void",
      default: "undefined",
      description: "Called after each flip settles.",
    },
    {
      name: "className / style",
      type: "string / CSSProperties",
      default: "undefined",
      description: "Applied to the cell's host element.",
    },
  ] as OptionRow[],
};

export const BOARD_OPTIONS = {
  ja: [
    {
      name: "cellOptions",
      type: "CellOptions",
      default: "—",
      description: "全セルに適用する共通オプション。",
    },
    {
      name: "cellOptionsOverride",
      type: "CellOptions[]",
      default: "undefined",
      description: "位置ごとに `cellOptions` を上書きする配列。",
    },
    {
      name: "targets",
      type: "(string | null)[] | string",
      default: "—",
      description:
        "各セルのめくり先。`null` はそのセルを据え置き、文字列は 1 文字ずつ各セルに割り当てます。",
    },
    {
      name: "flipMode",
      type: "'replace' | 'queue'",
      default: "undefined",
      description: "`targets` が連続で変わったときの挙動。",
    },
  ] as OptionRow[],
  en: [
    {
      name: "cellOptions",
      type: "CellOptions",
      default: "—",
      description: "Options applied to every cell.",
    },
    {
      name: "cellOptionsOverride",
      type: "CellOptions[]",
      default: "undefined",
      description: "Per-position options merged over `cellOptions`.",
    },
    {
      name: "targets",
      type: "(string | null)[] | string",
      default: "—",
      description:
        "Per-position targets. `null` keeps a cell as-is; a string assigns one character per cell.",
    },
    {
      name: "flipMode",
      type: "'replace' | 'queue'",
      default: "undefined",
      description: "Behaviour when `targets` change rapidly.",
    },
  ] as OptionRow[],
};

export const REHYPE_OPTIONS = {
  ja: [
    {
      name: "preset",
      type: "string",
      default: "'default'",
      description: "生成する盤面のフラップセット。",
    },
    {
      name: "className",
      type: "string | string[]",
      default: "'ptpt'",
      description: "ラップ要素に付与するクラス名（配列で複数指定可）。",
    },
    {
      name: "skipTags",
      type: "string[]",
      default: "['code', 'pre', 'script', 'style']",
      description: "走査をスキップするタグ。",
    },
  ] as OptionRow[],
  en: [
    {
      name: "preset",
      type: "string",
      default: "'default'",
      description: "The flap set used for generated boards.",
    },
    {
      name: "className",
      type: "string | string[]",
      default: "'ptpt'",
      description:
        "Class name(s) applied to the wrapping element. Pass an array for multiple classes.",
    },
    {
      name: "skipTags",
      type: "string[]",
      default: "['code', 'pre', 'script', 'style']",
      description: "Tags whose subtrees are left untouched.",
    },
  ] as OptionRow[],
};

export const ASTRO_INTEGRATION_OPTIONS = {
  ja: [
    {
      name: "markdown",
      type: "boolean",
      default: "true",
      description:
        "Markdown / MDX パイプラインに `rehype-ptpt` を登録するか。`false` にすると `<Patapata>` コンポーネントだけ使う構成にできます。",
    },
  ] as OptionRow[],
  en: [
    {
      name: "markdown",
      type: "boolean",
      default: "true",
      description:
        "Whether to register `rehype-ptpt` on the Markdown / MDX pipeline. Set to `false` to opt out (e.g. if you only want the `<Patapata>` component).",
    },
  ] as OptionRow[],
};

export const RECOMMENDED_CSS = `@import "@love-rox/ptpt-core/styles.css";`;

export const NPM_BASE = "https://www.npmjs.com/package/";
export const GITHUB_ROOT = "https://github.com/Love-Rox/ptpt";

export function npmUrl(pkg: string) {
  return `${NPM_BASE}${pkg}`;
}

export function githubPackageUrl(folder: string) {
  return `${GITHUB_ROOT}/tree/main/packages/ptpt-${folder}#readme`;
}
