import "@/styles.css";

import type { ReactNode } from "react";
import { unstable_getContext } from "waku/server";
import { Footer } from "@/components/global/footer";
import { Header } from "@/components/global/header";
import {
  WebSiteSchema,
  OrganizationSchema,
  SoftwareApplicationSchema,
} from "@/components/seo/structured-data";
import { detectLocale } from "@/lib/locale";
import navJa from "@private/lang/components/global/ja/nav.json";
import navEn from "@private/lang/components/global/en/nav.json";

const navData = { ja: navJa, en: navEn };

const description = {
  en: "patapata: a split-flap (solari / departure-board) display library for the web. Official site for the @love-rox/ptpt-* package family.",
  ja: "Webに、パタパタ（反転フラップ）式ディスプレイの手触りを。@love-rox/ptpt-* パッケージファミリーの公式サイト。",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const ctx = unstable_getContext() as { req?: { url?: string } } | undefined;
  const url = ctx?.req?.url ?? "/";
  const pathname = (() => {
    try {
      return new URL(url, "https://ptpt.love-rox.cc").pathname;
    } catch {
      return "/";
    }
  })();
  const lang = detectLocale(pathname);
  const navItems = navData[lang].items;

  return (
    <html lang={lang}>
      <head>
        <meta name="description" content={description[lang]} />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" type="image/png" href="/images/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <WebSiteSchema lang={lang} />
        <OrganizationSchema />
        <SoftwareApplicationSchema />
      </head>
      <body className="bg-ground text-ink antialiased">
        <div className="relative min-h-screen flex flex-col">
          {/* terminal edge — an amber signal rail pinned to the right edge,
              like the lit trim down the side of a departures board. Hidden on
              small screens to avoid overlapping body content. */}
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
      </body>
    </html>
  );
}

export const getConfig = async () => {
  return { render: "dynamic" } as const;
};
