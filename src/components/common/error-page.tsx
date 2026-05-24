"use client";

import { Link } from "waku";
import { Meta } from "@/components/global/meta";
import { localePath, type Locale } from "@/lib/locale";

const data = {
  ja: {
    titleSuffix: "patapata",
    homeLink: "ホームに戻る",
    retryLabel: "再試行",
    boardLabel: "departures",
    statusLabel: "not found",
  },
  en: {
    titleSuffix: "patapata",
    homeLink: "Back to home",
    retryLabel: "Try again",
    boardLabel: "departures",
    statusLabel: "not found",
  },
};

interface ErrorPageProps {
  lang?: Locale;
  code?: string;
  title: string;
  message: string;
  error?: Error;
  reset?: () => void;
}

export default function ErrorPage({
  lang = "en",
  code,
  title,
  message,
  error,
  reset,
}: ErrorPageProps) {
  const t = data[lang];

  return (
    <div className="px-5 sm:px-6 lg:px-12 py-20 pt-24 min-h-[70vh] flex flex-col items-center justify-center">
      <Meta title={`${title} - ${t.titleSuffix}`} description={message} />

      <div className="board w-full max-w-lg">
        {/* legend — a delayed/not-found signal */}
        <div className="board-head flex items-center justify-between gap-4 px-4 sm:px-5 h-9">
          <span>{t.boardLabel}</span>
          <span className="pill pill-delayed" style={{ border: 0, padding: 0 }}>
            <span aria-hidden="true" className="pill-lamp" />
            {t.statusLabel}
          </span>
        </div>

        <div className="px-6 py-12 flex flex-col items-center text-center gap-6">
          {code && (
            <span className="inline-flex gap-1.5" aria-hidden="true">
              {[...code].map((c, i) => (
                <span
                  key={i}
                  className="flap-chip text-stop"
                  style={{ fontSize: "2.5rem", padding: "0.28em 0.32em 0.34em" }}
                >
                  {c}
                </span>
              ))}
            </span>
          )}

          <h1 className="font-display uppercase tracking-wide text-2xl sm:text-3xl text-ink">
            {title}
          </h1>

          <p className="font-gothic text-sm text-ink-mute max-w-md leading-relaxed">{message}</p>

          {error && (
            <pre
              className="ticket w-full text-left p-4 font-mono text-xs text-stop overflow-auto"
              style={{ borderLeft: "2px solid var(--color-stop)" }}
            >
              <code>{error.message}</code>
            </pre>
          )}

          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            {reset && (
              <button
                onClick={reset}
                className="inline-flex items-center justify-center px-5 py-3 bg-shu hover:bg-shu-deep text-ground font-gothic text-[13px] uppercase tracking-[0.18em] transition-colors"
              >
                {t.retryLabel}
              </button>
            )}
            <Link
              to={localePath(lang, "")}
              className="inline-flex items-center justify-center px-5 py-3 border border-rule hover:border-shu text-ink hover:text-shu-deep dark:hover:text-shu font-gothic text-[13px] uppercase tracking-[0.18em] transition-colors"
            >
              {t.homeLink}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
