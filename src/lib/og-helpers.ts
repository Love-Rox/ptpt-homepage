export interface OGParams {
  title: string;
  eyebrow: string;
  author: string;
}

export function extractParams(input: unknown): OGParams {
  let title = "patapata";
  let eyebrow = "@love-rox/ptpt-*";
  let author = "Love-Rox";
  if (input && typeof input === "object") {
    const i = input as {
      url?: string;
      searchParams?: URLSearchParams;
      query?: string | Record<string, unknown>;
    };
    let sp: URLSearchParams | null = null;
    if (typeof i.url === "string") {
      try {
        sp = new URL(i.url).searchParams;
      } catch {
        // fall through
      }
    }
    if (!sp && i.searchParams && typeof i.searchParams.get === "function") {
      sp = i.searchParams as URLSearchParams;
    }
    if (!sp && typeof i.query === "string") {
      sp = new URLSearchParams(i.query);
    }
    if (sp) {
      title = sp.get("title") ?? title;
      eyebrow = sp.get("eyebrow") ?? eyebrow;
      author = sp.get("author") ?? author;
    } else if (i.query && typeof i.query === "object") {
      const q = i.query as Record<string, unknown>;
      if (typeof q.title === "string") title = q.title;
      if (typeof q.eyebrow === "string") eyebrow = q.eyebrow;
      if (typeof q.author === "string") author = q.author;
    }
  }
  return { title, eyebrow, author };
}

export function pickTitleFontSize(title: string): number {
  const length = [...title].length;
  if (length <= 8) return 128;
  if (length <= 16) return 104;
  if (length <= 26) return 84;
  if (length <= 40) return 68;
  return 56;
}
