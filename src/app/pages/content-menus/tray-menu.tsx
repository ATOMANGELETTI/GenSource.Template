import type { ContextMenuPosition } from "../../types";

interface TrayMenuProps extends ContextMenuPosition {
  onClose: () => void;
}

export default function TrayMenu({ x, y, onClose }: TrayMenuProps) {
  return (
    <nav
      className="tray-context-menu"
      style={{ left: x, top: y }}
      role="menu"
      onClick={(event) => event.stopPropagation()}
    >
      <button
        type="button"
        className="context-menu__item"
        role="menuitem"
        onClick={onClose}
      >
        Show Window
      </button>
      <div className="context-menu__separator" role="separator" />
      <button
        type="button"
        className="context-menu__item"
        role="menuitem"
        onClick={onClose}
      >
        Quit
      </button>
    </nav>
  );
}
