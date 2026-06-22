// @ts-check
/**
 * Resolves entries from src/app/music.list.ts using the iTunes Search API
 * and writes results to src/app/music.generated.json.
 *
 * Run with: npm run music:sync
 */
import { writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const listPath = resolve(root, "src/app/music.list.ts");
const outPath = resolve(root, "src/app/music.generated.json");

/** @param {string} q */
async function search(q) {
  const u = new URL("https://itunes.apple.com/search");
  u.searchParams.set("term", q);
  u.searchParams.set("entity", "song");
  u.searchParams.set("limit", "1");
  u.searchParams.set("media", "music");
  const res = await fetch(u, { headers: { "user-agent": "miniweb-music-sync" } });
  if (!res.ok) throw new Error(`iTunes ${res.status} for "${q}"`);
  const data = await res.json();
  return data.results?.[0] ?? null;
}

/** @param {string} url */
function upscaleArtwork(url) {
  // iTunes returns 100x100 by default; ask for 600x600.
  return url.replace(/\/\d+x\d+(bb)?\.(jpg|png)$/i, "/600x600bb.$2");
}

async function loadQueries() {
  // dynamic import of TS via tsx/loader fallback: read the file as text and eval the array.
  // simplest: dynamic import with the typescript loader if present, else parse manually.
  try {
    const mod = await import(pathToFileURL(listPath).href);
    return mod.musicQueries ?? [];
  } catch {
    // fallback: read file, strip TS types, and parse with JSON
    const { readFile } = await import("node:fs/promises");
    const src = await readFile(listPath, "utf8");
    const m = src.match(/musicQueries\s*:\s*MusicQuery\[\]\s*=\s*(\[[\s\S]*?\]);/);
    if (!m) throw new Error("Could not parse music.list.ts");
    // Convert JS object literal to JSON: quote unquoted keys, trailing commas
    let raw = m[1];
    raw = raw.replace(/\/\/[^\n]*/g, "");              // strip line comments
    raw = raw.replace(/\/\*[\s\S]*?\*\//g, "");        // strip block comments
    raw = raw.replace(/(\w+)\s*:/g, '"$1":');           // quote unquoted keys
    raw = raw.replace(/'/g, '"');                       // single → double quotes
    raw = raw.replace(/,\s*([\]}])/g, "$1");            // strip trailing commas
    return JSON.parse(raw);
  }
}

async function main() {
  const queries = await loadQueries();
  /** @type {any[]} */
  const tracks = [];
  for (const entry of queries) {
    const q = typeof entry === "string" ? entry : entry.query;
    const meta = typeof entry === "string" ? {} : entry;
    process.stdout.write(`→ ${q} ... `);
    try {
      const r = await search(q);
      if (!r) {
        console.log("no result");
        continue;
      }
      tracks.push({
        title: r.trackName,
        artist: r.artistName,
        cover: r.artworkUrl100 ? upscaleArtwork(r.artworkUrl100) : "",
        audio: meta.file ?? r.previewUrl ?? "",
        url:
          meta.url ??
          `https://www.youtube.com/results?search_query=${encodeURIComponent(
            `${r.artistName} ${r.trackName}`
          )}`,
        tag: meta.tag,
        featured: meta.featured,
      });
      console.log(`ok  (${r.trackName} — ${r.artistName})`);
    } catch (e) {
      console.log(`fail (${e instanceof Error ? e.message : String(e)})`);
    }
  }
  await writeFile(outPath, JSON.stringify({ tracks }, null, 2) + "\n", "utf8");
  console.log(`\nwrote ${tracks.length} track(s) → ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
