import { describe, it, expect, vi, beforeEach } from "vitest";
import { proxy, config } from "./proxy";

/* ------------------------------------------------------------------ */
/*  Lightweight mocks for next/server (NextRequest / NextResponse)    */
/* ------------------------------------------------------------------ */

function makeCookieJar(init: Record<string, string> = {}) {
  const store = new Map(Object.entries(init));
  return {
    get(name: string) {
      const v = store.get(name);
      return v !== undefined ? { name, value: v } : undefined;
    },
    set(name: string, value: string, _opts?: Record<string, unknown>) {
      store.set(name, value);
    },
    _store: store,
  };
}

function fakeRequest(
  path: string,
  cookies: Record<string, string> = {}
): Parameters<typeof proxy>[0] {
  const url = new URL(`http://localhost:3000${path}`);
  return {
    nextUrl: url,
    url: url.toString(),
    cookies: makeCookieJar(cookies),
  } as unknown as Parameters<typeof proxy>[0];
}

/* ------------------------------------------------------------------ */
/*  Mock NextResponse statics                                         */
/* ------------------------------------------------------------------ */
vi.mock("next/server", () => {
  const cookieJar = () => makeCookieJar();
  return {
    NextResponse: {
      next: () => ({ _type: "next", cookies: cookieJar() }),
      rewrite: (url: URL) => ({ _type: "rewrite", url, cookies: cookieJar() }),
    },
  };
});

/* ------------------------------------------------------------------ */

describe("proxy (A/B middleware)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("passes through non-root paths unchanged", () => {
    const res = proxy(fakeRequest("/about")) as { _type: string };
    expect(res._type).toBe("next");
  });

  it("assigns variant=main when Math.random >= 0.3", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    const res = proxy(fakeRequest("/")) as { _type: string; cookies: ReturnType<typeof makeCookieJar> };
    expect(res._type).toBe("next");
    expect(res.cookies.get("ab_variant")?.value).toBe("main");
  });

  it("assigns variant=v2 and rewrites when Math.random < 0.3", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.1);
    const res = proxy(fakeRequest("/")) as { _type: string; url: URL; cookies: ReturnType<typeof makeCookieJar> };
    expect(res._type).toBe("rewrite");
    expect(res.url.pathname).toBe("/v2");
    expect(res.cookies.get("ab_variant")?.value).toBe("v2");
  });

  it("respects an existing v2 cookie without setting a new one", () => {
    const res = proxy(fakeRequest("/", { ab_variant: "v2" })) as {
      _type: string;
      url: URL;
      cookies: ReturnType<typeof makeCookieJar>;
    };
    expect(res._type).toBe("rewrite");
    // no new cookie set on the response
    expect(res.cookies.get("ab_variant")).toBeUndefined();
  });

  it("respects an existing main cookie without setting a new one", () => {
    const res = proxy(fakeRequest("/", { ab_variant: "main" })) as {
      _type: string;
      cookies: ReturnType<typeof makeCookieJar>;
    };
    expect(res._type).toBe("next");
    expect(res.cookies.get("ab_variant")).toBeUndefined();
  });

  it("exports a matcher config for the root path", () => {
    expect(config.matcher).toBe("/");
  });
});
