"use client";

import { useState } from "react";
import { ClientRouterHelper } from "@/helper/ClientRouterHelper";
import { DarkModeToggle } from "@/components/common/dark-mode-toggle";
import { localePath, type Locale } from "@/lib/locale";

interface NavItem {
  name: string;
  href: string;
}

interface HeaderProps {
  lang: Locale;
  navItems?: NavItem[];
}

export const Header = ({ lang, navItems = [] }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const homeHref = localePath(lang, "");

  return (
    <header className="relative z-40">
      {/* hairline ruled top edge — anchors the header to the page like a book gutter */}
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-rule" />

      <nav
        aria-label="Global"
        className="flex items-center justify-between gap-4 sm:gap-6 px-5 sm:px-6 lg:px-12 py-4 sm:py-5"
      >
        {/* Wordmark — Mincho display + small shu rule + reading hint */}
        <a
          href={homeHref}
          className="group flex items-baseline gap-3 -ml-1 px-1 transition-opacity hover:opacity-80"
        >
          <span className="font-mincho text-xl text-ink leading-none">パタパタ</span>
          <span aria-hidden="true" className="hidden xs:block w-px h-4 bg-shu" />
          <span className="hidden xs:inline font-mono text-[11px] text-ink-mute tracking-[0.18em]">
            patapata
          </span>
        </a>

        {/* mobile button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden p-2 -mr-2 text-ink"
          aria-label="Open menu"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
          >
            <path strokeLinecap="round" d="M4 8h16M4 16h16" />
          </svg>
        </button>

        {/* desktop nav: items separated by thin shu vertical rules — book-spine feel */}
        <div className="hidden lg:flex items-center gap-0">
          {navItems.map((item, i) => {
            const external = item.href.startsWith("http");
            return (
              <span key={item.name} className="flex items-center">
                {i > 0 && <span aria-hidden="true" className="block w-px h-3 bg-rule mx-2" />}
                <a
                  href={item.href}
                  {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                  className="group relative px-3 py-1.5 font-gothic text-[13px] text-ink-mute hover:text-ink transition-colors"
                >
                  {item.name}
                  {/* hairline shu underline grows on hover */}
                  <span
                    aria-hidden="true"
                    className="absolute left-3 right-3 -bottom-0.5 h-px bg-shu origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-[var(--ease-paper)]"
                  />
                </a>
              </span>
            );
          })}
        </div>

        {/* desktop right: theme + language */}
        <div className="hidden lg:flex items-center gap-3">
          <DarkModeToggle />
          <span aria-hidden="true" className="block w-px h-4 bg-rule" />
          <ClientRouterHelper currentLang={lang} />
        </div>
      </nav>

      {/* mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-ground/85"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="relative ml-auto h-full w-full max-w-sm bg-ground border-l border-rule px-6 py-6 overflow-y-auto">
            <div className="flex items-baseline justify-between mb-10">
              <span className="font-mincho text-2xl text-ink leading-none">パタパタ</span>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 -mr-2 text-ink"
                aria-label="Close menu"
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.25"
                >
                  <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
                </svg>
              </button>
            </div>
            <ul className="space-y-0">
              {navItems.map((item, i) => {
                const external = item.href.startsWith("http");
                return (
                  <li
                    key={item.name}
                    style={{
                      borderTop: i === 0 ? "1px solid var(--color-rule)" : "none",
                      borderBottom: "1px solid var(--color-rule)",
                    }}
                  >
                    <a
                      href={item.href}
                      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                      className="flex items-center justify-between py-4 font-gothic text-base text-ink"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{item.name}</span>
                      <span aria-hidden="true" className="text-shu">
                        →
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <div className="mt-10 flex items-center justify-between">
              <ClientRouterHelper currentLang={lang} />
              <DarkModeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
