import { localePath, type Locale } from "@/lib/locale";

interface MetaProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  lang?: Locale;
}

const SITE_ORIGIN = "https://ptpt.love-rox.cc";
const SITE_NAME = "patapata";

// en-default URL strategy: en URL has no /ja prefix; ja URL is /ja/...
// Strip the /ja prefix to get the canonical (en) suffix used in alternates.
function suffixFrom(url: string): string {
  if (url === "/" || url === "") return "";
  if (url === "/ja") return "";
  if (url.startsWith("/ja/")) return url.slice(4);
  return url.replace(/^\//, "");
}

export const Meta = ({ title, description, image, url, lang = "en" }: MetaProps) => {
  const ogImage = image || "/images/favicon.png";
  const absoluteOgImage = ogImage.startsWith("http") ? ogImage : `${SITE_ORIGIN}${ogImage}`;
  const absoluteUrl = url ? (url.startsWith("http") ? url : `${SITE_ORIGIN}${url}`) : undefined;

  const suffix = url ? suffixFrom(url) : null;

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index, follow" />
      {absoluteUrl && <link rel="canonical" href={absoluteUrl} />}

      {suffix !== null && (
        <>
          <link rel="alternate" hrefLang="en" href={`${SITE_ORIGIN}${localePath("en", suffix)}`} />
          <link rel="alternate" hrefLang="ja" href={`${SITE_ORIGIN}${localePath("ja", suffix)}`} />
          <link
            rel="alternate"
            hrefLang="x-default"
            href={`${SITE_ORIGIN}${localePath("en", suffix)}`}
          />
        </>
      )}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absoluteOgImage} />
      <meta property="og:locale" content={lang === "ja" ? "ja_JP" : "en_US"} />
      {absoluteUrl && <meta property="og:url" content={absoluteUrl} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absoluteOgImage} />
    </>
  );
};
