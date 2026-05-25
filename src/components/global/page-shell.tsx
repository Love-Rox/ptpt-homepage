import type { ReactNode } from "react";
import { Footer } from "@/components/global/footer";
import { Header } from "@/components/global/header";
import { HtmlLang } from "@/components/global/html-lang";
import type { Locale } from "@/lib/locale";
import navJa from "@private/lang/components/global/ja/nav.json";
import navEn from "@private/lang/components/global/en/nav.json";

const navData = { ja: navJa, en: navEn };

/**
 * Per-locale page chrome: terminal edge, header, footer. Lives here (not in
 * the root layout) because the static layout can't know the route's locale;
 * each view wraps its content in <PageShell lang={locale}>.
 */
export function PageShell({ lang, children }: { lang: Locale; children: ReactNode }) {
  const navItems = navData[lang].items;
  return (
    <div className="relative min-h-screen flex flex-col">
      <HtmlLang lang={lang} />

      {/* terminal edge — an amber signal rail down the right edge. */}
      <div
        aria-hidden="true"
        className="hidden md:flex fixed top-0 bottom-0 right-0 z-30 w-6 bg-shu items-end justify-center pb-6 pointer-events-none"
      >
        <span
          className="font-mono text-[10px] text-ground tracking-[0.3em] uppercase select-none"
          style={{ writingMode: "vertical-rl" }}
        >
          departures · @love-rox/ptpt
        </span>
      </div>

      <Header lang={lang} navItems={navItems} />
      <main className="flex-1 *:min-h-64 lg:min-h-svh">{children}</main>
      <Footer lang={lang} />
    </div>
  );
}
