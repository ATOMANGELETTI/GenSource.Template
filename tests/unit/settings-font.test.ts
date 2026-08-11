import { describe, expect, it } from "vitest";

import { FONT_FAMILY_MAP, resolveFontFamily } from "@/lib/settings";

describe("resolveFontFamily", () => {
  it("maps known faces", () => {
    expect(resolveFontFamily("Terminus")).toBe(FONT_FAMILY_MAP.Terminus);
    expect(resolveFontFamily("Ubuntu")).toBe(FONT_FAMILY_MAP.Ubuntu);
    expect(resolveFontFamily("Fira Code")).toBe(FONT_FAMILY_MAP["Fira Code"]);
    expect(resolveFontFamily("Plus Jakarta Sans")).toBe(
      FONT_FAMILY_MAP["Plus Jakarta Sans"],
    );
  });

  it("falls back to Terminus for empty values", () => {
    expect(resolveFontFamily("")).toBe(FONT_FAMILY_MAP.Terminus);
    expect(resolveFontFamily("   ")).toBe(FONT_FAMILY_MAP.Terminus);
  });

  it("keeps custom names with Terminus as ultimate fallback", () => {
    expect(resolveFontFamily("Comic Sans")).toBe(
      '"Comic Sans", Terminus, ui-monospace, monospace',
    );
  });
});
