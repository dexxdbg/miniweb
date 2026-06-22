import { describe, it, expect } from "vitest";

// The script doesn't export functions, so we replicate the pure logic to test.
// upscaleArtwork is a self-contained function from sync-music.mjs.

function upscaleArtwork(url) {
  return url.replace(/\/\d+x\d+(bb)?\.(jpg|png)$/i, "/600x600bb.$2");
}

describe("upscaleArtwork", () => {
  it("replaces 100x100 jpg with 600x600bb", () => {
    const input =
      "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/ab/cd/ef/100x100bb.jpg";
    expect(upscaleArtwork(input)).toBe(
      "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/ab/cd/ef/600x600bb.jpg"
    );
  });

  it("replaces 100x100 png with 600x600bb", () => {
    const input =
      "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/ab/cd/ef/100x100bb.png";
    expect(upscaleArtwork(input)).toBe(
      "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/ab/cd/ef/600x600bb.png"
    );
  });

  it("handles dimensions without the bb suffix", () => {
    const input =
      "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/ab/cd/ef/200x200.jpg";
    expect(upscaleArtwork(input)).toBe(
      "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/ab/cd/ef/600x600bb.jpg"
    );
  });

  it("leaves URLs without artwork dimensions unchanged", () => {
    const input = "https://example.com/image.jpg";
    expect(upscaleArtwork(input)).toBe(input);
  });
});

// Test the query normalisation logic from main()
describe("query normalisation", () => {
  it("extracts query string from a plain string entry", () => {
    const entry = "sewerslvt MAKE-ME-SAD";
    const q = typeof entry === "string" ? entry : entry.query;
    expect(q).toBe("sewerslvt MAKE-ME-SAD");
  });

  it("extracts query from an object entry", () => {
    const entry = { query: "some track", tag: "ep", featured: true };
    const q = typeof entry === "string" ? entry : entry.query;
    expect(q).toBe("some track");
  });

  it("extracts meta fields from an object entry", () => {
    const entry = { query: "test", tag: "single", featured: false, url: "https://example.com", file: "/audio/test.mp3" };
    const meta = typeof entry === "string" ? {} : entry;
    expect(meta.tag).toBe("single");
    expect(meta.featured).toBe(false);
    expect(meta.url).toBe("https://example.com");
    expect(meta.file).toBe("/audio/test.mp3");
  });

  it("returns empty meta for string entries", () => {
    const entry = "plain string";
    const meta = typeof entry === "string" ? {} : entry;
    expect(meta).toEqual({});
  });
});
