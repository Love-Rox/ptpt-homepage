"use client";

import { useEffect, useState } from "react";

/**
 * A live terminal clock — HH:MM:SS in mono, like the master clock above a
 * departures board. Renders a stable placeholder until mounted so the server
 * and client markup agree (no hydration mismatch).
 */
export function StationClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const tick = () => {
      const d = new Date();
      setTime(`${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      className={`font-mono ${className}`}
      style={{ fontVariantNumeric: "tabular-nums", letterSpacing: "0.06em" }}
      aria-hidden="true"
    >
      {time ?? "--:--:--"}
    </span>
  );
}
