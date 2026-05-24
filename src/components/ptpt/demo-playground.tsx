"use client";

import { useEffect, useMemo, useState } from "react";
import { delays, presets } from "@love-rox/ptpt-core";
import { PatapataBoard } from "@love-rox/ptpt-react";
import "@love-rox/ptpt-core/styles.css";

type Lang = "en" | "ja";

const copy = {
  en: {
    targetLabel: "Destination",
    targetHint: "Type, and the board arrives at it.",
    quickLabel: "Quick picks",
    presetLabel: "Preset",
    flipModeLabel: "Flip mode",
    staggerLabel: "Stagger",
    sectionControls: "Controls",
    sectionPreview: "Board",
    sectionMarkup: "Markup",
    note: "Type a destination — the board doesn't show it, it arrives at it, each cell flipping through the chosen preset. Stagger is the gap between cells (delays.wave): raise it and the row ripples; set it to 0 and every cell flips at once. flipMode compares replace (coalesce to the latest target) and queue (run each change in order).",
    presetLabels: {
      alphanumeric: "alphanumeric — A–Z, 0–9",
      alpha: "alpha — A–Z + blank",
      digits: "digits — 0–9",
      default: "default — built-in set",
    },
  },
  ja: {
    targetLabel: "行先（文字）",
    targetHint: "入力すると、盤面がそこへ到着します。",
    quickLabel: "クイック選択",
    presetLabel: "プリセット (preset)",
    flipModeLabel: "フリップモード",
    staggerLabel: "めくり間隔",
    sectionControls: "操作盤",
    sectionPreview: "盤面",
    sectionMarkup: "出力",
    note: "行先を入力すると、盤面はそれを「表示」するのではなく、そこへ到着します。各セルは選んだ preset のフラップをめくります。めくり間隔（delays.wave）はセル間のずれで、上げると一行が波打ち、0 にすると一斉にめくれます。flipMode は replace（最新の目標だけ追う）と queue（変更を順番に消化）を比べられます。",
    presetLabels: {
      alphanumeric: "alphanumeric — A–Z, 0–9",
      alpha: "alpha — A–Z + 空白",
      digits: "digits — 0–9",
      default: "default — 標準セット",
    },
  },
} as const;

const PRESETS = ["alphanumeric", "alpha", "digits", "default"] as const;
type PresetKey = (typeof PRESETS)[number];

const WIDTH = 8;

const DEFAULT_TARGET: Record<PresetKey, string> = {
  alphanumeric: "TOKYO",
  alpha: "TOKYO",
  default: "PTPT",
  digits: "0042",
};

const QUICK_PICKS: Record<PresetKey, string[]> = {
  alphanumeric: ["TOKYO", "OSAKA", "GATE 7", "LONDON"],
  alpha: ["TOKYO", "OSAKA", "KYOTO", "LONDON"],
  default: ["PTPT", "HELLO!", "12:45", "TRACK 3"],
  digits: ["0042", "0117", "2026", "0506"],
};

function pad(word: string, width: number): string {
  return word.slice(0, width).padEnd(width, " ");
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Section heading inside the playground (Controls / Board / Markup). */
function PanelHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-baseline gap-3">
      <span aria-hidden="true" className="block w-4 h-px bg-shu" />
      <h2 className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-mute">{children}</h2>
    </div>
  );
}

/** Field with a Gothic uppercase label. */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-gothic text-[10px] uppercase tracking-[0.25em] text-ink-mute">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "bg-transparent text-ink font-mono text-sm pb-1.5 pt-0.5 px-0 outline-none focus:outline-none transition-colors";
const inputUnderline = { borderBottom: "1px solid var(--color-rule-strong)" };
const inputUnderlineFocus = "focus:[border-bottom-color:var(--color-shu)]";

