"use client";

import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  children: ReactNode;
  className?: string;
  size?: number;
  lightOpacity?: number;
  darkOpacity?: number;
}

export function Spotlight({
  children,
  className,
  size = 320,
  lightOpacity = 0.08,
  darkOpacity = 0.14,
}: SpotlightProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
      }}
      onMouseLeave={() => setPos(null)}
      className={cn("relative overflow-hidden", className)}
      style={
        {
          "--spot-x": pos ? `${pos.x}px` : "50%",
          "--spot-y": pos ? `${pos.y}px` : "50%",
          "--spot-light": lightOpacity,
          "--spot-dark": darkOpacity,
          "--spot-size": `${size}px`,
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 dark:hidden"
        style={{
          opacity: pos ? 1 : 0,
          background:
            "radial-gradient(var(--spot-size) circle at var(--spot-x) var(--spot-y), color-mix(in oklch, var(--accent-brand) calc(var(--spot-light) * 100%), transparent), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden transition-opacity duration-300 dark:block"
        style={{
          opacity: pos ? 1 : 0,
          background:
            "radial-gradient(var(--spot-size) circle at var(--spot-x) var(--spot-y), color-mix(in oklch, var(--accent-brand) calc(var(--spot-dark) * 100%), transparent), transparent 60%)",
        }}
      />
      {children}
    </div>
  );
}
