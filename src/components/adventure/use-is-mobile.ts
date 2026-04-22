"use client";

import { useEffect, useState } from "react";

// Shared responsive-breakpoint hook for the adventure subtree.
// `isMobile` — viewport width < 768px (tablet boundary)
// `isTouch`  — device reports touch support (phones + touch laptops)
// `width`    — live viewport width for anything that needs direct math
export function useIsMobile() {
  const [state, setState] = useState(() => {
    if (typeof window === "undefined") return { isMobile: false, isTouch: false, width: 1280 };
    const w = window.innerWidth;
    const touch = "ontouchstart" in window || (navigator.maxTouchPoints ?? 0) > 0;
    return { isMobile: w < 768, isTouch: touch, width: w };
  });
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      const touch = "ontouchstart" in window || (navigator.maxTouchPoints ?? 0) > 0;
      setState({ isMobile: w < 768, isTouch: touch, width: w });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return state;
}
