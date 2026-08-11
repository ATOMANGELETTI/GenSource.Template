import { getCurrentWindow } from "@tauri-apps/api/window";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource-variable/plus-jakarta-sans";

import App from "./App";
import TrayMenuWindow from "./pages/tray-menu/TrayMenuWindow";
import "./styles/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found");
}

// The `tray-menu` window (declared in tauri.conf.json) shares this same
// frontend bundle; render its standalone flyout instead of the main shell.
const isTrayMenuWindow = getCurrentWindow().label === "tray-menu";

createRoot(rootElement).render(
  <StrictMode>{isTrayMenuWindow ? <TrayMenuWindow /> : <App />}</StrictMode>,
);
