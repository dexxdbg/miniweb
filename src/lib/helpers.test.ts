import { describe, it, expect } from "vitest";
import { pad, buildHash, fmt } from "./helpers";

describe("pad", () => {
  it("pads single digits with a leading zero", () => {
    expect(pad(0)).toBe("00");
    expect(pad(5)).toBe("05");
    expect(pad(9)).toBe("09");
  });

  it("leaves two-digit numbers unchanged", () => {
    expect(pad(10)).toBe("10");
    expect(pad(59)).toBe("59");
  });

  it("keeps numbers longer than two digits as-is", () => {
    expect(pad(100)).toBe("100");
  });
});

describe("buildHash", () => {
  it("returns a 3-character zero-padded string", () => {
    const h = buildHash("hello");
    expect(h).toMatch(/^\d{3}$/);
  });

  it("is deterministic for the same input", () => {
    expect(buildHash("@dexxdbg")).toBe(buildHash("@dexxdbg"));
  });

  it("pads short hashes with leading zeros", () => {
    // single char 'a' (97 % 999 = 97) → "097"
    expect(buildHash("a")).toBe("097");
  });

  it("returns '000' for an empty string", () => {
    expect(buildHash("")).toBe("000");
  });
});

describe("fmt", () => {
  it("formats 0 seconds as 0:00", () => {
    expect(fmt(0)).toBe("0:00");
  });

  it("formats seconds < 60 correctly", () => {
    expect(fmt(5)).toBe("0:05");
    expect(fmt(30)).toBe("0:30");
    expect(fmt(59)).toBe("0:59");
  });

  it("formats minutes and seconds", () => {
    expect(fmt(60)).toBe("1:00");
    expect(fmt(90)).toBe("1:30");
    expect(fmt(125)).toBe("2:05");
  });

  it("floors fractional seconds", () => {
    expect(fmt(1.7)).toBe("0:01");
    expect(fmt(61.9)).toBe("1:01");
  });

  it("clamps negative values to 0:00", () => {
    expect(fmt(-5)).toBe("0:00");
    expect(fmt(-100)).toBe("0:00");
  });

  it("clamps NaN and Infinity to 0:00", () => {
    expect(fmt(NaN)).toBe("0:00");
    expect(fmt(Infinity)).toBe("0:00");
    expect(fmt(-Infinity)).toBe("0:00");
  });
});
