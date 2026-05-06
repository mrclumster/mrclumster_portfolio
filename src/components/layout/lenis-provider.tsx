"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function LenisProvider() {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    if (pathname?.startsWith("/adventure")) return;
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      lerp: 0.1,
    });

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Anchor links — route through Lenis
    const onAnchorClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -64 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
    };
  }, [pathname, reduced]);

  return null;
}
