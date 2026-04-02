"use client";

import { useRef, useState, useCallback } from "react";

interface MousePosition {
  x: number;
  y: number;
  isHovering: boolean;
}

export function useMousePosition() {
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0, isHovering: false });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    if (rafRef.current) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      setPosition({
        x: clientX - rect.left,
        y: clientY - rect.top,
        isHovering: true,
      });
      rafRef.current = 0;
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    setPosition((prev) => ({ ...prev, isHovering: false }));
  }, []);

  return { ref, position, handleMouseMove, handleMouseLeave };
}
