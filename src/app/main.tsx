import { getCurrentWindow } from "@tauri-apps/api/window";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "@fontsource-variable/plus-jakarta-sans";

import App from "./App";
import SplashWindow from "./pages/splash/SplashWindow";
import TrayMenuWindow from "./pages/tray-menu/TrayMenuWindow";
import "./styles/index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root not found");
}

// Secondary windows (splash, tray-menu) share this bundle; pick the tree by
// Tauri window label (see tauri.conf.json).
const windowLabel = getCurrentWindow().label;
const rootTree =
  windowLabel === "splash" ? (
    <SplashWindow />
  ) : windowLabel === "tray-menu" ? (
    <TrayMenuWindow />
  ) : (
    <App />
  );

createRoot(rootElement).render(<StrictMode>{rootTree}</StrictMode>);
