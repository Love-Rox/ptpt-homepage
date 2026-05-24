import type { ReactNode } from "react";
import { Link } from "waku";
import { Patapata } from "@love-rox/ptpt-react";
import "@love-rox/ptpt-core/styles.css";
import { localePath, type Locale } from "@/lib/locale";

export type { Locale };

export type AdapterKey = "core" | "react" | "vue" | "rehype" | "astro";

/**
 * Per-package release status, shown as the board's status lamp:
 *   - "new"    — shipped or updated in the current release
 *   - "ontime" — unchanged from the existing release
 * Everything is "new" for the first release; flip a package to "ontime" once a
 * later release leaves it untouched.
 */
export type ReleaseStatus = "new" | "ontime";

export interface AdapterMeta {
  key: AdapterKey;
  name: string;
  short: string;
  href: (locale: Locale) => string;
  status: ReleaseStatus;
}

export const ADAPTERS: AdapterMeta[] = [
  {
    key: "core",
    name: "@love-rox/ptpt-core",
    short: "core",
    href: (l) => localePath(l, ""),
    status: "new",
  },
  {
    key: "react",
    name: "@love-rox/ptpt-react",
    short: "react",
    href: (l) => localePath(l, "react"),
    status: "new",
  },
  {
    key: "vue",
    name: "@love-rox/ptpt-vue",
    short: "vue",
    href: (l) => localePath(l, "vue"),
    status: "new",
  },
  {
    key: "rehype",
    name: "@love-rox/ptpt-rehype",
    short: "rehype",
    href: (l) => localePath(l, "rehype"),
    status: "new",
  },
  {
    key: "astro",
    name: "@love-rox/ptpt-astro",
    short: "astro",
    href: (l) => localePath(l, "astro"),
    status: "new",
  },
];

// —— departure-board primitives ————————————————————————————————————

/** A faux split-flap word: each character on its own Solari flap chip. Used
 *  for wordmarks and short accents where the live JS board would be overkill. */
