export type { AppInfo, GreetArgs, GreetResponse } from './tauri';

export interface ContextMenuPosition {
  x: number;
  y: number;
}

export type ContextMenuTarget = 'titlebar' | 'content' | 'tray';

export interface ContextMenuState extends ContextMenuPosition {
  target: ContextMenuTarget | null;
}