export function DemoPlayground({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [preset, setPreset] = useState<PresetKey>("alphanumeric");
  const [flipMode, setFlipMode] = useState<"replace" | "queue">("replace");
  const [stagger, setStagger] = useState(60);
  const [target, setTarget] = useState(DEFAULT_TARGET.alphanumeric);

  // Characters the current preset can actually show (always includes blank).
  const allowed = useMemo(() => new Set(presets[preset].chars), [preset]);

  // Uppercase + keep only flappable characters, capped at the board width.
  const sanitize = (raw: string): string =>
    [...raw.toUpperCase()]
      .filter((c) => allowed.has(c))
      .join("")
      .slice(0, WIDTH);

  // When the preset changes, drop to a destination that's valid for it.
  useEffect(() => {
    setTarget(DEFAULT_TARGET[preset]);
  }, [preset]);

  const targets = pad(target, WIDTH);
  const delayFn = useMemo(() => delays.wave({ step: stagger }), [stagger]);

  const markup = `import { presets, delays } from "@love-rox/ptpt-core";

<PatapataBoard
  cellOptions={{ preset: presets.${preset} }}
  targets="${escape(targets)}"
  flipMode="${flipMode}"
  delayFn={delays.wave({ step: ${stagger} })}
/>`;

  return (
    <div className="ptpt-demo-scope">
      {/* —— Controls panel —————————————————————————————————————————— */}
      <section className="mb-12">
        <PanelHeading>{t.sectionControls}</PanelHeading>

        {/* Destination input — the primary control */}
        <div className="mb-8">
          <Field label={t.targetLabel}>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(sanitize(e.target.value))}
              placeholder={DEFAULT_TARGET[preset]}
              spellCheck={false}
              autoComplete="off"
              maxLength={WIDTH}
              className={`${inputCls} w-full text-lg tracking-[0.25em] uppercase ${inputUnderlineFocus}`}
              style={inputUnderline}
            />
          </Field>
          <p className="mt-2 font-gothic text-[11px] text-ink-soft">{t.targetHint}</p>

          {/* Quick picks */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="font-gothic text-[10px] uppercase tracking-[0.25em] text-ink-soft mr-1">
              {t.quickLabel}
            </span>
            {QUICK_PICKS[preset].map((word) => {
              const active = target === sanitize(word);
              return (
                <button
                  key={word}
                  type="button"
                  onClick={() => setTarget(sanitize(word))}
                  className={`font-mono text-[11px] px-2.5 py-1 border transition-colors ${
                    active
                      ? "text-shu border-shu"
                      : "text-ink-mute border-rule hover:text-ink hover:border-rule-strong"
                  }`}
                >
                  {word}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
          <Field label={t.presetLabel}>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value as PresetKey)}
              className={`${inputCls} w-full appearance-none cursor-pointer ${inputUnderlineFocus}`}
              style={inputUnderline}
            >
              {PRESETS.map((val) => (
                <option key={val} value={val}>
                  {t.presetLabels[val]}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t.flipModeLabel}>
            <select
              value={flipMode}
              onChange={(e) => setFlipMode(e.target.value as "replace" | "queue")}
              className={`${inputCls} w-full appearance-none cursor-pointer ${inputUnderlineFocus}`}
              style={inputUnderline}
            >
              <option value="replace">replace</option>
              <option value="queue">queue</option>
            </select>
          </Field>

          {/* Stagger interval — the "間隔" between cells (delays.wave step) */}
          <Field label={`${t.staggerLabel} — ${stagger}ms`}>
            <input
              type="range"
              min={0}
              max={160}
              step={10}
              value={stagger}
              onChange={(e) => setStagger(Number(e.target.value))}
              className="w-full accent-[var(--color-shu)] cursor-pointer"
            />
          </Field>
        </div>
      </section>

      {/* —— Board panel ————————————————————————————————————————————— */}
      <section className="mb-12">
        <PanelHeading>{t.sectionPreview}</PanelHeading>

        <div className="board">
          <div className="board-head flex items-center justify-between gap-4 px-4 sm:px-5 h-9">
            <span>live board · gate a1</span>
            <span className="pill pill-ontime" style={{ border: 0, padding: 0 }}>
              <span aria-hidden="true" className="pill-lamp" />
              live
            </span>
          </div>
          <div className="py-10 px-4 flex justify-center overflow-x-auto">
            <PatapataBoard
              cellOptions={{ preset: presets[preset] }}
              targets={targets}
              flipMode={flipMode}
              delayFn={delayFn}
              className="ptpt-board"
              style={{ display: "flex", gap: "0.35rem" }}
            />
          </div>
        </div>
      </section>

      {/* —— Markup panel —————————————————————————————————————————— */}
      <section>
        <PanelHeading>{t.sectionMarkup}</PanelHeading>
        <pre
          className="bg-ground-deep text-ink font-mono text-[12px] leading-[1.7] py-5 pr-5 pl-6 overflow-x-auto m-0 whitespace-pre-wrap break-all"
          style={{ borderLeft: "2px solid var(--color-shu)" }}
        >
          <code>{markup}</code>
        </pre>

        <p className="mt-6 text-xs text-ink-mute leading-relaxed">{t.note}</p>
      </section>
    </div>
  );
}
