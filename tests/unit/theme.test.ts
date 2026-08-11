import { afterEach, describe, expect, it, vi } from "vitest";

import { resolveTheme } from "@/lib/theme";

function mockPrefersColorScheme(dark: boolean): void {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: dark && query.includes("prefers-color-scheme: dark"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("resolveTheme", () => {
  it("keeps concrete nord-* theme ids", () => {
    expect(resolveTheme("nord-polar-night")).toBe("nord-polar-night");
    expect(resolveTheme("nord-snow-storm")).toBe("nord-snow-storm");
    expect(resolveTheme("nord-frost")).toBe("nord-frost");
    expect(resolveTheme("nord-aurora")).toBe("nord-aurora");
  });

  it("normalizes short Nord palette aliases to concrete theme ids", () => {
    expect(resolveTheme("polar-night")).toBe("nord-polar-night");
    expect(resolveTheme("snow-storm")).toBe("nord-snow-storm");
    expect(resolveTheme("frost")).toBe("nord-frost");
    expect(resolveTheme("aurora")).toBe("nord-aurora");
  });

  it("falls back to nord-polar-night for unrecognized values", () => {
    expect(resolveTheme("not-a-theme")).toBe("nord-polar-night");
    expect(resolveTheme("")).toBe("nord-polar-night");
  });

  it('maps "system" to polar-night when OS prefers dark', () => {
    mockPrefersColorScheme(true);
    expect(resolveTheme("system")).toBe("nord-polar-night");
  });

  it('maps "system" to snow-storm when OS prefers light', () => {
    mockPrefersColorScheme(false);
    expect(resolveTheme("system")).toBe("nord-snow-storm");
  });
});
