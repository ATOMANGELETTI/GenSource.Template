import { useEffect, useState } from "react";

import {
  closeWindow,
  getWindow,
  isWindowMaximized,
  minimizeWindow,
  toggleMaximize,
} from "../../lib/window";

interface TrafficLightsProps {
  className?: string;
}

export default function TrafficLights({ className }: TrafficLightsProps) {
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    const win = getWindow();
    let unlisten: (() => void) | undefined;

    isWindowMaximized().then(setMaximized);

    win
      .onResized(async () => {
        setMaximized(await isWindowMaximized());
      })
      .then((fn) => {
        unlisten = fn;
      });

    return () => {
      unlisten?.();
    };
  }, []);

  const rootClass = className
    ? `traffic-lights ${className}`
    : "traffic-lights";

  return (
    <div className={rootClass}>
      <button
        type="button"
        className="traffic-light traffic-light--close"
        aria-label="Close"
        onClick={() => void closeWindow()}
      >
        <span className="traffic-light__glyph" aria-hidden="true">
          ×
        </span>
      </button>
      <button
        type="button"
        className="traffic-light traffic-light--minimize"
        aria-label="Minimize"
        onClick={() => void minimizeWindow()}
      >
        <span className="traffic-light__glyph" aria-hidden="true">
          −
        </span>
      </button>
      <button
        type="button"
        className="traffic-light traffic-light--maximize"
        aria-label={maximized ? "Restore" : "Maximize"}
        onClick={() => void toggleMaximize()}
      >
        <span className="traffic-light__glyph" aria-hidden="true">
          {maximized ? "⤡" : "⤢"}
        </span>
      </button>
    </div>
  );
}
