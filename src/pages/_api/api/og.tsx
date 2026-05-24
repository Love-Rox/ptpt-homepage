import { ImageResponse } from "workers-og";
import { env } from "cloudflare:workers";
import minchoUrl from "../../../../public/assets/fonts/shippori-mincho-b1-japanese-700-normal.woff?url";
import monoUrl from "../../../../public/assets/fonts/jetbrains-mono-latin-500-normal.woff?url";
import { extractParams, pickTitleFontSize } from "@/lib/og-helpers";

export const getConfig = async () => {
  return { render: "dynamic" };
};

// Departure-board OG card. Bone glyphs on a near-black housing, lit by a single
// amber signal. Mincho carries the title; Mono carries the board chrome. Echoes
// the site identity (amber signal edge, hairline rules, split-flap seal).

const PALETTE = {
  ground: "#0d0e11",
  groundDeep: "#07080a",
  ink: "#f0e8d0",
  inkMute: "#9b958a",
  inkSoft: "#6a655c",
  shu: "#f2b134",
  shuDeep: "#e09a23",
};

let minchoFont: ArrayBuffer | null = null;
let monoFont: ArrayBuffer | null = null;

async function fetchAsset(path: string): Promise<Response> {
  return env.ASSETS.fetch(new Request(`https://assets.local${path}`));
}

async function loadFont(url: string): Promise<ArrayBuffer> {
  const res = await fetchAsset(url);
  if (!res.ok) throw new Error(`Failed to load font ${url}: ${res.status}`);
  return res.arrayBuffer();
}

export default async function OGImage(input: unknown) {
  const { title, eyebrow, author } = extractParams(input);
  const [mincho, mono] = await Promise.all([
    minchoFont ?? (minchoFont = await loadFont(minchoUrl)),
    monoFont ?? (monoFont = await loadFont(monoUrl)),
  ]);
  const titleFontSize = pickTitleFontSize(title);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: PALETTE.ground,
        // Faint flap-board grain
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(240, 232, 208, 0.05) 1px, transparent 0)",
        backgroundSize: "6px 6px",
        fontFamily: '"Shippori Mincho B1", "JetBrains Mono"',
        color: PALETTE.ink,
      }}
    >
      {/* Right spine stripe — the same shu strip from the live site */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: 18,
          display: "flex",
          backgroundColor: PALETTE.shu,
        }}
      />

      {/* Top hairline rule, full width */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          right: 60,
          height: 1,
          display: "flex",
          backgroundColor: "rgba(240,232,208,0.16)",
        }}
      />

      {/* Bottom hairline rule, full width */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 80,
          right: 60,
          height: 1,
          display: "flex",
          backgroundColor: "rgba(240,232,208,0.16)",
        }}
      />

      {/* Wordmark line in the top margin: パタパタ / patapata */}
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 80,
          display: "flex",
          alignItems: "baseline",
        }}
      >
        <span
          style={{
            display: "flex",
            fontSize: 22,
            fontFamily: '"Shippori Mincho B1"',
            fontWeight: 700,
            color: PALETTE.ink,
          }}
        >
          パタパタ
        </span>
        <span
          style={{
            display: "flex",
            width: 1,
            height: 18,
            backgroundColor: PALETTE.shu,
            margin: "0 14px",
          }}
        />
        <span
          style={{
            display: "flex",
            fontSize: 14,
            fontFamily: '"JetBrains Mono"',
            color: PALETTE.inkMute,
            letterSpacing: "0.18em",
          }}
        >
          patapata
        </span>
      </div>

      {/* Top-right metadata: ptpt.love-rox.cc · MMXXVI */}
      <div
        style={{
          position: "absolute",
          top: 32,
          right: 60,
          display: "flex",
          alignItems: "center",
          fontSize: 12,
          fontFamily: '"JetBrains Mono"',
          color: PALETTE.inkSoft,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
        }}
      >
        <span style={{ display: "flex" }}>ptpt.love-rox.cc</span>
        <span style={{ display: "flex", margin: "0 12px", color: PALETTE.shu }}>·</span>
        <span style={{ display: "flex" }}>MMXXVI</span>
      </div>

      {/* Body — eyebrow + title block */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 100,
          top: 200,
          bottom: 160,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {/* Eyebrow with shu rule prefix */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 36,
              height: 1,
              backgroundColor: PALETTE.shu,
              marginRight: 18,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 16,
              fontFamily: '"JetBrains Mono"',
              color: PALETTE.shuDeep,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            {eyebrow}
          </div>
        </div>

        {/* Title — Mincho display */}
        <div
          style={{
            display: "flex",
            fontSize: titleFontSize,
            lineHeight: 1.1,
            fontFamily: '"Shippori Mincho B1"',
            fontWeight: 700,
            color: PALETTE.ink,
            letterSpacing: "0.01em",
            maxWidth: 980,
          }}
        >
          {title}
        </div>
      </div>

      {/* Bottom strip: author on the left, seal on the right */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 100,
          bottom: 30,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 11,
              fontFamily: '"JetBrains Mono"',
              color: PALETTE.inkSoft,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 500,
              marginBottom: 6,
            }}
          >
            Published
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              fontFamily: '"Shippori Mincho B1"',
              color: PALETTE.ink,
              fontWeight: 700,
            }}
          >
            {author}
          </div>
        </div>

        {/* patapata seal — a single split-flap cell showing "P", split by its
            flap seam, echoing the favicon and the live board. */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 56,
            height: 56,
            backgroundColor: "#1a1d23",
            border: `1.5px solid ${PALETTE.shu}`,
          }}
        >
          <span
            style={{
              display: "flex",
              fontFamily: '"JetBrains Mono"',
              fontWeight: 500,
              fontSize: 30,
              color: PALETTE.ink,
            }}
          >
            P
          </span>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 27,
              height: 1.5,
              display: "flex",
              backgroundColor: "#0d0e11",
            }}
          />
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Shippori Mincho B1", data: mincho, weight: 700, style: "normal" },
        { name: "JetBrains Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
