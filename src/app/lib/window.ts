import { getCurrentWindow } from "@tauri-apps/api/window";

export function getWindow() {
  return getCurrentWindow();
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
