import { invoke } from "@tauri-apps/api/core";
import { listen, type UnlistenFn } from "@tauri-apps/api/event";

import type { AppInfo, AppSettings } from "../types";
import { resolveTheme, watchSystemThemeChange } from "./theme";

const SETTINGS_CHANGED_EVENT = "settings-changed";

// Tracks the last-applied settings so the system-theme watcher (registered
// once, for the lifetime of the window) can re-resolve without a stale
// closure whenever the OS light/dark preference flips.
let latestSettings: AppSettings | undefined;
let systemThemeWatcherStarted = false;

const FONT_FAMILY_MAP: Record<string, string> = {
  "Plus Jakarta Sans":
    '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  "Fira Code": '"Fira Code", "Fira Mono", ui-monospace, monospace',
  Ubuntu: 'Ubuntu, "Ubuntu Sans", ui-sans-serif, system-ui, sans-serif',
  Terminus: 'Terminus, "Terminus (TTF)", ui-monospace, monospace',
};

export function applySettingsToDom(settings: AppSettings): void {
  latestSettings = settings;
  ensureSystemThemeWatcher();

  const root = document.documentElement;
  root.dataset.theme = resolveTheme(settings.theme || "nord-polar-night");
  root.style.setProperty(
    "--font-sans",
    resolveFontFamily(settings.fontFamily),
  );
  const size =
    Number.isFinite(settings.fontSize) && settings.fontSize > 0
      ? settings.fontSize
      : 14;
  root.style.fontSize = `${size}px`;
}

// Registered once per window; reacts to OS light/dark flips by re-resolving
// the theme, but only takes effect while the user's preference is "system".
function ensureSystemThemeWatcher(): void {
  if (systemThemeWatcherStarted) {
    return;
  }
  systemThemeWatcherStarted = true;

  watchSystemThemeChange(() => {
    if (latestSettings?.theme === "system") {
      document.documentElement.dataset.theme = resolveTheme("system");
    }
  });
}

function resolveFontFamily(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    return FONT_FAMILY_MAP["Plus Jakarta Sans"];
  }
  return (
    FONT_FAMILY_MAP[trimmed] ??
    `"${trimmed}", "Plus Jakarta Sans Variable", "Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif`
  );
}

export async function fetchSettings(): Promise<AppSettings> {
  return invoke<AppSettings>("get_settings");
}

export async function fetchAppInfo(): Promise<AppInfo> {
  return invoke<AppInfo>("get_app_info");
}

export async function initSettingsFromBackend(): Promise<AppSettings> {
  const settings = await fetchSettings();
  applySettingsToDom(settings);
  return settings;
}

export async function subscribeSettingsChanges(
  onChange?: (settings: AppSettings) => void,
): Promise<UnlistenFn> {
  return listen<AppSettings>(SETTINGS_CHANGED_EVENT, (event) => {
    applySettingsToDom(event.payload);
    onChange?.(event.payload);
  });
}
