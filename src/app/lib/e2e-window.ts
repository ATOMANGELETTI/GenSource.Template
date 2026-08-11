import { getCurrentWindow } from "@tauri-apps/api/window";

export type AppWindowLabel = "main" | "splash" | "tray-menu";

const KNOWN_LABELS = new Set<string>(["main", "splash", "tray-menu"]);

/**
 * Playwright / Vite harness: `?window=splash|tray-menu|main` selects the
 * secondary-window tree without requiring a live Tauri WebView.
 */
export function readWindowQueryParam(
  search = typeof window !== "undefined" ? window.location.search : "",
): AppWindowLabel | null {
  const value = new URLSearchParams(search).get("window");
  if (value && KNOWN_LABELS.has(value)) {
    return value as AppWindowLabel;
  }
  return null;
}

/** `?e2e=1` freezes splash animation and enables other deterministic fixtures. */
export function isE2eMode(
  search = typeof window !== "undefined" ? window.location.search : "",
): boolean {
  const value = new URLSearchParams(search).get("e2e");
  return value === "1" || value === "true";
}

/**
 * Resolve which React tree to mount: query override → Tauri label → main.
 * Never throws in a plain browser (required for Vite Playwright).
 */
export function resolveWindowLabel(): AppWindowLabel {
  const fromQuery = readWindowQueryParam();
  if (fromQuery) {
    return fromQuery;
  }

  try {
    const label = getCurrentWindow().label;
    if (KNOWN_LABELS.has(label)) {
      return label as AppWindowLabel;
    }
  } catch {
    // Not running inside Tauri (Vite e2e / plain browser).
  }

  return "main";
}
