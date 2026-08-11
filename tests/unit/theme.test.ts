import { describe, expect, it } from "vitest";

import { resolveTheme } from "@/lib/theme";

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

  it('maps "system" to polar-night or snow-storm from OS preference', () => {
    const dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    expect(resolveTheme("system")).toBe(
      dark ? "nord-polar-night" : "nord-snow-storm",
    );
  });
});
