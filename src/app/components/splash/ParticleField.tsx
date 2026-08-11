import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  homeX: number;
  homeY: number;
  vx: number;
  vy: number;
  radius: number;
  phase: number;
  speed: number;
  colorIndex: number;
};

type ParticleFieldProps = {
  className?: string;
  /** When false, the animation loop stops (splash dismissing). */
  active?: boolean;
};

const PARTICLE_COUNT = 120;
const COLOR_VARS = ["--nord8", "--nord9", "--nord10"] as const;

function readCssColor(varName: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return value || fallback;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Lightweight Antigravity-inspired 2D particle field: soft Nord frost dots
 * with sine drift and a gentle cursor magnet. No WebGL / Three.js.
 */
export default function ParticleField({
  className,
  active = true,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frameId = 0;
    let particles: Particle[] = [];
    let reduced = prefersReducedMotion();
    let running = active;

    const colors = COLOR_VARS.map((name, index) =>
      readCssColor(
        name,
        index === 0 ? "#88c0d0" : index === 1 ? "#81a1c1" : "#5e81ac",
      ),
    );

    const spawnParticles = () => {
      particles = Array.from({ length: PARTICLE_COUNT }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x,
          y,
          homeX: x,
          homeY: y,
          vx: 0,
          vy: 0,
          radius: 1.1 + Math.random() * 1.8,
          phase: Math.random() * Math.PI * 2,
          speed: 0.35 + Math.random() * 0.55,
          colorIndex: Math.floor(Math.random() * colors.length),
        };
      });
    };

    const resize = () => {
      const parent = canvas.parentElement;
      const nextWidth = parent?.clientWidth ?? window.innerWidth;
      const nextHeight = parent?.clientHeight ?? window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawnParticles();
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.fillStyle = colors[p.colorIndex] ?? colors[0];
        ctx.globalAlpha = 0.35;
        ctx.arc(p.homeX, p.homeY, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const tick = (time: number) => {
      if (!running) {
        return;
      }

      if (reduced) {
        drawStatic();
        return;
      }

      const t = time * 0.001;
      const pointer = pointerRef.current;

      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        const driftX = Math.sin(t * p.speed + p.phase) * 14;
        const driftY = Math.cos(t * p.speed * 0.85 + p.phase) * 12;
        let targetX = p.homeX + driftX;
        let targetY = p.homeY + driftY;

        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.hypot(dx, dy) || 1;
          const magnetRadius = 140;
          if (dist < magnetRadius) {
            const pull = (1 - dist / magnetRadius) * 28;
            targetX += (dx / dist) * pull;
            targetY += (dy / dist) * pull;
          }
        }

        p.vx += (targetX - p.x) * 0.04;
        p.vy += (targetY - p.y) * 0.04;
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;

        ctx.beginPath();
        ctx.fillStyle = colors[p.colorIndex] ?? colors[0];
        ctx.globalAlpha = 0.28 + (p.radius / 3) * 0.22;
        // Soft capsule: elongated ellipse for a bit of Antigravity shape variety.
        ctx.ellipse(
          p.x,
          p.y,
          p.radius * (1.1 + (p.colorIndex % 2) * 0.35),
          p.radius * 0.75,
          p.phase,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      frameId = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      };
    };

    const onPointerLeave = () => {
      pointerRef.current = { x: -9999, y: -9999, active: false };
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      reduced = event.matches;
      if (reduced) {
        cancelAnimationFrame(frameId);
        drawStatic();
      } else if (running) {
        frameId = requestAnimationFrame(tick);
      }
    };

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener("change", onMotionChange);

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);

    if (reduced) {
      drawStatic();
    } else if (running) {
      frameId = requestAnimationFrame(tick);
    }

    return () => {
      running = false;
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      motionQuery.removeEventListener("change", onMotionChange);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
}
