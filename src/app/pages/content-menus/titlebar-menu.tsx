import type { ContextMenuPosition } from "../../types";
import { minimizeWindow, toggleMaximize } from "../../lib/window";

interface TitlebarMenuProps extends ContextMenuPosition {
  onClose: () => void;
}

export default function TitlebarMenu({ x, y, onClose }: TitlebarMenuProps) {
  return (
    <nav
      className="titlebar-context-menu"
      style={{ left: x, top: y }}
      role="menu"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="context-menu__item"
        role="menuitem"
        onClick={() => {
          void minimizeWindow();
          onClose();
        }}
      >
        Minimize
      </button>
      <button
        type="button"
        className="context-menu__item"
        role="menuitem"
        onClick={() => {
          void toggleMaximize();
          onClose();
        }}
      >
        Maximize
      </button>
      <div className="context-menu__separator" role="separator" />
      <button
        type="button"
        className="context-menu__item"
        role="menuitem"
        onClick={onClose}
      >
        Close Menu
      </button>
    </nav>
  );
}
