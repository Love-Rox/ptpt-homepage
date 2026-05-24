"use client";

import { useEffect, useState } from "react";
import { useRouter } from "waku/router/client";
import { LanguageSelector } from "@/components/global/language-selector";
import { detectLocale, localePath, stripLocale, type Locale } from "@/lib/locale";

export function ClientRouterHelper({ currentLang: initialLang }: { currentLang: Locale }) {
  const router = useRouter();
  const [currentLang, setCurrentLang] = useState<Locale>(initialLang);

  useEffect(() => {
    const update = () => setCurrentLang(detectLocale(window.location.pathname));
    update();
    window.addEventListener("popstate", update);
    return () => window.removeEventListener("popstate", update);
  }, []);

  const handleLangChange = (newLang: string) => {
    if (newLang !== "ja" && newLang !== "en") return;
    const suffix = stripLocale(window.location.pathname);
    const target = localePath(newLang, suffix);
    router.push(target);
    setCurrentLang(newLang);
  };

  return <LanguageSelector currentLang={currentLang} onLanguageChange={handleLangChange} />;
}
