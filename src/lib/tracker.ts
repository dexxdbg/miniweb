"use client";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ynwvgponhtotziietmeu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlud3ZncG9uaHRvdHppaWV0bWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4MDYwMDcsImV4cCI6MjA5NzM4MjAwN30.VIdNfMOqUc4F9kiQ40U1ExkeD2gfc36CTBBMqeLksIM"
);

function getSession() {
  let id = sessionStorage.getItem("sid");
  if (!id) {
    id = Math.random().toString(36).slice(2);
    sessionStorage.setItem("sid", id);
  }
  return id;
}

function track(event: string, data?: Record<string, unknown>) {
  const variant =
    document.cookie.match(/ab_variant=([^;]+)/)?.[1] ?? "unknown";
  supabase.from("analytics").insert({
    variant,
    session_id: getSession(),
    event,
    data: data ?? {},
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
