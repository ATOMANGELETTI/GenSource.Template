import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function getWindow() {
  return getCurrentWindow();
}

async function getMainWindow(): Promise<WebviewWindow | null> {
  return WebviewWindow.getByLabel("main");
}

/** Whether the `main` window is currently visible (used by the tray flyout). */
export async function isMainWindowVisible(): Promise<boolean> {
  const main = await getMainWindow();
  if (!main) {
    return false;
  }
  return main.isVisible();
}

export async function showMainWindow(): Promise<void> {
  const main = await getMainWindow();
  if (!main) {
    return;
  }
  await main.show();
  await main.setFocus();
}

export async function hideMainWindow(): Promise<void> {
  const main = await getMainWindow();
  if (!main) {
    return;
  }
  await main.hide();
}

export async function closeWindow(): Promise<void> {
  await getCurrentWindow().close();
}

export async function minimizeWindow(): Promise<void> {
  await getCurrentWindow().minimize();
}

export async function toggleMaximize(): Promise<void> {
  await getCurrentWindow().toggleMaximize();
}

export async function isWindowMaximized(): Promise<boolean> {
  return getCurrentWindow().isMaximized();
}

/** Starts an OS-native window drag, used by the titlebar menu's "Move" row. */
export async function moveWindow(): Promise<void> {
  await getCurrentWindow().startDragging();
}
