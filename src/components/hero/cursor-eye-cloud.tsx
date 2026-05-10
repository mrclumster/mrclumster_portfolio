"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { IndividualEye } from "./individual-eye";
import { EyeSpeciesType } from "./eye-species";

const SPECIES: EyeSpeciesType[] = [
  "classic", "observer", "glitch", "lash", "cyber", "feline", 
  "hollow", "binary", "recursive", "clockwork", "ascii", "pulse", 
  "orbit", "crosshair", "static", "shadow"
];

const EYE_COUNT = 18;
const CLOUD_WIDTH = 340;
const CLOUD_HEIGHT = 100;

export function CursorEyeCloud() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isTracking, setIsTracking] = useState(false);
  const [eyes, setEyes] = useState<{ id: number; species: EyeSpeciesType; x: number; y: number }[]>([]);
  const [mounted, setMounted] = useState(false);

  // Generate stable random positions and species on mount (client-side only)
  useEffect(() => {
    setMounted(true);
    const generatedEyes = Array.from({ length: EYE_COUNT }).map((_, i) => {
      // Parabolic arc: y = a * x^2
      // Normalize x to -1 to 1 range
      const t = (i / (EYE_COUNT - 1)) * 2 - 1;
      const xBase = (t * CLOUD_WIDTH) / 2 + CLOUD_WIDTH / 2;
      const yBase = Math.pow(t, 2) * CLOUD_HEIGHT;
      
      return {
        id: i,
        species: SPECIES[Math.floor(Math.random() * SPECIES.length)],
        // Add organic jitter
        x: xBase + (Math.random() - 0.5) * 30,
        y: yBase + (Math.random() - 0.5) * 25,
      };
    });
    setEyes(generatedEyes);
  }, []);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        // Expand tracking zone beyond the element itself
        const trackingPad = 400;
        const inZone = 
          e.clientX >= rect.left - trackingPad &&
          e.clientX <= rect.right + trackingPad &&
          e.clientY >= rect.top - trackingPad &&
          e.clientY <= rect.bottom + trackingPad;
        
        setIsTracking(inZone);
      }
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  if (!mounted) return <div style={{ width: CLOUD_WIDTH, height: CLOUD_HEIGHT + 20 }} />;

  return (
    <div 
      ref={containerRef}
      className="relative mx-auto select-none pointer-events-none"
      style={{ width: CLOUD_WIDTH, height: CLOUD_HEIGHT + 20 }}
      aria-hidden
    >
      {eyes.map((eye) => (
        <IndividualEye 
          key={eye.id}
          species={eye.species}
          x={eye.x}
          y={eye.y}
          isTracking={isTracking}
          mousePos={mousePos}
        />
      ))}
    </div>
  );
}
