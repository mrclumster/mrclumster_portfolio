"use client";

import Image from "next/image";
import { useRef, useState, useCallback } from "react";

interface MagneticPhotoProps {
  src: string;
  alt: string;
}

export function MagneticPhoto({ src, alt }: MagneticPhotoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    if (rafRef.current) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    rafRef.current = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // Cap displacement to ~10px
      const dx = (clientX - cx) * 0.15;
      const dy = (clientY - cy) * 0.15;
      setOffset({
        x: Math.max(-10, Math.min(10, dx)),
        y: Math.max(-10, Math.min(10, dy)),
      });
      rafRef.current = 0;
    });
  }, []);

  const handleLeave = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    setOffset({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative h-32 w-32 sm:h-36 sm:w-36 shrink-0"
    >
      {/* Rotating decorative ring */}
      <div
        aria-hidden="true"
        className="absolute -inset-2 rounded-full border border-dashed border-accent-brand/30 dark:border-accent-brand/40"
        style={{ animation: "ring-spin 20s linear infinite" }}
      />
      {/* Face-detection brackets */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{ animation: "detect-pulse 2.5s ease-in-out infinite" }}
      >
        {/* Top-left */}
        <span className="absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2 border-accent-brand rounded-tl-sm" />
        {/* Top-right */}
        <span className="absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2 border-accent-brand rounded-tr-sm" />
        {/* Bottom-left */}
        <span className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-accent-brand rounded-bl-sm" />
        {/* Bottom-right */}
        <span className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-accent-brand rounded-br-sm" />
      </div>
      {/* [ DETECTED ] label */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-5 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest text-accent-brand/70 whitespace-nowrap"
        style={{ animation: "detect-pulse 2.5s ease-in-out infinite" }}
      >
        [ DETECTED ]
      </div>
      {/* Photo with magnetic offset */}
      <div
        className="relative h-full w-full rounded-full bg-background overflow-hidden ring-2 ring-accent-brand/30 transition-transform duration-300 ease-out hover:scale-105"
        style={{
          animation: "photo-glow 3s ease-in-out infinite",
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        <Image
          src={src}
          alt={alt}
          width={288}
          height={288}
          className="h-full w-full object-cover object-top scale-125"
          priority
        />
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_8px_rgba(0,0,0,0.4)] pointer-events-none" />
      </div>
    </div>
  );
}
