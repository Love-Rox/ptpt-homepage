"use client";

import { useEffect } from "react";

/**
 * Sets <html lang> on the client. The root layout is statically rendered and
 * can't know the route's locale, so it ships lang="en"; this corrects it per
 * page once mounted. Renders nothing.
 */
export function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
