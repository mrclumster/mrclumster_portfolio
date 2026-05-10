"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ArcEye } from "./arc-eye";

const BRACKET_PAIRS = [
  ["[", "]"],
  ["{", "}"],
  ["<", ">"],
  ["(", ")"],
];

const LAYERS = [
  { count: 11, radius: 200 }, // Outer layer
  { count: 9,  radius: 170 }, // Middle layer
  { count: 7,  radius: 140 }, // Inner layer
];

const START_ANGLE = -Math.PI / 3;
const END_ANGLE = Math.PI / 3;
const CONTAINER_WIDTH = 460;
const CONTAINER_HEIGHT = 180;

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
    const allEyes: {
      id: number;
      leftBracket: string;
      rightBracket: string;
      x: number;
      y: number;
      rotation: number;
    }[] = [];
    let idCounter = 0;

    LAYERS.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        const t = i / (layer.count - 1);
        const angle = START_ANGLE + t * (END_ANGLE - START_ANGLE);
        
        const x = Math.sin(angle) * layer.radius;
        const y = layer.radius - Math.cos(angle) * layer.radius;
        
        const brackets = BRACKET_PAIRS[idCounter % BRACKET_PAIRS.length];
        
        allEyes.push({
          id: idCounter++,
          leftBracket: brackets[0],
          rightBracket: brackets[1],
          x: x + CONTAINER_WIDTH / 2,
          y: y + 20,
          rotation: angle * (180 / Math.PI),
        });
      }
    });

    return allEyes;
  }, []);

  if (!mounted) return <div style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }} />;

  return (
    <div className="relative mx-auto select-none pointer-events-none" style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }} aria-hidden>
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
