"use client";

import { useRef, useState, useCallback } from "react";

interface UseTiltOptions {
  /** Maximum tilt angle in degrees, defaults to 7 */
  max?: number;
  /** Perspective distance in pixels, defaults to 1000 */
  perspective?: number;
}

const IDENTITY = "perspective(1000px) rotateX(0deg) rotateY(0deg)";

/**
 * Tracks cursor position on a hovered element and returns a CSS transform
 * string that produces a subtle 3D tilt toward the cursor.
 *
 * - RAF-throttled for smoothness
 * - Disabled on coarse pointers (touch) and when prefers-reduced-motion is set
 * - Resets to identity on mouse leave
 */
export function useTilt({ max = 7, perspective = 1000 }: UseTiltOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const [transform, setTransform] = useState<string>(IDENTITY);

  const isInteractive = useCallback(() => {
    if (typeof window === "undefined") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    if (window.matchMedia("(pointer: coarse)").matches) return false;
    return true;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isInteractive()) return;
      const el = ref.current;
      if (!el) return;
      if (rafRef.current) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      rafRef.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        // -1 .. 1 normalized cursor position from center
        const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
        const ny = ((clientY - rect.top) / rect.height) * 2 - 1;
        // rotateX inverts Y (cursor on top tilts card backward)
        const rx = -ny * max;
        const ry = nx * max;
        setTransform(
          `perspective(${perspective}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
        );
        rafRef.current = 0;
      });
    },
    [isInteractive, max, perspective]
  );

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    setTransform(IDENTITY);
  }, []);

  return { ref, transform, handleMouseMove, handleMouseLeave };
}
