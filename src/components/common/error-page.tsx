"use client";

import { Link } from "waku";
import { Meta } from "@/components/global/meta";
import { localePath, type Locale } from "@/lib/locale";

const data = {
  ja: {
    titleSuffix: "patapata",
    homeLink: "ホームに戻る",
    retryLabel: "再試行",
  },
  en: {
    titleSuffix: "patapata",
    homeLink: "Back to home",
    retryLabel: "Try again",
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
      <Meta title={`${title} - ${t.titleSuffix}`} description={message} />

      {code && <p className="text-6xl font-bold text-primary-500 mb-4 font-mono">{code}</p>}

      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
        {title}
      </h1>

      <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md">{message}</p>

      {error && (
        <pre className="mb-8 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg text-sm text-left overflow-auto max-w-full">
          <code className="text-red-600 dark:text-red-400">{error.message}</code>
        </pre>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {reset && (
          <button
            onClick={reset}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
          >
            {t.retryLabel}
          </button>
        )}
        <Link
          to={localePath(lang, "")}
          className="inline-flex items-center justify-center px-6 py-3 border border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-medium rounded-lg transition-colors"
        >
          {t.homeLink}
        </Link>
      </div>
    </div>
  );
}
