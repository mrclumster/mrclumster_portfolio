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
  { count: 9, radius: 420 }, // Outer layer (reduced from 11)
  { count: 7, radius: 395 }, // Middle layer (reduced from 9)
  { count: 5, radius: 370 }, // Inner layer (reduced from 7)
];

const START_ANGLE = -Math.PI / 6;
const END_ANGLE = Math.PI / 6;
const CONTAINER_WIDTH = 500;
const CONTAINER_HEIGHT = 120;

const SHAPES = ["circle", "square", "diamond"];

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
      shape: string;
    }[] = [];
    let idCounter = 0;

    LAYERS.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        const t = i / (layer.count - 1);
        const angle = START_ANGLE + t * (END_ANGLE - START_ANGLE);
        
        const x = Math.sin(angle) * layer.radius;
        // Fix: Use a single shared focal point for all layers so they don't stack
        const FOCAL_Y = 440;
        const y = FOCAL_Y - Math.cos(angle) * layer.radius;
        
        const brackets = BRACKET_PAIRS[idCounter % BRACKET_PAIRS.length];
        
        allEyes.push({
          id: idCounter++,
          leftBracket: brackets[0],
          rightBracket: brackets[1],
          x: x + CONTAINER_WIDTH / 2,
          y: y,
          rotation: angle * (180 / Math.PI),
          shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
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
          shape={eye.shape}
        />
      ))}
    </div>
  );
}
