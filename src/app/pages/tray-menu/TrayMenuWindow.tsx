import { invoke } from "@tauri-apps/api/core";
import { check } from "@tauri-apps/plugin-updater";
import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
import { useEffect, useState } from "react";

import {
  CheckUpdatesIcon,
  HideIcon,
  PreferencesIcon,
  QuitIcon,
} from "../../components/icons/MenuIcons";
import { fetchAppInfo } from "../../lib/settings";
import { useKeybindingLabels } from "../../lib/keybindings";
import type { AppInfo } from "../../types";

/**
 * Standalone root rendered in the dedicated `tray-menu` Tauri window (see
 * tauri.conf.json + lib.rs `on_tray_icon_event`). Not an overlay inside the
 * main window — this window is transparent/undecorated and gets positioned
 * above the system tray icon on right-click.
 */
export default function TrayMenuWindow() {
  const { label } = useKeybindingLabels();
  const [info, setInfo] = useState<AppInfo | null>(null);

  useEffect(() => {
    void fetchAppInfo().then(setInfo);
  }, []);

  const productName = info?.productName ?? info?.name ?? "GenSource Template";

  const run = (action: () => void | Promise<void>) => () => {
    void action();
  };

  const notify = async (body: string) => {
    let granted = await isPermissionGranted();
    if (!granted) {
      granted = (await requestPermission()) === "granted";
    }
    if (granted) {
      sendNotification({ title: productName, body });
    }
  };

  const checkForUpdates = async () => {
    try {
      const update = await check();
      if (update?.available) {
        await notify(`Update ${update.version} is available.`);
      } else {
        await notify("You're on the latest version.");
      }
    } catch (error) {
      console.warn("Update check failed", error);
      await notify("Updates aren't configured for this build.");
    }
  };

  return (
    <div className="tray-window">
      <nav className="context-menu tray-context-menu" role="menu">
        <div className="context-menu__header">
          <span className="context-menu__header-name">
            <span className="context-menu__header-dot" aria-hidden="true" />
            {productName}
          </span>
          {info?.version && (
            <span className="context-menu__header-version">v{info.version}</span>
          )}
        </div>

        <button
          type="button"
          className="context-menu__item"
          role="menuitem"
          onClick={run(() => invoke("hide_main_window"))}
        >
          <HideIcon className="context-menu__icon" />
          <span className="context-menu__label">Hide</span>
          <span className="context-menu__shortcut">{label("window.hide")}</span>
        </button>
        <button
          type="button"
          className="context-menu__item"
          role="menuitem"
          onClick={run(() => invoke("open_configs_folder"))}
        >
          <PreferencesIcon className="context-menu__icon" />
          <span className="context-menu__label">Preferences</span>
          <span className="context-menu__shortcut">
            {label("content.preferences")}
          </span>
        </button>
        <button
          type="button"
          className="context-menu__item"
          role="menuitem"
          onClick={run(checkForUpdates)}
        >
          <CheckUpdatesIcon className="context-menu__icon" />
          <span className="context-menu__label">Check Updates</span>
        </button>

        <div className="context-menu__separator" role="separator" />

        <button
          type="button"
          className="context-menu__item context-menu__item--destructive"
          role="menuitem"
          onClick={run(() => invoke("quit_app"))}
        >
          <QuitIcon className="context-menu__icon" />
          <span className="context-menu__label">Quit {productName}</span>
          <span className="context-menu__shortcut">{label("app.quit")}</span>
        </button>
      </nav>
    </div>
  );
}
