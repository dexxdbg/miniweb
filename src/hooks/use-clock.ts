"use client";

import { useEffect, useState } from "react";
import { pad } from "@/lib/utils";

/**
 * Ticking HH:MM:SS clock string, updated every second.
 * Returns "--:--:--" until the first client-side tick.
 */
export function useClock() {
  const [time, setTime] = useState("--:--:--");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const d = new Date();
      setTime(
        `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return { time, mounted };
}
