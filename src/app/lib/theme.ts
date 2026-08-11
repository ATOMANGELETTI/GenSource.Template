export type ConcreteTheme =

  | "nord-polar-night"

  | "nord-snow-storm"

  | "nord-frost"

  | "nord-aurora";



const DEFAULT_THEME: ConcreteTheme = "nord-polar-night";



const THEME_ALIASES: Record<string, ConcreteTheme> = {

  "nord-polar-night": "nord-polar-night",

  "polar-night": "nord-polar-night",

  "nord-snow-storm": "nord-snow-storm",

  "snow-storm": "nord-snow-storm",

  "nord-frost": "nord-frost",

  frost: "nord-frost",

  "nord-aurora": "nord-aurora",

  aurora: "nord-aurora",

};



const SYSTEM_DARK_QUERY = "(prefers-color-scheme: dark)";



/**

 * Resolves a `settings.json` theme preference to a concrete, CSS-selectable

 * theme id. Accepts both full ids (`nord-frost`) and short Nord palette

 * aliases (`frost` / `aurora`). `"system"` follows the OS light/dark

 * preference. Unknown values fall back to Polar Night.

 */

export function resolveTheme(preference: string): ConcreteTheme {

  const key = preference.trim().toLowerCase();



  if (key === "system") {

    return isSystemDark() ? "nord-polar-night" : "nord-snow-storm";

  }



  return THEME_ALIASES[key] ?? DEFAULT_THEME;

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


