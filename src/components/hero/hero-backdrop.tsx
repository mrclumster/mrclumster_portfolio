"use client";

import { useEffect, useRef } from "react";

const GRID_SIZE = 32;
const REVEAL_INNER_PCT = 12;
const REVEAL_OUTER_PCT = 60;

export function HeroBackdrop() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const section = el.parentElement;
    if (!section) return;

    const onMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };

    const onLeave = () => {
      el.style.setProperty("--mx", "-9999px");
      el.style.setProperty("--my", "-9999px");
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const gridImage = `
    repeating-linear-gradient(0deg, var(--ink) 0 1px, transparent 1px ${GRID_SIZE}px),
    repeating-linear-gradient(90deg, var(--ink) 0 1px, transparent 1px ${GRID_SIZE}px)
  `;

  const maskImage = `radial-gradient(circle at var(--mx) var(--my), black 0%, black ${REVEAL_INNER_PCT}%, transparent ${REVEAL_OUTER_PCT}%)`;

  return (
    <div
      ref={ref}
      aria-hidden
      className="motion-safe:opacity-100 motion-reduce:!opacity-[0.04] absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: gridImage,
        WebkitMaskImage: maskImage,
        maskImage,
        ["--mx" as string]: "-9999px",
        ["--my" as string]: "-9999px",
      }}
    />
  );
}