export function FlapWord({
  text,
  className = "",
  ariaLabel,
}: {
  text: string;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <span
      className={`inline-flex gap-[2px] ${className}`}
      {...(ariaLabel ? { role: "img", "aria-label": ariaLabel } : {})}
    >
      {[...text].map((ch, i) => (
        <span key={i} aria-hidden="true" className="flap-chip">
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

/** A gate / departure code used as a section index. Replaces the old vertical
 *  kanji chapter number — now a "GATE 0n" legend with the number on a flap. */
export function GateTag({ n, label = "GATE" }: { n: number; label?: string }) {
  const code = String(n).padStart(2, "0");
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-soft select-none">
      <span>{label}</span>
      <span className="flap-chip text-shu-deep dark:text-shu" style={{ fontSize: "12px" }}>
        {code}
      </span>
    </span>
  );
}

/** Status lamp + label, signal-coloured: the board's on-time / boarding /
 *  delayed / new indicator. */
export function StatusPill({
  kind = "ontime",
  children,
}: {
  kind?: "ontime" | "boarding" | "delayed" | "new";
  children: ReactNode;
}) {
  return (
    <span className={`pill pill-${kind}`}>
      <span aria-hidden="true" className="pill-lamp" />
      {children}
    </span>
  );
}

/** Terminal roundel — a circular departures seal showing a single split-flap
 *  cell caught mid-glyph. Replaces the old 落款印 seal. */
export function Roundel({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="ptpt" className="select-none">
      <circle cx="32" cy="32" r="30" fill="var(--color-ground-deep)" stroke="var(--color-shu)" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="24.5" fill="none" stroke="var(--color-rule)" strokeWidth="1" />
      <rect x="22" y="19" width="20" height="26" rx="2.5" fill="var(--color-ink)" />
      <text
        x="32"
        y="39"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontWeight="700"
        fontSize="21"
        fill="var(--color-ground-deep)"
      >
        P
      </text>
      <rect x="22" y="31.2" width="20" height="1.6" fill="var(--color-ground-deep)" />
    </svg>
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

/** Section: a departures-board legend header — gate code · eyebrow · hairline
 *  rule, with a signage heading and a flap-seam underline. */
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
        <div className="flex items-center gap-3 mb-3">
          {n !== undefined && <GateTag n={n} />}
          {eyebrow && (
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-mute">
              {eyebrow}
            </p>
          )}
          <span aria-hidden="true" className="flex-1 h-px bg-rule" />
        </div>
        <h2 className="font-mincho text-2xl sm:text-3xl lg:text-4xl text-ink leading-tight">
          {heading}
        </h2>
        <span aria-hidden="true" className="board-seam block w-full mt-4 sm:mt-5" />
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
const INLINE_MD_RE = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
const LINK_RE = /^\[([^\]]+)\]\(([^)]+)\)$/;
const ESCAPE_RE = /\\([`*[\]()\\])/g;

/** Strip markdown markers so a string is safe for plain-text contexts like
 *  meta descriptions and OGP unfurls. */
export function stripMd(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
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
        if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
          return (
            <em key={i} className="not-italic text-shu-deep dark:text-shu">
              {part.slice(1, -1)}
            </em>
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

/** Hairline-bordered metadata chip in mono — a board placard (version,
 *  license, SSR, etc.). */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 font-mono text-[11px] tracking-wide text-ink-mute"
      style={{
        border: "1px solid var(--color-rule)",
        borderRadius: 1,
        background: "rgba(0, 0, 0, 0.28)",
      }}
    >
      {children}
    </span>
  );
}

/** A "NEW" departures flag — amber signal lamp on a board pill. */
export function NewBadge({ label = "NEW" }: { label?: string }) {
  return (
    <span className="pill pill-new" aria-label="new">
      <span aria-hidden="true" className="pill-lamp" />
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
    <figure className="ticket mt-5">
      <figcaption className="flex items-baseline justify-between px-4 py-2 border-b border-rule">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute">
          {label}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-shu-deep dark:text-shu">
          {language}
        </span>
      </figcaption>
      <pre
        className="bg-ground-deep text-ink font-mono text-[13px] leading-[1.7] py-5 pr-5 pl-6 overflow-x-auto m-0"
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
            <tr key={row.name} className="flap-row">
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
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-soft">
            Gates
          </span>
          <span aria-hidden="true" className="hidden sm:block flex-1 h-px bg-rule" />
        </div>
        <ul className="flex items-stretch text-sm">
          {ADAPTERS.map((a, i) => {
            const active = a.key === current;
            const code = a.key === "core" ? "00" : String(i).padStart(2, "0");
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
                    active ? "text-ink font-medium" : "text-ink-mute hover:text-ink dark:hover:text-ink",
                  ].join(" ")}
                >
                  {active && <span aria-hidden="true" className="pill-lamp text-shu" />}
                  <span className="text-ink-soft text-[10px] tracking-[0.15em]">{code}</span>
                  <span>{a.short}</span>
                  {a.status === "new" && <NewBadge />}
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
    "group inline-flex items-center gap-2.5 px-5 py-3 font-gothic text-[13px] uppercase tracking-[0.18em] transition-colors",
    variant === "primary"
      ? "text-ground bg-shu hover:bg-shu-deep"
      : "text-ink border border-rule hover:border-shu hover:text-shu-deep dark:hover:text-shu",
  ].join(" ");
  const inner = (
    <>
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="w-1.5 h-1.5 rounded-full bg-ground/80"
          style={{ boxShadow: "0 0 0 2px rgba(13,14,17,0.25)" }}
        />
      )}
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
      type: "'forward' | 'shortest'",
      default: "'forward'",
      description:
        "フレームのリングをめくる向き。`shortest` は近いほうへ逆回りすることもあります。",
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
      type: "'forward' | 'shortest'",
      default: "'forward'",
      description:
        "Direction taken through the frame ring. `shortest` may reverse to reach a nearer flap.",
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
      name: "className",
      type: "string",
      default: "'patapata'",
      description: "インライン要素を盤面に変換する目印となるクラス名。",
    },
    {
      name: "fenceLanguage",
      type: "string",
      default: "'patapata'",
      description: "盤面に変換するフェンスコードブロックのコードフェンス言語。",
    },
    {
      name: "defaultPreset",
      type: "string",
      default: "undefined",
      description: "要素／ブロックがプリセットを指定しないときに使うプリセット名。",
    },
  ] as OptionRow[],
  en: [
    {
      name: "className",
      type: "string",
      default: "'patapata'",
      description: "Class that marks an inline element for conversion into a board.",
    },
    {
      name: "fenceLanguage",
      type: "string",
      default: "'patapata'",
      description: "Code-fence language that marks a fenced block for conversion.",
    },
    {
      name: "defaultPreset",
      type: "string",
      default: "undefined",
      description: "Preset name applied when an element / block specifies none.",
    },
  ] as OptionRow[],
};

export const ASTRO_INTEGRATION_OPTIONS = {
  ja: [
    {
      name: "markdown",
      type: "boolean | RehypePtptOptions",
      default: "true",
      description:
        "Markdown / MDX パイプラインに `rehypePtpt` を登録するか。オブジェクトを渡すと rehype 側のオプション（`defaultPreset` など）を転送できます。`false` でオフ。",
    },
    {
      name: "styles",
      type: "boolean",
      default: "true",
      description: "各ページに `@love-rox/ptpt-core/styles.css` を注入するか。",
    },
    {
      name: "hydrate",
      type: "boolean",
      default: "true",
      description: "読み込み時に走るクライアント hydrator を注入するか。",
    },
  ] as OptionRow[],
  en: [
    {
      name: "markdown",
      type: "boolean | RehypePtptOptions",
      default: "true",
      description:
        "Register `rehypePtpt` on the Markdown / MDX pipeline. Pass an object to forward rehype options (e.g. `defaultPreset`); set `false` to opt out.",
    },
    {
      name: "styles",
      type: "boolean",
      default: "true",
      description: "Inject `@love-rox/ptpt-core/styles.css` on every page.",
    },
    {
      name: "hydrate",
      type: "boolean",
      default: "true",
      description: "Inject the client hydrator that runs on load.",
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
