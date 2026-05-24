// en-default URL strategy:
//   en: "/", "/demo", "/react", ...
//   ja: "/ja", "/ja/demo", "/ja/react", ...
//
// Helpers below construct URLs and absorb the asymmetry so callers don't
// repeat the prefix logic.

export type Locale = "ja" | "en";

export const DEFAULT_LOCALE: Locale = "en";

/**
 * Build a path for a given locale.
 * `suffix` is the page identifier with no leading slash, e.g. "demo", "react",
 * "blog/release". Pass "" for the locale's landing page.
 */
export function localePath(locale: Locale, suffix: string): `/${string}` {
  const prefix = locale === "en" ? "" : "/ja";
  if (suffix === "") return (prefix === "" ? "/" : prefix) as `/${string}`;
  return `${prefix}/${suffix}` as `/${string}`;
}

/**
 * Detect the locale from a URL pathname.
 * `/ja/...` and `/ja` → "ja"; everything else → "en".
 */
export function detectLocale(pathname: string): Locale {
  return pathname === "/ja" || pathname.startsWith("/ja/") ? "ja" : "en";
}

/**
 * Strip the locale prefix from a pathname, returning the suffix used by
 * `localePath()`. `/ja/demo` → "demo"; `/demo` → "demo"; `/` → "".
 */
export function stripLocale(pathname: string): string {
  const noLeading = pathname.startsWith("/ja/")
    ? pathname.slice(4)
    : pathname === "/ja"
      ? ""
      : pathname.startsWith("/")
        ? pathname.slice(1)
        : pathname;
  return noLeading.replace(/^\/+|\/+$/g, "");
}
