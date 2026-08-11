export type ConcreteTheme =
  | "nord-polar-night"
  | "nord-snow-storm"
  | "nord-frost"
  | "nord-aurora";

const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";

/**
 * Resolves a `settings.json` theme preference to a concrete, CSS-selectable
 * theme. Every value passes through unchanged except `"system"`, which maps
 * to the dark or light Nord base theme depending on the OS preference.
 */
export function resolveTheme(preference: string): string {
  if (preference !== "system") {
    return preference;
  }
  return isSystemDark() ? "nord-polar-night" : "nord-snow-storm";
}

export function isSystemDark(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) {
    return true;
  }
  return window.matchMedia(SYSTEM_DARK_QUERY).matches;
}

/**
 * Subscribes to OS light/dark preference changes. Returns an unsubscribe
 * function. Callers are responsible for checking whether the current theme
 * preference is `"system"` before reacting.
 */
export function watchSystemThemeChange(onChange: () => void): () => void {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }

  const mql = window.matchMedia(SYSTEM_DARK_QUERY);
  const listener = () => onChange();

  if (typeof mql.addEventListener === "function") {
    mql.addEventListener("change", listener);
    return () => mql.removeEventListener("change", listener);
  }

  // Safari < 14 fallback.
  mql.addListener(listener);
  return () => mql.removeListener(listener);
}
