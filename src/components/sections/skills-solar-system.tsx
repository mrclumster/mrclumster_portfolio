"use client";

import { useEffect, useRef } from "react";
import { techStack } from "@/data/tech-stack";

type Planet = {
  name: string;
  color: string;
  orbitRadius: number;
  speed: number;
  angle: number;
  size: number;
  category: string;
};

function buildPlanets(w: number, h: number): Planet[] {
  const cx = w / 2;
  const cy = h / 2;
  const maxOrbit = Math.min(cx, cy) - 32;

  const all = techStack.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, category: cat.category }))
  );

  const orbitCount = 3;
  const perOrbit = Math.ceil(all.length / orbitCount);

  return all.map((item, i) => {
    const ring = Math.floor(i / perOrbit);
    const orbitFrac = (ring + 1) / (orbitCount + 0.5);
    const orbitRadius = maxOrbit * orbitFrac;
    const angleStep = (Math.PI * 2) / perOrbit;
    const baseAngle = (i % perOrbit) * angleStep + ring * 0.9;
    const speed = (0.0004 + 0.0002 * (orbitCount - ring)) * (i % 2 === 0 ? 1 : -1);
    return {
      name: item.name,
      color: item.color,
      orbitRadius,
      speed,
      angle: baseAngle,
      size: 5 + (i % 3),
      category: item.category,
    };
  });
}

export function SkillsSolarSystem() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const planetsRef = useRef<Planet[]>([]);
  const mouseRef = useRef<{ x: number; y: number } | null>(null);
  const hoveredRef = useRef<string | null>(null);
  const rafRef = useRef<number>(0);
  const isDark = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function getColors() {
      const dark = document.documentElement.classList.contains("dark");
      isDark.current = dark;
      return {
        bg: dark ? "#1a1a1a" : "#f4f2ed",
        ink: dark ? "#e8e4dc" : "#1a1a1a",
        orbit: dark ? "rgba(232,228,220,0.08)" : "rgba(26,26,26,0.08)",
        label: dark ? "rgba(232,228,220,0.75)" : "rgba(26,26,26,0.75)",
      };
    }

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.scale(dpr, dpr);
      planetsRef.current = buildPlanets(w, h);
    }

    function draw() {
      const w = canvas!.offsetWidth;
      const h = canvas!.offsetHeight;
      const cx = w / 2;
      const cy = h / 2;
      const colors = getColors();

      ctx!.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;
      const slowFactor = mouse ? 0.15 : 1;

      planetsRef.current.forEach((p) => {
        p.angle += p.speed * slowFactor;
      });

      // Draw orbit rings
      const orbits = [...new Set(planetsRef.current.map((p) => p.orbitRadius))];
      orbits.forEach((r) => {
        ctx!.beginPath();
        ctx!.arc(cx, cy, r, 0, Math.PI * 2);
        ctx!.strokeStyle = colors.orbit;
        ctx!.lineWidth = 1;
        ctx!.stroke();
      });

      // Sun (center)
      const sunGrad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 18);
      sunGrad.addColorStop(0, isDark.current ? "rgba(232,228,220,0.9)" : "rgba(26,26,26,0.85)");
      sunGrad.addColorStop(1, isDark.current ? "rgba(232,228,220,0)" : "rgba(26,26,26,0)");
      ctx!.beginPath();
      ctx!.arc(cx, cy, 18, 0, Math.PI * 2);
      ctx!.fillStyle = sunGrad;
      ctx!.fill();
      ctx!.beginPath();
      ctx!.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx!.fillStyle = isDark.current ? "#e8e4dc" : "#1a1a1a";
      ctx!.fill();

      // Planets + labels
      let newHovered: string | null = null;
      planetsRef.current.forEach((p) => {
        const px = cx + Math.cos(p.angle) * p.orbitRadius;
        const py = cy + Math.sin(p.angle) * p.orbitRadius;

        const isHovered =
          mouse !== null &&
          Math.hypot(px - mouse.x, py - mouse.y) < p.size + 10;

        if (isHovered) newHovered = p.name;

        // Glow on hover
        if (isHovered) {
          ctx!.beginPath();
          ctx!.arc(px, py, p.size + 6, 0, Math.PI * 2);
          ctx!.fillStyle = p.color + "44";
          ctx!.fill();
        }

        ctx!.beginPath();
        ctx!.arc(px, py, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = p.color;
        ctx!.fill();

        if (isHovered) {
          const label = p.name;
          ctx!.font = `bold 11px 'Courier New', monospace`;
          ctx!.textAlign = "center";
          const tw = ctx!.measureText(label).width;
          const lx = px;
          const ly = py - p.size - 14;
          ctx!.fillStyle = isDark.current ? "rgba(26,26,26,0.85)" : "rgba(244,242,237,0.92)";
          ctx!.fillRect(lx - tw / 2 - 5, ly - 11, tw + 10, 16);
          ctx!.fillStyle = isDark.current ? "#e8e4dc" : "#1a1a1a";
          ctx!.fillText(label, lx, ly);
        }
      });

      hoveredRef.current = newHovered;
      canvas!.style.cursor = newHovered ? "pointer" : "default";

      rafRef.current = requestAnimationFrame(draw);
    }

    function onMouseMove(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    function onMouseLeave() {
      mouseRef.current = null;
    }

    resize();
    draw();

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full" style={{ height: 340 }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-label="Interactive skills solar system — hover to slow orbits"
      />
      <p className="absolute bottom-2 right-3 text-[10px] opacity-30 font-mono tracking-widest pointer-events-none">
        hover to slow · skills orbit
      </p>
    </div>
  );
}
