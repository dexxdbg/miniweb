import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/* ------------------------------------------------------------------ */
/*  Mock supabase before importing the module under test               */
/* ------------------------------------------------------------------ */
const insertMock = vi.fn();
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({ insert: insertMock }),
  }),
}));

/* ------------------------------------------------------------------ */
/*  Browser globals stubs                                              */
/* ------------------------------------------------------------------ */
function stubBrowserGlobals() {
  // sessionStorage
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, "sessionStorage", {
    value: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
      removeItem: (k: string) => store.delete(k),
      clear: () => store.clear(),
    },
    writable: true,
    configurable: true,
  });

  // document.cookie
  Object.defineProperty(document, "cookie", {
    value: "",
    writable: true,
    configurable: true,
  });

  // document.referrer
  Object.defineProperty(document, "referrer", {
    value: "https://example.com",
    writable: true,
    configurable: true,
  });

  // screen
  Object.defineProperty(globalThis, "screen", {
    value: { width: 1920, height: 1080 },
    writable: true,
    configurable: true,
  });

  // navigator.userAgent
  Object.defineProperty(navigator, "userAgent", {
    value: "test-agent",
    writable: true,
    configurable: true,
  });

  // location
  Object.defineProperty(globalThis, "location", {
    value: { href: "http://localhost:3000/" },
    writable: true,
    configurable: true,
  });
}

describe("tracker", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    stubBrowserGlobals();
    insertMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("fires a session_start event on init", async () => {
    const { initTracker } = await import("./tracker");
    initTracker();

    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({
        event: "session_start",
        data: expect.objectContaining({
          url: "http://localhost:3000/",
          screen: "1920x1080",
          ua: "test-agent",
        }),
      })
    );
  });

  it("generates a session id and persists it in sessionStorage", async () => {
    const { initTracker } = await import("./tracker");
    initTracker();

    const sid = sessionStorage.getItem("sid");
    expect(sid).toBeTruthy();
    expect(typeof sid).toBe("string");
  });

  it("records mouse position on the sampling interval", async () => {
    const { initTracker } = await import("./tracker");
    initTracker();

    // simulate a mousemove
    const moveEvent = new MouseEvent("mousemove", {
      clientX: 100,
      clientY: 200,
    });
    window.dispatchEvent(moveEvent);

    // initial call count (session_start)
    const beforeCount = insertMock.mock.calls.length;

    // advance the 2s mouse-position interval
    vi.advanceTimersByTime(2000);

    expect(insertMock.mock.calls.length).toBeGreaterThan(beforeCount);
    const lastCall = insertMock.mock.calls[insertMock.mock.calls.length - 1][0];
    expect(lastCall.event).toBe("mouse_pos");
    expect(lastCall.data).toEqual(
      expect.objectContaining({ x: 100, y: 200 })
    );
  });

  it("records click events with element info", async () => {
    const { initTracker } = await import("./tracker");
    initTracker();

    const beforeCount = insertMock.mock.calls.length;

    const clickEvent = new MouseEvent("click", {
      clientX: 50,
      clientY: 60,
      bubbles: true,
    });
    Object.defineProperty(clickEvent, "target", {
      value: Object.assign(document.createElement("a"), {
        textContent: "Click me",
        href: "https://example.com/link",
      }),
    });
    window.dispatchEvent(clickEvent);

    expect(insertMock.mock.calls.length).toBeGreaterThan(beforeCount);
    const lastCall = insertMock.mock.calls[insertMock.mock.calls.length - 1][0];
    expect(lastCall.event).toBe("click");
    expect(lastCall.data).toEqual(
      expect.objectContaining({ x: 50, y: 60, tag: "A" })
    );
  });

  it("reads ab_variant from cookies", async () => {
    document.cookie = "ab_variant=v2; other=xyz";
    const { initTracker } = await import("./tracker");
    initTracker();

    const call = insertMock.mock.calls.find(
      (c: unknown[]) => (c[0] as { event: string }).event === "session_start"
    );
    expect(call).toBeDefined();
    expect(call![0].variant).toBe("v2");
  });
});
