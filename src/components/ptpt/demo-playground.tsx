"use client";

import { useEffect, useMemo, useState } from "react";
import { PatapataBoard } from "@love-rox/ptpt-react";
import "@love-rox/ptpt-core/styles.css";

type Lang = "en" | "ja";

const copy = {
  en: {
    boardLabel: "Departure board",
    presetLabel: "Preset",
    autoLabel: "Auto-cycle",
    flipModeLabel: "Flip mode",
    nextLabel: "Flip now",
    sectionControls: "Controls",
    sectionPreview: "Board",
    sectionMarkup: "Markup",
    note: "A `PatapataBoard` of split-flap cells. Each cell flips through the chosen `preset`; the board staggers the cells so the whole row ripples like a real departure display. Toggle `flipMode` to compare `replace` (coalesce to the latest) vs `queue` (run each in order).",
    destinations: ["TOKYO", "OSAKA", "KYOTO", "NAGOYA", "SAPORO"],
    presetLabels: {
      alpha: "alpha — A–Z + blank",
      alphanumeric: "alphanumeric — A–Z, 0–9",
      digits: "digits — 0–9",
      default: "default — built-in set",
    },
  },
  ja: {
    boardLabel: "発車案内板",
    presetLabel: "プリセット (preset)",
    autoLabel: "自動でめくる",
    flipModeLabel: "フリップモード",
    nextLabel: "いま、めくる",
    sectionControls: "操作盤",
    sectionPreview: "盤面",
    sectionMarkup: "出力",
    note: "パタパタ（split-flap）セルを並べた `PatapataBoard` です。各セルは選んだ `preset` のフラップをめくり、盤面はセルをずらして動かすので、本物の発車案内板のように一行が波打ちます。`flipMode` を切り替えると、`replace`（最新だけ）と `queue`（順番に）の違いを比べられます。",
    destinations: ["トウキヨウ", "オオサカ", "キヨウト", "ナゴヤ", "サツポロ"],
    presetLabels: {
      alpha: "alpha — A–Z + 空白",
      alphanumeric: "alphanumeric — A–Z, 0–9",
      digits: "digits — 0–9",
      default: "default — 標準セット",
    },
  },
} as const;

const PRESETS = ["alphanumeric", "alpha", "digits", "default"] as const;
type PresetKey = (typeof PRESETS)[number];

// English destinations padded to a fixed board width.
const WIDTH = 7;
const EN_TARGETS = ["TOKYO", "OSAKA", "KYOTO", "NAGOYA", "SAPPORO"];

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
      <h2 className="font-gothic text-[11px] uppercase tracking-[0.3em] text-ink-mute">
        {children}
      </h2>
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
  const [auto, setAuto] = useState(true);
  const [index, setIndex] = useState(0);

  // English destinations work with the alpha/alphanumeric presets; for digits
  // we show a numeric track number instead so every cell has a valid frame.
  const words = useMemo(
    () => (preset === "digits" ? ["0042", "0117", "0238", "1024", "0506"] : EN_TARGETS),
    [preset],
  );

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), 2600);
    return () => clearInterval(id);
  }, [auto, words.length]);

  // Reset the index when the word set changes so we never point past the end.
  useEffect(() => {
    setIndex(0);
  }, [words]);

  const current = words[index] ?? words[0] ?? "";
  const width = preset === "digits" ? 4 : WIDTH;
  const targets = pad(current, width);

  const markup = `<PatapataBoard
  cellOptions={{ preset: "${preset}" }}
  targets="${escape(targets)}"
  flipMode="${flipMode}"
/>`;

  return (
    <div className="ptpt-demo-scope">
      {/* —— Controls panel —————————————————————————————————————————— */}
      <section className="mb-12">
        <PanelHeading>{t.sectionControls}</PanelHeading>

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

          <div className="flex items-end gap-6">
            <label className="flex items-center gap-3 cursor-pointer pb-1.5">
              <span
                className="relative inline-block w-9 h-4 transition-colors"
                style={{
                  border: "1px solid var(--color-rule-strong)",
                  borderRadius: 999,
                  backgroundColor: auto ? "var(--color-shu)" : "transparent",
                }}
              >
                <input
                  type="checkbox"
                  checked={auto}
                  onChange={(e) => setAuto(e.target.checked)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <span
                  className="absolute top-0.5 w-2.5 h-2.5 bg-ground transition-transform"
                  style={{
                    borderRadius: 999,
                    border: "1px solid var(--color-rule-strong)",
                    left: auto ? "calc(100% - 0.625rem - 2px)" : "2px",
                  }}
                />
              </span>
              <span className="font-gothic text-[12px] text-ink">{t.autoLabel}</span>
            </label>

            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % words.length)}
              className="font-gothic text-[12px] uppercase tracking-[0.18em] text-ground bg-ink px-4 py-2 hover:bg-shu-deep dark:hover:bg-shu transition-colors"
            >
              {t.nextLabel}
            </button>
          </div>
        </div>
      </section>

      {/* —— Board panel ————————————————————————————————————————————— */}
      <section className="mb-12">
        <PanelHeading>{t.sectionPreview}</PanelHeading>

        <div
          className="py-10 px-4 bg-ground-card flex justify-center"
          style={{
            borderTop: "1px solid var(--color-rule)",
            borderBottom: "1px solid var(--color-rule)",
          }}
        >
          <PatapataBoard
            cellOptions={{ preset }}
            targets={targets}
            flipMode={flipMode}
            className="ptpt-board"
            style={{ display: "flex", gap: "0.35rem" }}
          />
        </div>
      </section>

      {/* —— Markup panel —————————————————————————————————————————— */}
      <section>
        <PanelHeading>{t.sectionMarkup}</PanelHeading>
        <pre
          className="bg-ink text-ground font-mono text-[12px] leading-[1.7] py-5 pr-5 pl-6 overflow-x-auto m-0 whitespace-pre-wrap break-all"
          style={{ borderLeft: "2px solid var(--color-shu)" }}
        >
          <code>{markup}</code>
        </pre>

        <p className="mt-6 text-xs text-ink-mute leading-relaxed">{t.note}</p>
      </section>
    </div>
  );
}
