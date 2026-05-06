"use client";

import dynamic from "next/dynamic";

// Load only on client; the package requires DOM access.
const Agentation = dynamic(
  () => import("agentation").then((m) => m.Agentation),
  { ssr: false }
);

/**
 * Renders Agentation only in development.
 * Lets you click any element on the page and produce structured
 * feedback to paste into Claude Code / Cursor / Codex.
 */
export default function DevAgentation() {
  if (process.env.NODE_ENV !== "development") return null;
  return <Agentation />;
}
