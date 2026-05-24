import { Link } from "waku";
import { localePath, type Locale } from "@/lib/locale";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  lang: Locale;
}

const homeLabels: Record<Locale, string> = {
  en: "Home",
  ja: "ホーム",
};

export const Breadcrumbs = ({ items, lang }: BreadcrumbsProps) => {
  const allItems: BreadcrumbItem[] = [
    { label: homeLabels[lang], href: localePath(lang, "") },
    ...items,
  ];

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              {index > 0 && (
                <span className="text-slate-400 dark:text-slate-500" aria-hidden="true">
                  /
                </span>
              )}
              {isLast || !item.href ? (
                <span
                  className={isLast ? "text-slate-900 dark:text-slate-100 font-medium" : ""}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href as `/${string}`}
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export const generateBreadcrumbItems = (
  items: BreadcrumbItem[],
  lang: Locale,
): { name: string; url: string }[] => {
  return [
    { name: homeLabels[lang], url: localePath(lang, "") },
    ...items.map((item) => ({ name: item.label, url: item.href || "" })),
  ];
};
