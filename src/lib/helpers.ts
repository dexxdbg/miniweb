/** Zero-pad a number to two digits. */
export function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Deterministic 3-digit hash from a string (sum of char codes mod 999). */
export function buildHash(s: string) {
  return Math.abs(
    [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 999
  )
    .toString()
    .padStart(3, "0");
}

/** Format seconds as m:ss for the audio player. */
export function fmt(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const r = Math.floor(s % 60);
  return `${m}:${r.toString().padStart(2, "0")}`;
}
