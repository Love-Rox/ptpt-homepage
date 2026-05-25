import "@/styles.css";

import type { ReactNode } from "react";
import {
  WebSiteSchema,
  OrganizationSchema,
  SoftwareApplicationSchema,
} from "@/components/seo/structured-data";

// Static root layout: provides the document shell only. Per-locale chrome
// (header/footer/nav) lives in <PageShell>, rendered by each view with the
// route's locale — the static layout can't know the locale itself. <html lang>
// ships as "en" and is corrected per page by <HtmlLang> on the client.
const description =
  "patapata: a split-flap (solari / departure-board) display library for the web. Official site for the @love-rox/ptpt-* package family.";

export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="description" content={description} />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" type="image/png" href="/images/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <WebSiteSchema lang="en" />
        <OrganizationSchema />
        <SoftwareApplicationSchema />
      </head>
      <body className="bg-ground text-ink antialiased">{children}</body>
    </html>
  );
}

export const getConfig = async () => {
  return { render: "static" } as const;
};
