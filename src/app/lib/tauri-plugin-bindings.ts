/**
 * Kitchen-sink JS guest bindings for Tauri plugins registered in Rust
 * (`src-tauri/src/lib.rs`). Listed as a knip entry so `package.json`
 * dependencies stay marked used until a feature imports them from the UI.
 *
 * Prefer importing from the package (or a focused helper like `app-store.ts`)
 * at the call site when you actually use a plugin — do not import this file
 * from `main.tsx` just to “load” plugins.
 *
 * Already imported elsewhere in the app (not duplicated here):
 * `@tauri-apps/plugin-clipboard-manager`, `plugin-notification`, `plugin-os`,
 * `plugin-updater`.
 */

import '@tauri-apps/plugin-autostart';
import '@tauri-apps/plugin-cli';
import '@tauri-apps/plugin-deep-link';
import '@tauri-apps/plugin-dialog';
import '@tauri-apps/plugin-fs';
import '@tauri-apps/plugin-global-shortcut';
import '@tauri-apps/plugin-http';
import '@tauri-apps/plugin-log';
import '@tauri-apps/plugin-opener';
import '@tauri-apps/plugin-positioner';
import '@tauri-apps/plugin-process';
import '@tauri-apps/plugin-shell';
import '@tauri-apps/plugin-sql';
import '@tauri-apps/plugin-store';
import '@tauri-apps/plugin-stronghold';
import '@tauri-apps/plugin-upload';
import '@tauri-apps/plugin-websocket';
import '@tauri-apps/plugin-window-state';
