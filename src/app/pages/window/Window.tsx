import { arch, platform } from "@tauri-apps/plugin-os";
import { useEffect, useState } from "react";

import { fetchAppInfo } from "../../lib/settings";

const PLATFORM_LABELS: Record<string, string> = {
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
};

export default function WindowPage() {
  const [buildLine, setBuildLine] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      try {
        const info = await fetchAppInfo();
        const platformName = PLATFORM_LABELS[platform()] ?? platform();
        const archName = arch();
        if (!cancelled) {
          setBuildLine(`v${info.version} · ${platformName} (${archName})`);
        }
      } catch (error) {
        console.warn("Failed to load build info", error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="window-content fade-in-up">
      <div className="window-hero">
        <h2 className="window-hero__title">GenSource Template</h2>
        <p className="window-hero__tagline">
          A Tauri v2 desktop suite template — flat Nord chrome, ready to extend.
        </p>
        {buildLine && <p className="window-hero__build">{buildLine}</p>}
      </div>
    </section>
  );
}
