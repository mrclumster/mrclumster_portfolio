"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function CursorFollower() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -100, y: -100 });
  const cur = useRef({ x: -100, y: -100 });
  const [interactive, setInteractive] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(hover: none)").matches;
    if (isTouch || reduced) {
      setEnabled(false);
      return;
    }
    if (pathname?.startsWith("/adventure")) {
      setEnabled(false);
      return;
    }
    setEnabled(true);
  }, [pathname, reduced]);

  useEffect(() => {
    if (!enabled) return;

    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
      const el = e.target as HTMLElement | null;
      const isInteractive = !!el?.closest(
        'a, button, [role="button"], input, textarea, select, [data-cursor="hover"]',
      );
      setInteractive(isInteractive);
    };

    let raf = 0;
    const tick = () => {
      cur.current.x += (target.current.x - cur.current.x) * 0.18;
      cur.current.y += (target.current.y - cur.current.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${target.current.x}px, ${target.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${cur.current.x}px, ${cur.current.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] h-1.5 w-1.5 rounded-full mix-blend-difference"
        style={{
          background: "var(--accent-brand)",
          opacity: interactive ? 0 : 1,
          transition: "opacity 200ms ease",
        }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[99] rounded-full mix-blend-difference"
        style={{
          width: interactive ? 32 : 12,
          height: interactive ? 32 : 12,
          border: `1px solid var(--accent-brand)`,
          opacity: interactive ? 0.7 : 0.45,
          transition: "width 240ms ease, height 240ms ease, opacity 240ms ease",
        }}
      />
    </>
  );
}
