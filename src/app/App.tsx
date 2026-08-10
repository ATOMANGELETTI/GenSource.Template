import { useCallback, useEffect, useState, type MouseEvent } from "react";

import Titlebar from "./components/layout/Titlebar";
import ContentAreaMenu from "./pages/content-menus/content-area-menu";
import TitlebarMenu from "./pages/content-menus/titlebar-menu";
import TrayMenu from "./pages/content-menus/tray-menu";
import WindowPage from "./pages/window/window";
import type { ContextMenuState, ContextMenuTarget } from "./types";

const CLOSED_MENU: ContextMenuState = { target: null, x: 0, y: 0 };

export default function App() {
  const [menu, setMenu] = useState<ContextMenuState>(CLOSED_MENU);

  const closeMenu = useCallback(() => {
    setMenu(CLOSED_MENU);
  }, []);

  const openMenu = useCallback(
    (target: ContextMenuTarget, event: MouseEvent<HTMLElement>) => {
      event.preventDefault();
      setMenu({ target, x: event.clientX, y: event.clientY });
    },
    [],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeMenu]);

  return (
    <div className="app-shell" onClick={closeMenu}>
      <Titlebar onContextMenu={(event) => openMenu("titlebar", event)} />
      <main
        className="app-shell__main"
        onContextMenu={(event) => openMenu("content", event)}
      >
        <WindowPage />
      </main>

      {menu.target === "titlebar" && (
        <TitlebarMenu x={menu.x} y={menu.y} onClose={closeMenu} />
      )}
      {menu.target === "content" && (
        <ContentAreaMenu x={menu.x} y={menu.y} onClose={closeMenu} />
      )}
      {menu.target === "tray" && (
        <TrayMenu x={menu.x} y={menu.y} onClose={closeMenu} />
      )}
    </div>
  );
}
