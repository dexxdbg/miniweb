"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

let supabase: SupabaseClient | null = null;
function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;
  if (!supabase) supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return supabase;
}

function getSession() {
  let id = sessionStorage.getItem("sid");
  if (!id) {
    id = Math.random().toString(36).slice(2);
    sessionStorage.setItem("sid", id);
  }
  return id;
}

function sanitize(value: unknown, maxLen = 200): unknown {
  if (typeof value === "string") return value.slice(0, maxLen);
  if (typeof value === "number" || typeof value === "boolean" || value === null)
    return value;
  return undefined;
}

function sanitizeRecord(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    const clean = sanitize(v);
    if (clean !== undefined) out[k] = clean;
  }
  return out;
}

function track(event: string, data?: Record<string, unknown>) {
  const client = getSupabase();
  if (!client) return;
  const variant =
    document.cookie.match(/ab_variant=([^;]+)/)?.[1] ?? "unknown";
  client.from("analytics").insert({
    variant: sanitize(variant),
    session_id: getSession(),
    event: sanitize(event, 50),
    data: data ? sanitizeRecord(data) : {},
  });
}

export function initTracker() {
  // session start + referrer
  track("session_start", {
    referrer: document.referrer || null,
    url: location.href,
    screen: `${screen.width}x${screen.height}`,
    ua: navigator.userAgent,
  });

  // time on site
  const start = Date.now();
  window.addEventListener("beforeunload", () => {
    track("session_end", { duration_s: Math.round((Date.now() - start) / 1000) });
  });

  // mouse movement heatmap (sampled every 2s)
  let lastMove = { x: 0, y: 0 };
  window.addEventListener("mousemove", (e) => {
    lastMove = { x: e.clientX, y: e.clientY };
  });
  setInterval(() => {
    if (lastMove.x || lastMove.y)
      track("mouse_pos", { ...lastMove, w: window.innerWidth, h: window.innerHeight });
  }, 2000);

  // clicks
  window.addEventListener("click", (e) => {
    const el = e.target as HTMLElement;
    track("click", {
      x: e.clientX,
      y: e.clientY,
      tag: el.tagName,
      text: el.textContent?.trim().slice(0, 60) || null,
      href: (el as HTMLAnchorElement).href || null,
    });
  });

  // scroll depth
  let maxScroll = 0;
  window.addEventListener("scroll", () => {
    const pct = Math.round(
      (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
    );
    if (pct > maxScroll) maxScroll = pct;
  });
  setInterval(() => {
    if (maxScroll > 0) track("scroll_depth", { pct: maxScroll });
  }, 5000);
}
