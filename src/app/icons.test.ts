import { describe, it, expect } from "vitest";
import { isIconKey, Icons } from "./icons";

describe("isIconKey", () => {
  it("returns true for every key in the Icons record", () => {
    for (const key of Object.keys(Icons)) {
      expect(isIconKey(key)).toBe(true);
    }
  });

  it("returns false for unknown strings", () => {
    expect(isIconKey("nonexistent")).toBe(false);
    expect(isIconKey("")).toBe(false);
    expect(isIconKey("Github")).toBe(false); // case-sensitive
  });

  it("returns false for non-string values", () => {
    expect(isIconKey(null)).toBe(false);
    expect(isIconKey(undefined)).toBe(false);
    expect(isIconKey(42)).toBe(false);
    expect(isIconKey({})).toBe(false);
  });
});

describe("Icons record", () => {
  it("contains the expected built-in icon keys", () => {
    const expected = [
      "git", "github", "x", "instagram", "youtube",
      "discord", "mail", "globe", "twitch", "spotify",
      "linkedin", "telegram", "tiktok", "code", "link",
      "rss", "kemono",
    ];
    for (const key of expected) {
      expect(Icons).toHaveProperty(key);
      expect(typeof Icons[key as keyof typeof Icons]).toBe("function");
    }
  });
});
