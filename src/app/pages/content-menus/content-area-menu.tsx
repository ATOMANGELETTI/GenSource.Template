import type { ContextMenuPosition } from "../../types";

interface ContentAreaMenuProps extends ContextMenuPosition {
  onClose: () => void;
}

export default function ContentAreaMenu({
  x,
  y,
  onClose,
}: ContentAreaMenuProps) {
  return (
    <nav
      className="content-context-menu"
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
        Reload
      </button>
      <button
        type="button"
        className="context-menu__item"
        role="menuitem"
        onClick={onClose}
      >
        Copy
      </button>
      <div className="context-menu__separator" role="separator" />
      <button
        type="button"
        className="context-menu__item context-menu__item--muted"
        role="menuitem"
        onClick={onClose}
      >
        Inspect
      </button>
    </nav>
  );
}
