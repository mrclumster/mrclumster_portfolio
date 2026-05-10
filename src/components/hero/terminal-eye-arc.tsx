"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ArcEye } from "./arc-eye";

const BRACKET_PAIRS = [
  ["[", "]"],
  ["{", "}"],
  ["<", ">"],
  ["(", ")"],
];

const EYE_COUNT = 9;
const ARC_RADIUS = 130;
// Span from -60 degrees to +60 degrees
const START_ANGLE = -Math.PI / 3;
const END_ANGLE = Math.PI / 3;

export function TerminalEyeArc() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMove = (e: PointerEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  const eyes = useMemo(() => {
    return Array.from({ length: EYE_COUNT }).map((_, i) => {
      // Interpolate angle from -60 to +60 degrees
      const t = i / (EYE_COUNT - 1);
      const angle = START_ANGLE + t * (END_ANGLE - START_ANGLE);
      
      // Calculate x, y position along the circular arc
      // Center of the arc is roughly at (0, ARC_RADIUS)
      const x = Math.sin(angle) * ARC_RADIUS;
      const y = ARC_RADIUS - Math.cos(angle) * ARC_RADIUS;
      
      const brackets = BRACKET_PAIRS[i % BRACKET_PAIRS.length];
      
      return {
        id: i,
        leftBracket: brackets[0],
        rightBracket: brackets[1],
        x: x + 170, // Shift to center in 340px container
        y: y + 10,  // Base offset
        rotation: angle * (180 / Math.PI), // Point towards center
      };
    });
  }, []);

  if (!mounted) return <div style={{ width: 340, height: 100 }} />;

  return (
    <div className="relative mx-auto select-none pointer-events-none" style={{ width: 340, height: 100 }} aria-hidden>
      {eyes.map((eye) => (
        <ArcEye 
          key={eye.id}
          leftBracket={eye.leftBracket}
          rightBracket={eye.rightBracket}
          x={eye.x}
          y={eye.y}
          rotation={eye.rotation}
          mousePos={mousePos}
        />
      ))}
    </div>
  );
}
